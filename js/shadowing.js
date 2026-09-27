// ②-1 音声知覚: shadowing (listen -> check script -> overlapping x5 -> shadowing, scored) and
// repeating (one sentence at a time: listen, say it back, compare).
import { prepare, F_SENTENCE, F_PARA, F_HEADING, countWords, pickPassage } from './text.js';
import { utterance, NO_VOICE_HELP } from './speech.js';
import { listen, sttSupported, sttErrorText, STT_NOTE } from './stt.js';
import { startRecording, recordingSupported } from './recorder.js';
import { compare, diffHtml } from './textdiff.js';
import { translate } from './translate.js';
import { openDictSheet } from './dictSheet.js';
import * as db from './db.js';
import { $, esc, icons, openSheet, closeSheet, pushLayer, popLayer, toast } from './ui.js';

const SEGMENT_MIN = 100; // words per shadowing passage (about a minute of speech)
const SEGMENT_MAX = 160;
const INTRO_SEC = 5; // VOA recordings start with a short announcement before the story
const OUTRO_SEC = 15;
const OVERLAP_GOAL = 5;
const LISTEN_GOAL = 3;

const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// ---------- material
/** Sentences of a prepared doc as [start, end) token ranges, grouped by part ("# Part N" headings). */
function partsOf(doc) {
  const parts = [[]];
  let a = -1;
  for (let k = 0; k < doc.words.length; k++) {
    if (doc.flags[k] & F_HEADING) {
      if (/^part$/i.test(doc.words[k]) && parts[parts.length - 1].length) parts.push([]);
      a = -1;
      continue;
    }
    if (a < 0) a = k;
    if (doc.flags[k] & (F_SENTENCE | F_PARA)) {
      parts[parts.length - 1].push([a, k + 1]);
      a = -1;
    }
  }
  return parts.filter((p) => p.length);
}

/** Split into ~1-minute passages at sentence boundaries, with each passage's position inside its part. */
export function segmentsOf(doc) {
  const out = [];
  partsOf(doc).forEach((sents, part) => {
    const partWords = countWords(doc.words, sents[0][0], sents[sents.length - 1][1]);
    let cur = null;
    let before = 0;
    for (const [a, b] of sents) {
      const n = countWords(doc.words, a, b);
      if (!cur) cur = { part, start: a, end: b, sentences: [], w0: before, words: 0 };
      cur.sentences.push([a, b]);
      cur.end = b;
      cur.words += n;
      before += n;
      if (cur.words >= SEGMENT_MIN || (cur.words + n > SEGMENT_MAX && cur.words > 40)) {
        out.push({ ...cur, w1: before, partWords });
        cur = null;
      }
    }
    if (cur) {
      // A short tail (a sentence or two) joins the previous passage of the same part.
      const prev = out[out.length - 1];
      if (cur.words < 40 && prev && prev.part === part) Object.assign(prev, { end: cur.end, sentences: [...prev.sentences, ...cur.sentences], words: prev.words + cur.words, w1: before });
      else out.push({ ...cur, w1: before, partWords });
    }
  });
  return out.map((s, i) => ({ ...s, n: i + 1, text: doc.words.slice(s.start, s.end).filter((_, k) => !(doc.flags[s.start + k] & F_HEADING)).join(' ') }));
}

// ---------- players: native recording (a time window of the VOA mp3) or text-to-speech
function nativePlayer(url) {
  const audio = new Audio();
  audio.preload = 'metadata';
  audio.src = url;
  let span = [0, 0];
  let onEnd = null;
  const tick = () => {
    if (!audio.paused && audio.currentTime >= span[1]) {
      audio.pause();
      const cb = onEnd;
      onEnd = null;
      cb?.();
    }
  };
  audio.addEventListener('timeupdate', tick);
  return {
    kind: 'native',
    audio,
    ready: () =>
      audio.readyState >= 1
        ? Promise.resolve(audio.duration)
        : new Promise((resolve, reject) => {
            audio.addEventListener('loadedmetadata', () => resolve(audio.duration), { once: true });
            audio.addEventListener('error', () => reject(new Error('audio')), { once: true });
          }),
    setWindow(a, b) {
      span = [Math.max(0, a), b];
    },
    get window() {
      return span;
    },
    async play(done) {
      onEnd = done;
      audio.currentTime = span[0];
      await audio.play();
    },
    stop() {
      onEnd = null;
      audio.pause();
    },
    setRate(r) {
      audio.playbackRate = r;
    },
    get playing() {
      return !audio.paused;
    },
    destroy() {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    },
  };
}

function ttsPlayer(sentences, settings, onSentence) {
  let stopped = true;
  let rate = 1;
  return {
    kind: 'tts',
    ready: () => Promise.resolve(0),
    async play(done) {
      speechSynthesis.cancel();
      stopped = false;
      for (let i = 0; i < sentences.length && !stopped; i++) {
        const u = await utterance(sentences[i], settings.voice);
        if (typeof u === 'string') {
          toast(u === 'no-voice' ? NO_VOICE_HELP : 'この端末は音声読み上げに対応していません', 5000);
          stopped = true;
          break;
        }
        if (stopped) break;
        u.rate = rate * 0.95;
        onSentence?.(i);
        await new Promise((resolve) => {
          u.onend = resolve;
          u.onerror = resolve;
          speechSynthesis.speak(u);
        });
      }
      onSentence?.(-1);
      const finished = !stopped;
      stopped = true;
      if (finished) done?.();
    },
    stop() {
      stopped = true;
      speechSynthesis.cancel();
      onSentence?.(-1);
    },
    setRate(r) {
      rate = r;
    },
    get playing() {
      return !stopped;
    },
    destroy() {
      this.stop();
    },
  };
}

// ---------- overlay helpers
function overlay(close) {
  let el = $('#practice');
  if (!el) {
    el = document.createElement('section');
    el.id = 'practice';
    el.className = 'training';
    document.body.append(el);
  }
  el.hidden = false;
  document.body.classList.add('training-open');
  pushLayer(() => {
    el.hidden = true;
    document.body.classList.remove('training-open');
    close?.();
  });
  return el;
}

// ---------- choosing material
/**
 * @param host {settings, saveSettings, library, loadText(book), currentBook(), recordPractice(rec)}
 * @param mode 'shadowing' | 'repeating'
 */
export function chooseMaterial(host, mode) {
  const voa = host.library.filter((b) => b.source === 'voa' && b.audio?.every(Boolean));
  const current = host.currentBook();
  const panel = openSheet(`
    <h2 class="sheet-title">${mode === 'shadowing' ? 'シャドーイング' : 'リピーティング'}の教材</h2>
    ${current ? `<button class="card pick" data-cur><b>📖 読みかけの本から（音声読み上げ）</b><small class="muted">${esc(current.title)} の今の位置</small></button>` : ''}
    <h3 class="sub">${mode === 'shadowing' ? 'ネイティブ音声' : ''}VOA American Stories <small class="muted">（学習者向けの名作・約1分ずつ）</small></h3>
    <div class="menu">${voa
      .map((b) => `<button data-voa="${esc(b.id)}">${esc(b.ja)}<br><small class="muted">${esc(b.title)} · ${b.words.toLocaleString()}語</small></button>`)
      .join('')}</div>
    <p class="muted small">音声: VOA Learning English（米国政府の著作物）。再生にはインターネット接続が必要です。${mode === 'repeating' ? 'リピーティングは1文ずつ区切るため、読み上げ音声を使います。' : ''}</p>`);
  panel.querySelector('[data-cur]')?.addEventListener('click', async () => {
    const text = await host.loadText(current);
    const doc = prepare(text);
    const [a, b] = pickPassage(doc, current.pos || 0);
    const seg = segmentsOf({ ...doc, words: doc.words.slice(a, b), flags: doc.flags.slice(a, b) })[0];
    closeSheet(() => startSession(host, mode, { title: current.title, doc: { words: doc.words.slice(a, b), flags: doc.flags.slice(a, b) }, seg, audio: null, bookId: current.id }));
  });
  panel.querySelectorAll('[data-voa]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const book = voa.find((b) => b.id === btn.dataset.voa);
      const doc = prepare(await host.loadText(book));
      const segs = segmentsOf(doc);
      const done = await practiceLog(host, mode, book.id);
      const p = openSheet(`<h2 class="sheet-title">${esc(book.ja)}</h2><p class="muted small">区間を選んでください（1区間 約1分）</p>
        <div class="menu">${segs
          .map((s) => `<button data-seg="${s.n}">${done.has(s.n) ? '✓ ' : ''}区間${s.n}${segs.some((x) => x.part) ? `（Part ${s.part + 1}）` : ''} · ${s.words}語<br><small class="muted">${esc(s.text.slice(0, 60))}…</small></button>`)
          .join('')}</div>`);
      p.querySelectorAll('[data-seg]').forEach((x) =>
        x.addEventListener('click', () => {
          const seg = segs[Number(x.dataset.seg) - 1];
          closeSheet(() => startSession(host, mode, { title: book.ja, doc, seg, audio: mode === 'shadowing' ? book.audio[seg.part] : null, bookId: book.id }));
        }),
      );
    }),
  );
}

async function practiceLog(host, mode, bookId) {
  return new Set((host.stats.practice || []).filter((p) => p.type === mode && p.bookId === bookId).map((p) => p.seg));
}

function startSession(host, mode, material) {
  if (mode === 'shadowing') shadowing(host, material);
  else repeating(host, material);
}

// ---------- shadowing
const SH_STEPS = ['聞く', 'スクリプト確認', 'オーバーラッピング', 'シャドーイング', '結果'];

async function shadowing(host, { title, doc, seg, audio, bookId }) {
  const sentences = seg.sentences.map(([a, b]) => doc.words.slice(a, b).join(' '));
  let highlight = -1;
  const player = audio
    ? nativePlayer(audio)
    : ttsPlayer(sentences, host.settings, (i) => {
        highlight = i;
        el.querySelectorAll('.tr-text [data-s]').forEach((x) => x.classList.toggle('speaking', Number(x.dataset.s) === i));
      });
  const el = overlay(() => {
    player.destroy();
    speechSynthesis.cancel();
    stt?.stop();
  });
  const st = { step: 0, listens: 0, overlaps: 0, rate: 1, score: null, result: null, recording: null, mode: sttSupported ? 'score' : 'record' };
  let stt = null;

  // Where this passage is in the recording: estimated from its position in the text, plus the learner's correction.
  const shiftKey = `shadowShift:${bookId}:${seg.part}`;
  let shift = (await db.get(shiftKey)) || 0;
  let duration = 0;
  const applyWindow = () => {
    if (player.kind !== 'native' || !duration) return;
    const span = Math.max(1, duration - INTRO_SEC - OUTRO_SEC);
    const a = INTRO_SEC + (seg.w0 / seg.partWords) * span + shift;
    const b = INTRO_SEC + (seg.w1 / seg.partWords) * span + shift + 1.5;
    player.setWindow(a, b);
  };
  if (player.kind === 'native') {
    try {
      duration = await player.ready();
      applyWindow();
    } catch {
      toast('音声を読み込めませんでした（オフライン？）。読み上げ音声で練習します', 4000);
      return shadowing(host, { title, doc, seg, audio: null, bookId });
    }
  }

  const scriptHtml = () =>
    `<p>${seg.sentences
      .map(([a, b], i) => `<span data-s="${i}" class="${i === highlight ? 'speaking' : ''}">${doc.words
        .slice(a, b)
        .map((w, k) => `<span data-i="${a + k}">${esc(w)}</span>`)
        .join(' ')}</span>`)
      .join(' ')}</p><div class="ja" hidden></div>`;

  const stepper = () =>
    `<ol class="tr-steps">${SH_STEPS.map((s, k) => `<li class="${k < st.step ? 'done' : k === st.step ? 'on' : ''}"><i>${k + 1}</i><span>${s}</span></li>`).join('')}</ol>`;

  const controls = () => `<div class="sh-controls">
      <button class="btn ${player.playing ? 'ghost' : 'primary'}" data-a="play">${player.playing ? `${icons.pause}止める` : `${icons.play}再生`}</button>
      <div class="seg small">${[0.75, 0.9, 1].map((r) => `<button data-rate="${r}" class="${st.rate === r ? 'on' : ''}">×${r}</button>`).join('')}</div>
    </div>
    ${player.kind === 'native' ? `<div class="sh-window"><small class="muted">区間 ${fmtTime(player.window[0])}〜${fmtTime(player.window[1])}（推定）</small>
      <span><button class="link-btn" data-shift="-1">−1秒</button> <button class="link-btn" data-shift="1">+1秒</button></span></div>` : ''}`;

  function frame(body, actions = '') {
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button>
        <span class="tr-title">${esc(title)} · 区間${seg.n}</span><span class="rv-spacer"></span></header>
      ${stepper()}<div class="tr-body">${body}</div><div class="tr-actions">${actions}</div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelector('[data-a=play]')?.addEventListener('click', togglePlay);
    el.querySelectorAll('[data-rate]').forEach((b) =>
      b.addEventListener('click', () => {
        st.rate = Number(b.dataset.rate);
        player.setRate(st.rate);
        render();
      }),
    );
    el.querySelectorAll('[data-shift]').forEach((b) =>
      b.addEventListener('click', async () => {
        shift += Number(b.dataset.shift);
        await db.set(shiftKey, shift);
        applyWindow();
        player.stop();
        render();
        togglePlay();
      }),
    );
    el.querySelector('.tr-text')?.addEventListener('click', (e) => {
      const w = e.target.closest('[data-i]');
      if (w && st.step === 1) {
        openDictSheet({
          doc, i: Number(w.dataset.i), book: { id: bookId, title }, settings: host.settings, saveSettings: host.saveSettings,
          actions: [{ label: '閉じる', primary: true, onClick: () => closeSheet() }],
        });
      }
    });
  }

  function togglePlay() {
    if (player.playing) {
      player.stop();
      return render();
    }
    player.setRate(st.rate);
    player
      .play(() => {
        if (st.step === 0) st.listens++;
        if (st.step === 2) st.overlaps++;
        render();
      })
      .catch(() => toast('音声を再生できませんでした'));
    setTimeout(render, 50);
  }

  function render() {
    const next = (label, primary = true) => `<button class="btn ${primary ? 'primary' : 'ghost'} wide" data-a="next">${label}</button>`;
    if (st.step === 0) {
      frame(
        `<p class="tr-hint">まずはスクリプトを見ずに聞きます（最大${LISTEN_GOAL}回）。どのくらい聞き取れるか確かめましょう。</p>
         <div class="tr-counter"><b>${st.listens}</b> / ${LISTEN_GOAL}回 聞いた</div>${controls()}`,
        next('次へ：スクリプトを確認', st.listens > 0),
      );
    } else if (st.step === 1) {
      frame(
        `<p class="tr-hint">スクリプトで発音と意味を確かめます。単語をタップすると辞書が開きます。</p>${controls()}
         <div class="tr-text">${scriptHtml()}</div><button class="link-btn" data-a="ja">和訳を見る</button>`,
        next('次へ：オーバーラッピング'),
      );
      el.querySelector('[data-a=ja]').onclick = async () => {
        const box = el.querySelector('.tr-text .ja');
        box.hidden = false;
        box.textContent = '翻訳中…';
        try {
          box.textContent = await translate(seg.text, { email: host.settings.mmEmail });
        } catch {
          box.textContent = '翻訳できませんでした（オフライン？）';
        }
      };
    } else if (st.step === 2) {
      frame(
        `<p class="tr-hint">スクリプトを見ながら、音声と<b>同時に</b>声に出して読みます。最初は小声でなぞる（マンブリング）だけでも大丈夫です。</p>
         <div class="tr-counter"><b>${st.overlaps}</b> / ${OVERLAP_GOAL}回</div>${controls()}
         <div class="tr-text">${scriptHtml()}</div>`,
        next(`次へ：シャドーイング${st.overlaps < OVERLAP_GOAL ? '（スキップ）' : ''}`, st.overlaps >= OVERLAP_GOAL),
      );
    } else if (st.step === 3) {
      const canScore = sttSupported;
      frame(
        `<p class="tr-hint">スクリプトを見ずに、音声を少し遅れて追いかけるように話します。</p>
         <div class="seg" data-mode>${canScore ? `<button data-m="score" class="${st.mode === 'score' ? 'on' : ''}">採点（音声認識）</button>` : ''}
           ${recordingSupported ? `<button data-m="record" class="${st.mode === 'record' ? 'on' : ''}">録音して聞き返す</button>` : ''}</div>
         <p class="muted small">${st.mode === 'score' ? STT_NOTE : '録音は端末内だけに保存され、外部には送られません。'}</p>
         <div class="sh-live"></div>`,
        `<button class="btn primary wide" data-a="go">${icons.play}シャドーイング開始</button>`,
      );
      el.querySelectorAll('[data-m]').forEach((b) =>
        b.addEventListener('click', () => {
          st.mode = b.dataset.m;
          render();
        }),
      );
      el.querySelector('[data-a=go]').onclick = runShadowing;
    } else {
      const r = st.result;
      frame(
        `${r ? `<div class="tr-stat"><small>一致率</small><b>${Math.round(r.score * 100)}%</b><small>${r.matched} / ${r.total}語</small></div>
          <p class="tr-hint">赤い単語が言えなかった（聞き取れなかった）ところです。音の変化（つながる・消える音）に注目して、もう一度オーバーラッピングしましょう。</p>
          <div class="tr-text">${diffHtml(r)}</div>` : ''}
         ${st.recording ? `<p class="small">自分の声とお手本を聞き比べましょう。</p><audio controls src="${st.recording}" class="rec-audio"></audio>${controls()}` : ''}
         <dl class="facts"><div><dt>聞いた</dt><dd>${st.listens}回</dd></div><div><dt>オーバーラッピング</dt><dd>${st.overlaps}回</dd></div></dl>`,
        `<button class="btn ghost wide" data-a="again">もう一度シャドーイング</button><button class="btn primary wide" data-a="done">記録して終わる</button>`,
      );
      el.querySelector('[data-a=again]').onclick = () => {
        st.step = 3;
        render();
      };
      el.querySelector('[data-a=done]').onclick = () => {
        host.recordPractice({ type: 'shadowing', bookId, title, seg: seg.n, words: seg.words, score: st.result ? Math.round(st.result.score * 100) : null, listens: st.listens, overlaps: st.overlaps });
        toast('シャドーイングを記録しました');
        popLayer();
      };
    }
    el.querySelector('[data-a=next]')?.addEventListener('click', () => {
      player.stop();
      st.step++;
      render();
    });
  }

  async function runShadowing() {
    const live = el.querySelector('.sh-live');
    const btn = el.querySelector('[data-a=go]');
    btn.disabled = true;
    player.setRate(st.rate);
    if (st.mode === 'score') {
      let heard = '';
      stt = listen({
        continuous: true,
        onText: (fin, interim) => (live.textContent = `${fin} ${interim}`.trim() || '…'),
        onEnd: (text) => {
          heard = text;
          st.result = compare(seg.text, heard);
          st.step = 4;
          render();
        },
        onError: (code) => {
          toast(sttErrorText(code), 5000);
          player.stop();
          btn.disabled = false;
        },
      });
      live.textContent = '聞き取り中…';
      await player.play(() => setTimeout(() => stt?.stop(), 1500)); // let the last words finish
    } else {
      try {
        const rec = await startRecording();
        live.textContent = '録音中…';
        await player.play(async () => {
          st.recording = await rec.stop();
          st.result = null;
          st.step = 4;
          render();
        });
      } catch {
        toast('マイクを使えませんでした。ブラウザの設定でマイクを許可してください', 5000);
        btn.disabled = false;
      }
    }
  }

  render();
}

// ---------- repeating: listen to one sentence, say it back without the text, compare
async function repeating(host, { title, doc, seg, bookId }) {
  const sentences = seg.sentences.map(([a, b]) => doc.words.slice(a, b).join(' ')).filter((s) => s.split(' ').length >= 3);
  const el = overlay(() => {
    speechSynthesis.cancel();
    stt?.stop();
  });
  let k = 0;
  let stt = null;
  const scores = [];
  let state = 'ready'; // ready -> speaking -> checked

  async function say(text) {
    const u = await utterance(text, host.settings.voice);
    if (typeof u === 'string') {
      toast(u === 'no-voice' ? NO_VOICE_HELP : 'この端末は音声読み上げに対応していません', 5000);
      return;
    }
    u.rate = 0.9;
    speechSynthesis.cancel();
    await new Promise((resolve) => {
      u.onend = resolve;
      u.onerror = resolve;
      speechSynthesis.speak(u);
    });
  }

  function render(result) {
    if (k >= sentences.length) return finish();
    const s = sentences[k];
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button>
        <span class="tr-title">リピーティング · ${k + 1} / ${sentences.length}</span><span class="rv-spacer"></span></header>
      <div class="tr-body">
        <p class="tr-hint">1文を聞いたら、文字を見ずにそのまま繰り返します。意味を思い浮かべながら言いましょう。</p>
        <div class="rp-card">${state === 'checked' ? `<div class="tr-text">${result ? diffHtml(result) : esc(s)}</div>
          ${result ? `<div class="tr-stat"><b>${Math.round(result.score * 100)}%</b><small>一致率</small></div>` : ''}` : '<div class="rp-hidden">🎧 聞いて、繰り返す</div>'}
          <div class="sh-live muted"></div></div>
        ${sttSupported ? `<p class="muted small">${STT_NOTE}</p>` : ''}
      </div>
      <div class="tr-actions">${state === 'checked'
        ? `<button class="btn ghost wide" data-a="retry">もう一度</button><button class="btn primary wide" data-a="next">次の文へ</button>`
        : `<button class="btn primary wide" data-a="go" ${state === 'speaking' ? 'disabled' : ''}>${icons.play}聞いて繰り返す</button>
           ${sttSupported ? '' : '<button class="btn ghost wide" data-a="show">答えを見る</button>'}`}</div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelector('[data-a=go]')?.addEventListener('click', go);
    el.querySelector('[data-a=show]')?.addEventListener('click', () => {
      state = 'checked';
      render(null);
    });
    el.querySelector('[data-a=retry]')?.addEventListener('click', () => {
      state = 'ready';
      render();
      go();
    });
    el.querySelector('[data-a=next]')?.addEventListener('click', () => {
      if (result) scores.push(result.score);
      k++;
      state = 'ready';
      render();
    });
  }

  async function go() {
    state = 'speaking';
    render();
    await say(sentences[k]);
    if (!sttSupported) {
      state = 'ready';
      return render();
    }
    const live = el.querySelector('.sh-live');
    live.textContent = 'どうぞ（話し終えると自動で判定します）';
    stt = listen({
      continuous: false,
      onText: (fin, interim) => (live.textContent = `${fin} ${interim}`.trim()),
      onEnd: (text) => {
        state = 'checked';
        render(compare(sentences[k], text));
      },
      onError: (code) => {
        toast(sttErrorText(code), 5000);
        state = 'ready';
        render();
      },
    });
  }

  function finish() {
    const avg = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) : null;
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button><span></span><span class="rv-spacer"></span></header>
      <div class="rv-done"><div class="big-emoji">🔁</div><h2>リピーティング完了</h2>
        ${avg != null ? `<div class="tr-stat"><small>平均一致率</small><b>${avg}%</b><small>${scores.length}文</small></div>` : `<p>${sentences.length}文を練習しました。</p>`}
        <button class="btn primary wide" data-a="done">記録して終わる</button></div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelector('[data-a=done]').onclick = () => {
      host.recordPractice({ type: 'repeating', bookId, title, seg: seg.n, sentences: sentences.length, score: avg });
      popLayer();
    };
  }

  render();
}
