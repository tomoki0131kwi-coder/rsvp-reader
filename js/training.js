// 1文章トレーニング (passage training), after the speed-reading drill used in coaching programs:
// timed silent read -> comprehension -> check chunks / words / translation -> listen x5 ->
// read aloud xN -> timed silent read again, then compare the two reading speeds.
import { F_HEADING, F_SENTENCE, F_PARA, sliceDoc, paraRange } from './text.js';
import { chunkStarts } from './chunk.js';
import { utterance, NO_VOICE_HELP } from './speech.js';
import { translate, QuotaError } from './translate.js';
import { openDictSheet } from './dictSheet.js';
import * as goals from './goals.js';
import { $, esc, icons, closeSheet, confirmSheet, pushLayer, popLayer, toast } from './ui.js';

const STEPS = ['黙読', '理解度', 'チャンク確認', 'リスニング', '音読', '再黙読'];
const COMPREHENSION = [
  { p: 100, label: 'ほぼ全部' },
  { p: 80, label: '8割' },
  { p: 60, label: '6割' },
  { p: 40, label: '4割' },
  { p: 20, label: '2割以下' },
];
const LISTEN_GOAL = 5;
const IMPLAUSIBLE_WPM = 700; // faster than this is almost certainly a mis-tap

const fmtTime = (ms) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
const wpmOf = (words, ms) => Math.round(words / (ms / 60000));

/**
 * @param o {doc, start, end, book, host}; host: {settings, saveSettings, recordTraining(record), addReading(book, words, ms)}
 */
export function startTraining({ doc, start, end, book, host }) {
  const d = sliceDoc(doc, start, end);
  const words = d.wordCount;
  const firstHeading = d.flags[0] & F_HEADING ? d.words.slice(0, paraRange(d, 0)[1]).join(' ') : '';
  const title = firstHeading || book.title;
  const goal = () => ({ wpm: host.settings.goalWpm, comp: host.settings.goalComp });
  const st = { step: -1, t1: 0, t2: 0, comp: null, listens: 0, reads: 0, readGoal: host.settings.readAloudGoal || 5, rate: 1 };

  // Sentence ranges, for highlighting the one being spoken.
  const sentences = [];
  for (let a = 0, k = 0; k < d.words.length; k++) {
    if (d.flags[k] & (F_SENTENCE | F_PARA)) {
      sentences.push([a, k + 1]);
      a = k + 1;
    }
  }
  const sentenceOf = (i) => sentences.findIndex(([a, b]) => i >= a && i < b);
  const slashes = chunkStarts(d);

  let el = $('#training');
  if (!el) {
    el = document.createElement('section');
    el.id = 'training';
    el.className = 'training';
    document.body.append(el);
  }
  let timer = null;
  let speech = null; // {stop()} while text-to-speech is running

  const stopSpeech = () => {
    if (speech) speech.stop();
    speech = null;
  };
  const close = () => {
    stopSpeech();
    clearInterval(timer);
    el.hidden = true;
    document.body.classList.remove('training-open');
  };

  function textHtml({ chunks = false, translate: tr = false } = {}) {
    let html = '';
    for (let k = 0; k < d.paraStart.length; k++) {
      const [a, b] = paraRange(d, k);
      if (d.flags[a] & F_HEADING) {
        html += `<h3>${esc(d.words.slice(a, b).join(' '))}</h3>`;
        continue;
      }
      html += '<p>';
      for (let i = a; i < b; i++) {
        if (chunks && slashes[i] && i > a) html += '<span class="slash">/</span> ';
        html += `<span data-i="${i}">${esc(d.words[i])}</span> `;
      }
      html += '</p>';
      if (tr) html += `<div class="ja" data-p="${k}"><button class="ja-btn" data-tr="${k}">和訳を見る</button></div>`;
    }
    return html;
  }

  const stepper = () =>
    `<ol class="tr-steps">${STEPS.map((s, k) => `<li class="${k < st.step ? 'done' : k === st.step ? 'on' : ''}"><i>${k + 1}</i><span>${s}</span></li>`).join('')}</ol>`;

  function frame(body, actions, { text = '' } = {}) {
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="close" aria-label="閉じる">${icons.back}</button>
        <span class="tr-title">${esc(title)}</span><span class="rv-spacer"></span></header>
      ${st.step >= 0 && st.step < STEPS.length ? stepper() : ''}
      <div class="tr-body">${body}${text ? `<div class="tr-text">${text}</div>` : ''}</div>
      <div class="tr-actions">${actions}</div>`;
    el.querySelector('[data-a=close]').onclick = () => popLayer();
  }

  // ---------- text to speech: sentence by sentence, highlighting the sentence being spoken
  async function speakSentences(from, to, onDone) {
    stopSpeech();
    let stopped = false;
    const ctl = { stop: () => ((stopped = true), speechSynthesis.cancel(), mark(-1)) };
    speech = ctl;
    const mark = (s) =>
      el.querySelectorAll('.tr-text [data-i]').forEach((w) => w.classList.toggle('speaking', s >= 0 && sentenceOf(Number(w.dataset.i)) === s));
    for (let s = from; s < to && !stopped; s++) {
      const [a, b] = sentences[s];
      const u = await utterance(d.words.slice(a, b).join(' '), host.settings.voice);
      if (typeof u === 'string') {
        toast(u === 'no-voice' ? NO_VOICE_HELP : 'この端末は音声読み上げに対応していません', 5000);
        ctl.stop();
        return;
      }
      if (stopped) return;
      u.rate = st.rate;
      mark(s);
      await new Promise((resolve) => {
        u.onend = resolve;
        u.onerror = resolve;
        speechSynthesis.speak(u);
      });
    }
    mark(-1);
    if (!stopped && speech === ctl) {
      speech = null;
      onDone?.();
    }
  }

  // ---------- steps
  function intro() {
    st.step = -1;
    frame(
      `<div class="tr-intro">
        <h2>1文章トレーニング</h2>
        <p class="muted">${words}語の文章を使って、速読の練習をします。最初と最後に黙読の時間を計り、読む速さがどれだけ上がったかを比べます。</p>
        <ol class="tr-plan">${STEPS.map((s, k) => `<li><b>${s}</b> ${
          ['時間を計って1回読む', 'どのくらい分かったかを記録', 'スラッシュ・辞書・和訳で意味を確認', `音声を${LISTEN_GOAL}回聞く`, '意味を考えながら声に出して読む', 'もう一度時間を計って読む'][k]
        }</li>`).join('')}</ol>
        <div class="row-inline"><span>音読の目標回数</span>
          <div class="seg" data-key="readGoal">${[5, 20].map((n) => `<button data-n="${n}" class="${st.readGoal === n ? 'on' : ''}">${n}回</button>`).join('')}</div></div>
        <p class="muted small">目標: 1回目の黙読で <b>${goal().wpm} WPM・理解度${goal().comp}%</b></p>
      </div>`,
      `<button class="btn primary wide" data-a="next">${icons.play}はじめる</button>`,
    );
    el.querySelectorAll('[data-n]').forEach((b) =>
      b.addEventListener('click', () => {
        st.readGoal = Number(b.dataset.n);
        host.saveSettings({ readAloudGoal: st.readGoal });
        el.querySelectorAll('[data-n]').forEach((x) => x.classList.toggle('on', x === b));
      }),
    );
    el.querySelector('[data-a=next]').onclick = () => silentRead(0);
  }

  /** Steps 1 and 6: the text stays hidden until the timer starts. */
  function silentRead(step) {
    st.step = step;
    const second = step === 5;
    frame(
      `<div class="tr-ready"><p>${second
        ? '練習の成果を確かめます。もう一度、最初から最後まで黙読してください。'
        : '分からないところがあっても止まらず、最後まで読んでください。読み終わったらボタンを押します。'}</p>
        <p class="muted small">${words}語</p></div>`,
      `<button class="btn primary wide" data-a="start">${icons.play}読み始める（時間を計ります）</button>`,
    );
    el.querySelector('[data-a=start]').onclick = () => {
      const t0 = performance.now();
      frame(`<div class="tr-timer">⏱ <b>0:00</b></div>`, '<button class="btn primary wide" data-a="done">読み終わった</button>', { text: textHtml() });
      const clock = el.querySelector('.tr-timer b');
      clearInterval(timer);
      timer = setInterval(() => (clock.textContent = fmtTime(performance.now() - t0)), 500);
      el.querySelector('[data-a=done]').onclick = async () => {
        const ms = performance.now() - t0;
        const wpm = wpmOf(words, ms);
        if (wpm > IMPLAUSIBLE_WPM && !(await confirmSheet(`とても速い記録です（${wpm} WPM）。最後まで読みましたか？`, '記録する'))) return;
        clearInterval(timer);
        if (second) st.t2 = ms;
        else st.t1 = ms;
        host.addReading(book, words, ms);
        if (second) result();
        else comprehension();
      };
    };
  }

  function comprehension() {
    st.step = 1;
    const wpm = wpmOf(words, st.t1);
    frame(
      `<div class="tr-center"><div class="tr-stat"><small>1回目の黙読</small><b>${wpm}</b><small>WPM（${fmtTime(st.t1)}）</small></div>
        <h2>どのくらい理解できましたか？</h2>
        <div class="comp-grid">${COMPREHENSION.map((c) => `<button class="rating" data-p="${c.p}"><span>${c.p}%</span>${c.label}</button>`).join('')}</div></div>`,
      '',
    );
    el.querySelectorAll('[data-p]').forEach((b) =>
      b.addEventListener('click', () => {
        st.comp = Number(b.dataset.p);
        chunkCheck();
      }),
    );
  }

  function chunkCheck() {
    st.step = 2;
    frame(
      '<p class="tr-hint">スラッシュ（/）ごとに意味を確認しましょう。分からない単語はタップして辞書へ（単語帳に保存されます）。最後に和訳と照らし合わせます。</p>',
      '<button class="btn primary wide" data-a="next">次へ：リスニング</button>',
      { text: textHtml({ chunks: true, translate: true }) },
    );
    const box = el.querySelector('.tr-text');
    box.addEventListener('click', async (e) => {
      const t = e.target.closest('[data-tr]');
      if (t) {
        const k = Number(t.dataset.tr);
        const out = t.parentElement;
        const [a, b] = paraRange(d, k);
        out.innerHTML = '<span class="muted">翻訳中…</span>';
        try {
          out.textContent = await translate(d.words.slice(a, b).join(' '), { email: host.settings.mmEmail });
        } catch (err) {
          out.innerHTML = `<span class="muted">${err instanceof QuotaError ? '今日の無料翻訳の上限に達しました' : '翻訳できませんでした（オフライン？）'}</span>`;
        }
        return;
      }
      const w = e.target.closest('[data-i]');
      if (w) {
        openDictSheet({
          doc: d, i: Number(w.dataset.i), book, settings: host.settings, saveSettings: host.saveSettings,
          actions: [{ label: '閉じる', primary: true, onClick: () => closeSheet() }],
        });
      }
    });
    el.querySelector('[data-a=next]').onclick = listen;
  }

  function listen() {
    st.step = 3;
    const render = () => {
      frame(
        `<div class="tr-counter"><b>${st.listens}</b> / ${LISTEN_GOAL}回 聞いた</div>
         <div class="tr-controls">
           <button class="btn ${speech ? 'ghost' : 'primary'}" data-a="play">${speech ? `${icons.pause}止める` : `${icons.play}音声を聞く`}</button>
           <div class="seg small" data-key="rate">${[0.8, 1, 1.2].map((r) => `<button data-r="${r}" class="${st.rate === r ? 'on' : ''}">×${r}</button>`).join('')}</div>
         </div>
         <p class="tr-hint">文字を目で追いながら聞きます。最後まで聞くと1回と数えます。</p>`,
        `<button class="btn ${st.listens >= LISTEN_GOAL ? 'primary' : 'ghost'} wide" data-a="next">次へ：音読${st.listens < LISTEN_GOAL ? '（スキップ）' : ''}</button>`,
        { text: textHtml() },
      );
      el.querySelector('[data-a=play]').onclick = () => {
        if (speech) {
          stopSpeech();
          render();
          return;
        }
        speakSentences(0, sentences.length, () => {
          st.listens++;
          render();
        });
        render();
      };
      el.querySelectorAll('[data-r]').forEach((b) =>
        b.addEventListener('click', () => {
          st.rate = Number(b.dataset.r);
          el.querySelectorAll('[data-r]').forEach((x) => x.classList.toggle('on', x === b));
        }),
      );
      el.querySelector('[data-a=next]').onclick = () => {
        stopSpeech();
        readAloud();
      };
    };
    render();
  }

  function readAloud() {
    st.step = 4;
    const render = () => {
      const fast = st.readGoal >= 20 && st.reads >= st.readGoal - 5;
      frame(
        `<p class="tr-hint">${fast
          ? '仕上げの<b>速音読</b>：意味を保ったまま、できるだけ速く読みましょう。'
          : '意味を思い浮かべながら、声に出して読みます。文をタップするとお手本の音声が流れます。'}</p>`,
        `<button class="btn primary wide tr-count-btn" data-a="count">音読した <b>${st.reads}</b> / ${st.readGoal}回</button>
         <button class="btn ${st.reads >= st.readGoal ? 'primary' : 'ghost'} wide" data-a="next">次へ：もう一度黙読${st.reads < st.readGoal ? '（スキップ）' : ''}</button>`,
        { text: textHtml() },
      );
      el.querySelector('[data-a=count]').onclick = () => {
        st.reads++;
        render();
      };
      el.querySelector('.tr-text').addEventListener('click', (e) => {
        const w = e.target.closest('[data-i]');
        if (!w) return;
        const s = sentenceOf(Number(w.dataset.i));
        if (s >= 0) speakSentences(s, s + 1);
      });
      el.querySelector('[data-a=next]').onclick = () => {
        stopSpeech();
        silentRead(5);
      };
    };
    render();
  }

  function result() {
    st.step = STEPS.length;
    const g = goal();
    const wpm1 = wpmOf(words, st.t1);
    const wpm2 = wpmOf(words, st.t2);
    const rec = { bookId: book.id, title, words, wpm1, wpm2, comp: st.comp, listens: st.listens, reads: st.reads, goalWpm: g.wpm, goalComp: g.comp };
    host.recordTraining(rec);
    const ok = goals.achieved(rec, g);
    const gain = Math.round(((wpm2 - wpm1) / wpm1) * 100);
    const missing = [wpm1 < g.wpm && `速さ あと${g.wpm - wpm1} WPM`, st.comp < g.comp && `理解度 あと${g.comp - st.comp}%`].filter(Boolean).join('・');
    frame(
      `<div class="tr-result">
        <div class="tr-compare">
          <div><small>1回目</small><b>${wpm1}</b><small>WPM</small></div>
          <div class="arrow">→</div>
          <div><small>練習後</small><b>${wpm2}</b><small>WPM</small></div>
        </div>
        <p class="tr-gain">${gain >= 0 ? `+${gain}%` : `${gain}%`} ${gain >= 30 ? '速く読めるようになりました！' : gain >= 0 ? '' : '（丁寧に読めた証拠です）'}</p>
        <div class="goal-badge ${ok ? 'ok' : ''}">${ok ? '✓ 目標達成' : '目標まで'}<span>${g.wpm} WPM・理解度${g.comp}%${ok ? '' : ` — ${missing}`}</span></div>
        <dl class="facts">
          <div><dt>理解度（1回目）</dt><dd>${st.comp}%</dd></div>
          <div><dt>語数</dt><dd>${words}語</dd></div>
          <div><dt>リスニング</dt><dd>${st.listens}回</dd></div>
          <div><dt>音読</dt><dd>${st.reads}回</dd></div>
        </dl>
        <p class="muted small">目標の判定は、練習前の1回目の黙読で行います。記録は「記録」タブで見られます。</p>
      </div>`,
      '<button class="btn primary wide" data-a="done">読書に戻る</button>',
    );
    el.querySelector('[data-a=done]').onclick = () => popLayer();
  }

  el.hidden = false;
  document.body.classList.add('training-open');
  pushLayer(close);
  intro();
}
