// Reader screen: RSVP stage, controls, context view with tappable words, chapters.
import { RsvpPlayer, pivotIndex } from './rsvp.js';
import { F_HEADING, countWords, paraOf, paraRange, sentenceStart, nextSentence, chapterAt, pickPassage } from './text.js';
import { startTraining } from './training.js';
import { openDictSheet } from './dictSheet.js';
import { NO_VOICE_HELP } from './speech.js';
import { translate, QuotaError } from './translate.js';
import { ListenDriver } from './listen.js';
import * as coach from './coach.js';

const MODES = [1, 2, 3, 'phrase'];
const modeLabel = (c) => (c === 'phrase' ? 'まとまり' : `${c}語`);
import { $, esc, fmtDuration, icons, openSheet, closeSheet, pushLayer, popLayer, toast } from './ui.js';

const FONT_SIZES = [30, 36, 44, 52, 62];
const WPM_MIN = 100;
const WPM_MAX = 1000;

export class Reader {
  /**
   * @param host callbacks: saveProgress(book, pos), addReading(book, words, ms), finished(book),
   *             saveSettings(partial), settings (live object), recordCheck(book, rating, words) -> suggestion,
   *             showLevel(level)
   */
  constructor(host) {
    this.host = host;
    this.el = $('#reader');
    this.wordEl = $('#word');
    this.contextEl = $('#context');
    this.progressEl = $('#r-progress');
    this.pending = { words: 0, ms: 0, lw: 0, lms: 0 };
    this.wakeLock = null;
    this.bind();
  }

  bind() {
    const on = (id, fn) => $(id).addEventListener('click', fn);
    on('#r-back', () => popLayer());
    on('#r-toc', () => this.showChapters());
    on('#r-listen', () => this.toggleListen());
    on('#r-mode', () => this.cycleMode());
    on('#r-play', () => this.toggle());
    on('#r-prev-sent', () => this.jump(sentenceStart(this.doc, Math.max(0, sentenceStart(this.doc, this.player.pos) - 1))));
    on('#r-next-sent', () => this.jump(nextSentence(this.doc, this.player.pos)));
    on('#r-back10', () => this.jump(this.player.pos - 10));
    on('#r-fwd10', () => this.jump(this.player.pos + 10));
    on('#r-slower', () => this.setWpm(this.host.settings.wpm - 25));
    on('#r-faster', () => this.setWpm(this.host.settings.wpm + 25));
    $('#stage').addEventListener('click', () => this.toggle());

    this.progressEl.addEventListener('input', () => {
      this.pause();
      this.jump(Number(this.progressEl.value));
    });

    this.contextEl.addEventListener('click', (e) => {
      if (e.target.closest('[data-train]')) return this.openTraining();
      if (e.target.closest('[data-reveal]')) {
        this.revealed = true;
        return this.renderContext();
      }
      if (e.target.closest('[data-ja-toggle]')) {
        this.host.saveSettings({ showJa: !this.host.settings.showJa });
        return this.renderContext();
      }
      const t = e.target.closest('[data-tr]');
      if (t) return this.translatePara(Number(t.dataset.tr));
      const w = e.target.closest('[data-i]');
      if (w) this.showWord(Number(w.dataset.i));
    });

    document.addEventListener('keydown', (e) => {
      if (this.el.hidden || e.target.matches('input, textarea')) return;
      const k = e.key;
      if (k === ' ') this.toggle();
      else if (k === 'ArrowLeft') $('#r-prev-sent').click();
      else if (k === 'ArrowRight') $('#r-next-sent').click();
      else if (k === 'ArrowUp') this.setWpm(this.host.settings.wpm + 25);
      else if (k === 'ArrowDown') this.setWpm(this.host.settings.wpm - 25);
      else return;
      e.preventDefault();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.player) {
        this.pause();
        this.save();
      } else if (!document.hidden && this.player?.playing) this.requestWakeLock();
    });
    window.addEventListener('resize', () => this.player && this.player.show());
  }

  open(book, doc) {
    this.book = book;
    this.doc = doc;
    this.justSeeked = true;
    this.player = new RsvpPlayer(doc, {
      onFrame: (s, e) => this.renderFrame(s, e),
      onState: (playing) => this.onState(playing),
      onRead: (s, e, ms) => this.onRead(s, e, ms),
      onEnd: () => this.onEnd(),
    });
    this.listen = new ListenDriver(this.player, {
      settings: () => this.host.settings,
      onError: (code) => this.listenError(code),
    });
    this.sinceCheck = 0;
    this.applySettings();
    this.progressEl.max = doc.words.length - 1;
    $('#r-book').textContent = book.title;
    $('#r-toc').hidden = !doc.chapters.length;
    this.el.hidden = false;
    document.body.classList.add('reading');
    pushLayer(() => this.close());
    this.player.seek(Math.min(book.pos || 0, doc.words.length - 1));
    this.updateNextChapter();
    this.onState(false);
    this.autosave = setInterval(() => this.player.playing && this.save(), 15000);
  }

  close() {
    this.pause();
    this.save();
    clearInterval(this.autosave);
    this.el.hidden = true;
    document.body.classList.remove('reading');
    this.host.closed(this.book);
    this.player = null;
  }

  applySettings() {
    const s = this.host.settings;
    this.player.configure({ wpm: s.wpm, chunk: s.chunk, pause: s.pause });
    this.el.style.setProperty('--rsvp-size', `${FONT_SIZES[s.fontSize] || 44}px`);
    this.el.dataset.font = s.font;
    this.el.dataset.orp = s.orp ? 'on' : 'off';
    $('#r-wpm').textContent = s.wpm;
    $('#r-mode').textContent = modeLabel(s.chunk);
    this.el.dataset.mode = s.chunk === 'phrase' ? 'phrase' : 'words';
    this.el.dataset.listen = s.listen ? 'on' : 'off';
    this.el.dataset.hide = this.isListeningOnly() ? 'on' : 'off';
    $('#r-listen').setAttribute('aria-pressed', String(!!s.listen));
    $('#r-listen').setAttribute('aria-label', s.listen ? (s.hideText ? '多聴モード（文字なし）' : '聞き読みモード') : '音声モード オフ');
  }

  /** 1語 → 2語 → 3語 → まとまり (slash reading) → 1語 */
  cycleMode() {
    const next = MODES[(MODES.indexOf(this.host.settings.chunk) + 1) % MODES.length];
    this.host.saveSettings({ chunk: next });
    this.applySettings();
    if (!this.player.playing) {
      if (next === 'phrase') this.player.pos = this.player.frameAround(this.player.pos)[0];
      this.player.show();
      this.renderContext();
    }
    toast(next === 'phrase' ? '意味のまとまり（スラッシュリーディング）で表示します' : `${next}語ずつ表示します`, 2000);
  }

  isPlaying() {
    return !!this.player?.playing;
  }

  pause() {
    if (!this.player) return;
    if (this.listen.playing) this.listen.stop();
    else this.player.pause();
  }

  /** 多聴: listening mode with the text hidden (listen to understand, check the text afterwards). */
  isListeningOnly() {
    return !!(this.host.settings.listen && this.host.settings.hideText);
  }

  /** 🎧: off -> 聞き読み (speak + show the spoken word) -> 多聴 (speak, text hidden) -> off */
  toggleListen() {
    const s = this.host.settings;
    const next = !s.listen ? { listen: true, hideText: false } : !s.hideText ? { listen: true, hideText: true } : { listen: false, hideText: false };
    this.pause();
    this.host.saveSettings(next);
    this.revealed = false;
    this.applySettings();
    this.renderContext();
    toast(
      !next.listen
        ? '音声モードをオフにしました'
        : next.hideText
          ? '多聴モード: 文字を見ずに聞いて理解します。止めると本文を確認できます（目標: 理解度80%）'
          : '聞き読みモード: 音声に合わせて表示します（速さはWPM設定に連動。目安100〜300）',
      3500,
    );
  }

  listenError(code) {
    if (code === 'no-voice') toast(NO_VOICE_HELP, 6000);
    else if (code === 'unsupported') toast('この端末は音声読み上げに対応していません');
    else toast(`音声を再生できませんでした（${code}）`);
  }

  onRead(s, e, ms) {
    const words = countWords(this.doc.words, s, e);
    if (this.isListeningOnly()) {
      this.pending.lw += words;
      this.pending.lms += ms;
    } else {
      this.pending.words += words;
      this.pending.ms += ms;
    }
    this.sinceCheck += words;
    if (!this.host.settings.comprehensionCheck) return;
    const crossed = e >= this.nextChapterAt;
    if (crossed) this.updateNextChapter(e);
    if (e < this.doc.words.length && coach.shouldCheck(this.sinceCheck, crossed)) {
      this.pause();
      this.askComprehension();
    }
  }

  /** Index where the next chapter starts (to notice when reading crosses into it). */
  updateNextChapter(from = this.player.pos) {
    const next = this.doc.chapters.find((c) => c.index > from);
    this.nextChapterAt = next ? next.index : Infinity;
  }

  askComprehension() {
    const words = this.sinceCheck;
    this.sinceCheck = 0;
    if (this.isListeningOnly()) return this.askListening(words);
    const panel = openSheet(`
      <div class="check">
        <h2 class="sheet-title">ここまでの内容、分かりましたか？</h2>
        <p class="muted small">直近の${words}語について。答えに合わせて速さや本のレベルを提案します</p>
        <div class="ratings">${coach.RATINGS.map((x) => `<button class="rating" data-r="${x.r}"><span>${x.emoji}</span>${x.label}</button>`).join('')}</div>
        <div class="sheet-actions"><button class="btn ghost" data-a="skip">スキップして続きを読む</button></div>
      </div>`);
    panel.querySelector('[data-a=skip]').onclick = () => closeSheet(() => this.toggle());
    panel.querySelectorAll('[data-r]').forEach((b) =>
      b.addEventListener('click', () => {
        const sug = this.host.recordCheck(this.book, Number(b.dataset.r), words);
        this.showSuggestion(sug);
      }),
    );
  }

  /** 多聴 check: how much was understood without the text, in percent (target 80%). */
  askListening(words) {
    const panel = openSheet(`
      <div class="check">
        <h2 class="sheet-title">聞いてどのくらい分かりましたか？</h2>
        <p class="muted small">直近の${words}語について（多聴の目標は${coach.LISTEN_GOAL}%）。このあと本文で確かめられます</p>
        <div class="comp-grid">${coach.COMP_LEVELS.map((p) => `<button class="rating" data-p="${p}"><span>${p}%</span></button>`).join('')}</div>
        <div class="sheet-actions"><button class="btn ghost" data-a="skip">スキップして続きを聞く</button></div>
      </div>`);
    panel.querySelector('[data-a=skip]').onclick = () => closeSheet(() => this.toggle());
    panel.querySelectorAll('[data-p]').forEach((b) =>
      b.addEventListener('click', () => {
        const comp = Number(b.dataset.p);
        const sug = this.host.recordCheck(this.book, coach.ratingFromPercent(comp), words, { mode: 'listen', comp });
        const head = comp >= coach.LISTEN_GOAL ? '目標の80%に届いています。' : '本文（ぼかし）を開いて、聞き取れなかった所を確かめましょう。';
        this.showSuggestion({ ...sug, msg: `${head}${sug.msg ? `<br>${sug.msg}` : ''}` });
      }),
    );
  }

  showSuggestion(sug) {
    let action = '';
    if (sug.kind === 'faster' || sug.kind === 'slower') action = `<button class="btn primary" data-a="wpm">速さを${sug.wpm} WPMにする</button>`;
    if (sug.kind === 'levelUp' || sug.kind === 'levelDown') action = `<button class="btn primary" data-a="level">Lv${sug.level}の本を見る</button>`;
    const panel = openSheet(`
      <div class="check">
        <h2 class="sheet-title">${sug.kind === 'keep' ? '記録しました' : '提案'}</h2>
        <p class="suggest">${sug.msg}</p>
        <div class="sheet-actions">${action}<button class="btn ${action ? 'ghost' : 'primary'}" data-a="go">${action ? 'このまま続ける' : this.isListeningOnly() ? '続きを聞く' : '続きを読む'}</button></div>
      </div>`);
    panel.querySelector('[data-a=go]').onclick = () => closeSheet(() => this.toggle());
    panel.querySelector('[data-a=wpm]')?.addEventListener('click', () => {
      this.setWpm(sug.wpm);
      closeSheet(() => this.toggle());
    });
    panel.querySelector('[data-a=level]')?.addEventListener('click', () => closeSheet(() => this.host.showLevel(sug.level)));
  }

  setWpm(v) {
    const wpm = Math.max(WPM_MIN, Math.min(WPM_MAX, Math.round(v / 25) * 25));
    this.host.saveSettings({ wpm });
    this.applySettings();
    this.updateMeta();
  }

  toggle() {
    const p = this.player;
    if (p.playing) return this.pause();
    // After a pause, restart from the beginning of the sentence so the meaning isn't lost.
    if (this.host.settings.rewind && !this.justSeeked) p.pos = sentenceStart(this.doc, p.pos);
    this.justSeeked = false;
    this.revealed = false;
    this.updateNextChapter(p.pos);
    if (this.host.settings.listen) this.listen.play();
    else p.play();
  }

  jump(i) {
    this.justSeeked = true;
    if (this.listen.playing) this.listen.stop();
    this.player.seek(i);
    if (!this.player.playing) this.renderContext();
  }

  onState(playing) {
    this.el.classList.toggle('playing', playing);
    $('#r-play').innerHTML = playing ? icons.pause : icons.play;
    $('#r-play').setAttribute('aria-label', playing ? '一時停止' : '再生');
    this.contextEl.hidden = playing;
    if (playing) {
      this.requestWakeLock();
    } else {
      this.releaseWakeLock();
      this.save();
      this.renderContext();
    }
  }

  renderFrame(start, end) {
    const { words, flags } = this.doc;
    const el = this.wordEl;
    const [l, p, r] = el.children;
    const heading = flags[start] & F_HEADING;
    const phrase = this.host.settings.chunk === 'phrase' && !heading;
    const single = end - start === 1 && !heading && !phrase && this.host.settings.orp;
    el.className = `word${heading ? ' heading' : ''}${single ? '' : ' plain'}${phrase ? ' phrase' : ''}`;
    el.style.fontSize = '';
    if (single) {
      const w = words[start];
      const pi = pivotIndex(w);
      l.textContent = w.slice(0, pi);
      p.textContent = w[pi];
      r.textContent = w.slice(pi + 1);
      const over = Math.max(l.scrollWidth / (l.clientWidth || 1), r.scrollWidth / (r.clientWidth || 1));
      if (over > 1) el.style.fontSize = `${Math.floor(parseFloat(getComputedStyle(el).fontSize) / over)}px`;
    } else {
      l.textContent = '';
      r.textContent = '';
      p.textContent = words.slice(start, end).join(' ');
      if (phrase) {
        // Phrases may wrap onto two lines; shrink only if they need more.
        const lh = parseFloat(getComputedStyle(p).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.25;
        const over = p.offsetHeight / (lh * 2.2);
        if (over > 1) el.style.fontSize = `${Math.floor(parseFloat(getComputedStyle(el).fontSize) / Math.sqrt(over + 0.15))}px`;
      } else {
        const over = p.scrollWidth / (el.clientWidth || 1);
        if (over > 1) el.style.fontSize = `${Math.floor(parseFloat(getComputedStyle(el).fontSize) / over)}px`;
      }
    }
    this.frame = [start, end];
    this.updateMeta();
  }

  updateMeta() {
    if (!this.player) return;
    const i = this.frame ? this.frame[0] : this.player.pos;
    const n = this.doc.words.length;
    this.progressEl.value = i;
    this.progressEl.style.setProperty('--p', `${(i / Math.max(1, n - 1)) * 100}%`);
    $('#r-pct').textContent = `${Math.floor((i / Math.max(1, n - 1)) * 100)}%`;
    $('#r-left').textContent = `残り ${fmtDuration(this.player.remainingMs(i))}`;
    const c = chapterAt(this.doc, i);
    // With fewer than two detected chapters the "chapter" is usually title-page noise.
    $('#r-chapter').textContent = c >= 0 && this.doc.chapters.length > 1 ? this.doc.chapters[c].title : this.book.author || '';
  }

  renderContext() {
    if (!this.frame) return;
    const [fs, fe] = this.frame;
    const p = paraOf(this.doc, fs);
    const showJa = this.host.settings.showJa;
    const slashes = this.host.settings.chunk === 'phrase' ? this.player.phrases() : null;
    const html = [];
    for (let k = Math.max(0, p - 2); k <= Math.min(this.doc.paraStart.length - 1, p + 2); k++) {
      const [a, b] = paraRange(this.doc, k);
      const heading = this.doc.flags[a] & F_HEADING;
      let s = `<p class="${heading ? 'ctx-h' : ''}${k === p ? ' cur' : ''}">`;
      for (let i = a; i < b; i++) {
        const cls = i >= fs && i < fe ? ' class="now"' : '';
        if (slashes && slashes[i] && i > a && !heading) s += '<span class="slash">/</span> ';
        s += `<span data-i="${i}"${cls}>${esc(this.doc.words[i])}</span> `;
      }
      html.push(`${s}</p>`);
      if (showJa && !heading) {
        html.push(`<div class="ja" data-p="${k}"><button class="ja-btn" data-tr="${k}">和訳する</button></div>`);
      }
    }
    const veiled = this.isListeningOnly() && !this.revealed;
    this.contextEl.classList.toggle('veiled', veiled);
    this.el.classList.toggle('veiled', veiled);
    this.contextEl.innerHTML = `${veiled ? '<button class="btn primary veil-btn" data-reveal>本文を表示して確かめる</button>' : ''}<div class="ctx-bar"><span class="ctx-hint">単語タップで辞書</span>
      <span class="ctx-tools"><button class="chip small" data-train>📝 1文章トレーニング</button>
      <button class="chip small${showJa ? ' on' : ''}" data-ja-toggle aria-pressed="${showJa}">和訳</button></span></div>${html.join('')}`;
    const now = this.contextEl.querySelector('.now');
    if (now) {
      const box = this.contextEl;
      box.scrollTop = now.offsetTop - box.clientHeight / 2 + now.offsetHeight / 2;
    }
    // Translate the current paragraph right away; the others on request (saves the daily quota).
    if (showJa && !(this.doc.flags[paraRange(this.doc, p)[0]] & F_HEADING)) this.translatePara(p);
  }

  async translatePara(k) {
    const box = this.contextEl.querySelector(`.ja[data-p="${k}"]`);
    if (!box) return;
    box.innerHTML = '<span class="muted">翻訳中…</span>';
    const [a, b] = paraRange(this.doc, k);
    const doc = this.doc;
    try {
      const ja = await translate(doc.words.slice(a, b).join(' '), { email: this.host.settings.mmEmail });
      if (doc === this.doc && box.isConnected) box.textContent = ja;
    } catch (e) {
      if (!box.isConnected) return;
      box.innerHTML = `<span class="muted">${e instanceof QuotaError
        ? '今日の無料翻訳の上限に達しました。設定でメールアドレスを登録すると上限が10倍になります。'
        : '翻訳できませんでした（オフライン？）'}</span> <button class="ja-btn" data-tr="${k}">再試行</button>`;
    }
  }

  showWord(i) {
    openDictSheet({
      doc: this.doc, i, book: this.book, settings: this.host.settings, saveSettings: this.host.saveSettings,
      actions: [
        { label: 'この単語から読む', onClick: () => { this.jump(i); closeSheet(); } },
        { label: 'ここから再生', icon: 'play', primary: true, onClick: () => { this.jump(i); closeSheet(() => this.toggle()); } },
      ],
    });
  }

  /** Passage training on the current short chapter / the next few paragraphs. */
  openTraining() {
    this.pause();
    const [start, end] = pickPassage(this.doc, this.player.pos);
    startTraining({ doc: this.doc, start, end, book: this.book, host: this.host });
  }

  showChapters() {
    this.pause();
    const cur = chapterAt(this.doc, this.player.pos);
    const items = this.doc.chapters
      .map((c, k) => `<button class="toc-item${k === cur ? ' on' : ''}" data-k="${k}"><span>${esc(c.title)}</span>
        <small>${Math.floor((c.index / this.doc.words.length) * 100)}%</small></button>`)
      .join('');
    const panel = openSheet(`<h2 class="sheet-title">目次</h2><div class="toc">${items}</div>`);
    panel.querySelectorAll('[data-k]').forEach((b) =>
      b.addEventListener('click', () => {
        this.jump(this.doc.chapters[Number(b.dataset.k)].index);
        closeSheet();
      }),
    );
    panel.querySelector('.toc-item.on')?.scrollIntoView({ block: 'center' });
  }

  save() {
    if (!this.player) return;
    this.book.pos = this.player.pos;
    this.book.lastReadAt = Date.now();
    this.host.saveProgress(this.book);
    if (this.pending.words || this.pending.ms) this.host.addReading(this.book, this.pending.words, this.pending.ms);
    if (this.pending.lw || this.pending.lms) this.host.addListening(this.book, this.pending.lw, this.pending.lms);
    this.pending = { words: 0, ms: 0, lw: 0, lms: 0 };
  }

  onEnd() {
    this.save();
    this.host.finished(this.book);
  }

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator && !this.wakeLock) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => (this.wakeLock = null));
      }
    } catch {
      /* not supported or denied: the screen may dim, reading still works */
    }
  }

  releaseWakeLock() {
    if (this.wakeLock) this.wakeLock.release().catch(() => {});
    this.wakeLock = null;
  }
}
