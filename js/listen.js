// Reading while listening: speak the text sentence by sentence and show the word being spoken.
// Word positions come from the speech engine's boundary events when it sends them; otherwise
// they are estimated from the speaking speed and re-synced at the end of every sentence.
import { utterance } from './speech.js';
import { F_SENTENCE, F_PARA, F_CLAUSE } from './text.js';

const BASE_WPM = 170; // typical text-to-speech speed at rate 1.0
export const rateFor = (wpm) => Math.min(2, Math.max(0.5, wpm / BASE_WPM));

export class ListenDriver {
  /**
   * @param player the RsvpPlayer (its doc, pos and callbacks are shared)
   * @param opts {settings: () => settings, onError(code)}
   */
  constructor(player, opts) {
    this.player = player;
    this.doc = player.doc;
    this.cb = player.opts;
    this.opts = opts;
    this.playing = false;
    this.seg = null;
    this.charsPerMs = 0.015; // at rate 1.0; calibrated from each finished sentence
    this.engineSendsBoundaries = false; // learned from the first boundary event
  }

  /** End (exclusive) of the piece to speak: one sentence, cut at a comma if it is very long. */
  segmentEnd(i) {
    const { words, flags } = this.doc;
    let j = i;
    let n = 0;
    while (j < words.length) {
      const f = flags[j++];
      n++;
      if (f & (F_SENTENCE | F_PARA)) break;
      if ((n >= 30 && f & F_CLAUSE) || n >= 60) break;
    }
    return j;
  }

  play() {
    if (this.playing) return;
    if (this.player.pos >= this.doc.words.length - 1) this.player.pos = 0;
    this.playing = true;
    this.player.playing = true;
    this.cb.onState(true);
    this.speakFrom(this.player.pos);
  }

  async speakFrom(i) {
    const { words } = this.doc;
    const end = this.segmentEnd(i);
    const offsets = [];
    let text = '';
    for (let k = i; k < end; k++) {
      if (k > i) text += ' ';
      offsets.push(text.length);
      text += words[k];
    }
    const s = this.opts.settings();
    const u = await utterance(text, s.voice);
    if (!this.playing) return;
    if (typeof u === 'string') {
      this.stop();
      this.opts.onError(u);
      return;
    }
    u.rate = rateFor(s.wpm);
    const seg = { i, end, shown: i, start: performance.now(), boundary: false, rate: u.rate };
    this.seg = seg;
    const tokenAt = (charIndex) => {
      let k = 0;
      while (k + 1 < offsets.length && offsets[k + 1] <= charIndex) k++;
      return i + k;
    };
    const show = (k) => {
      if (this.seg !== seg || k === seg.shown || k < i || k >= end) return;
      seg.shown = k;
      this.player.pos = k;
      // One word at a time, or in slash-reading mode the whole phrase being spoken.
      const [a, b] = this.player.frameAround(k);
      if (a !== seg.frame) this.cb.onFrame(a, b);
      seg.frame = a;
    };
    u.onstart = () => (seg.start = performance.now());
    u.onboundary = (ev) => {
      if (ev.name && ev.name !== 'word') return;
      seg.boundary = true;
      this.engineSendsBoundaries = true;
      show(tokenAt(ev.charIndex));
    };
    u.onend = () => {
      if (this.seg !== seg) return;
      this.seg = null;
      clearInterval(this.timer);
      const ms = performance.now() - seg.start;
      if (!seg.boundary && end - i > 3) this.engineSilent = true; // a whole sentence without boundary events
      if (text.length > 30 && ms > 300) this.charsPerMs = this.charsPerMs * 0.6 + (text.length / ms / seg.rate) * 0.4;
      this.player.pos = end;
      this.cb.onRead(i, end, ms);
      if (!this.playing) return; // onRead may pause (comprehension check)
      if (end >= words.length) {
        this.stop();
        this.cb.onEnd();
        return;
      }
      this.speakFrom(end);
    };
    u.onerror = (ev) => {
      if (this.seg !== seg || ev.error === 'interrupted' || ev.error === 'canceled') return;
      this.stop();
      this.opts.onError(ev.error);
    };
    clearInterval(this.timer);
    // Estimate the position only for engines that don't report word boundaries
    // (give the first sentence a moment to find out, so the display doesn't jump back).
    this.timer = setInterval(() => {
      const elapsed = performance.now() - seg.start;
      if (seg.boundary || this.engineSendsBoundaries || (!this.engineSilent && elapsed < 800)) return;
      show(tokenAt(elapsed * this.charsPerMs * seg.rate));
    }, 40);
    this.player.pos = i;
    const [a, b] = this.player.frameAround(i);
    seg.frame = a;
    this.cb.onFrame(a, b);
    speechSynthesis.speak(u);
  }

  stop() {
    if (!this.playing) return;
    this.playing = false;
    this.player.playing = false;
    clearInterval(this.timer);
    const seg = this.seg;
    this.seg = null;
    speechSynthesis.cancel();
    // Count the part of the sentence that was already spoken.
    if (seg && seg.shown > seg.i) this.cb.onRead(seg.i, seg.shown, performance.now() - seg.start);
    this.cb.onState(false);
  }
}
