// RSVP playback engine: decides what to show and for how long.
import { F_SENTENCE, F_CLAUSE, F_PARA, F_HEADING } from './text.js';
import { chunkStarts, chunkStartOf, chunkEndOf } from './chunk.js';

const RAMP_WORDS = 5; // start slower after (re)starting, then reach full speed

/** Optimal recognition point: which letter the eye should fix on. */
export function pivotIndex(word) {
  const lead = word.match(/^[^A-Za-z0-9]*/)[0].length;
  const letters = word.replace(/[^A-Za-z0-9'’-]/g, '').length || word.length;
  const orp = letters <= 1 ? 0 : letters <= 5 ? 1 : letters <= 9 ? 2 : letters <= 13 ? 3 : 4;
  return Math.min(lead + orp, word.length - 1);
}

export class RsvpPlayer {
  /**
   * @param doc prepared document from text.prepare()
   * @param opts {onFrame(start,end), onState(playing), onRead(words, ms), onEnd()}
   */
  constructor(doc, opts) {
    this.doc = doc;
    this.opts = opts;
    this.pos = 0;
    this.playing = false;
    this.settings = { wpm: 250, chunk: 1, pause: 1 };
    this.timer = null;
  }

  configure(s) {
    Object.assign(this.settings, s);
  }

  /** End (exclusive) of the frame starting at i. Chunks never cross a pause. */
  frameEnd(i) {
    const { words, flags } = this.doc;
    let end = i + 1;
    if (flags[i] & F_HEADING) {
      while (end < words.length && flags[end] & F_HEADING && !(flags[end - 1] & F_PARA)) end++;
      return end;
    }
    const chunk = this.settings.chunk;
    if (chunk === 'phrase') return chunkEndOf(this.phrases(), i);
    let chars = words[i].length;
    while (end < words.length && end - i < chunk && !(flags[end - 1] & (F_SENTENCE | F_CLAUSE | F_PARA))) {
      chars += words[end].length + 1;
      if (chars > 22) break;
      end++;
    }
    return end;
  }

  /** Meaning-unit chunk starts, computed once per book when slash-reading mode is used. */
  phrases() {
    return (this.doc.chunkStarts ||= chunkStarts(this.doc));
  }

  /** [start, end) of the frame that shows token i (the whole phrase in slash-reading mode). */
  frameAround(i) {
    if (this.settings.chunk !== 'phrase' || this.doc.flags[i] & F_HEADING) return [i, i + 1];
    const s = this.phrases();
    return [chunkStartOf(s, i), chunkEndOf(s, i)];
  }

  duration(start, end, ramp) {
    const { words, flags } = this.doc;
    const base = 60000 / this.settings.wpm;
    const p = this.settings.pause;
    let total = 0;
    for (let i = start; i < end; i++) {
      const len = words[i].replace(/[^A-Za-z0-9]/g, '').length;
      let m = 1;
      if (len > 7) m += Math.min(0.8, (len - 7) * 0.1);
      if (/\d/.test(words[i])) m += 0.3;
      total += base * m;
    }
    const f = flags[end - 1];
    if (f & F_HEADING) total += base * 3;
    else if (f & F_PARA) total += base * 1.8 * p;
    else if (f & F_SENTENCE) total += base * 1.3 * p;
    else if (f & F_CLAUSE) total += base * 0.6 * p;
    if (ramp < RAMP_WORDS) total *= 1 + (RAMP_WORDS - ramp) * 0.15;
    return total;
  }

  show() {
    const end = this.frameEnd(this.pos);
    this.opts.onFrame(this.pos, end);
    return end;
  }

  seek(i) {
    this.pos = Math.max(0, Math.min(i, this.doc.words.length - 1));
    this.ramp = 0;
    this.show();
  }

  play() {
    if (this.playing) return;
    if (this.pos >= this.doc.words.length - 1) this.pos = 0;
    this.playing = true;
    this.ramp = 0;
    this.opts.onState(true);
    this.nextAt = performance.now();
    this.tick();
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    clearTimeout(this.timer);
    this.opts.onState(false);
  }

  tick() {
    if (!this.playing) return;
    const start = this.pos;
    const end = this.show();
    const ms = this.duration(start, end, this.ramp);
    this.ramp += end - start;
    const now = performance.now();
    if (now - this.nextAt > 200) this.nextAt = now; // don't rush to catch up after a stall
    this.timer = setTimeout(() => {
      if (!this.playing) return;
      this.opts.onRead(start, end, ms);
      if (end >= this.doc.words.length) {
        this.playing = false;
        this.opts.onState(false);
        this.opts.onEnd();
        return;
      }
      this.pos = end;
      this.tick();
    }, Math.max(0, this.nextAt + ms - performance.now()));
    this.nextAt += ms;
  }

  /** Estimated milliseconds to read from token i to the end at the current speed. */
  remainingMs(i) {
    const words = this.doc.words.length - i;
    const pauseFactor = 1 + 0.12 * this.settings.pause;
    return (words / this.settings.wpm) * 60000 * pauseFactor;
  }
}
