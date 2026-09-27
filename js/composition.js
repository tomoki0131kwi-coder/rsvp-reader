// ②-2 文章化: 瞬間英作文 (see Japanese -> say it in English -> compare with the model -> read aloud -> grade).
// Sentences: Tatoeba (CC BY 2.0 FR). Review timing reuses the word book's spaced-repetition schedule.
import * as db from './db.js';
import { schedule, intervalLabel } from './vocab.js';
import { utterance, NO_VOICE_HELP } from './speech.js';
import { listen, sttSupported, sttErrorText, STT_NOTE } from './stt.js';
import { compare, diffHtml } from './textdiff.js';
import { $, esc, icons, pushLayer, popLayer, toast } from './ui.js';

const LESSON_SIZE = 10;
const STORE = 'composition';
const META = 'compositionMeta';
export const LEVEL_NAMES = { 1: '基本', 2: 'やさしい', 3: 'ふつう', 4: 'やや難', 5: '難しめ' };
const GRADES = [
  { g: 0, label: 'もう一度', cls: 'again' },
  { g: 1, label: '難しい', cls: 'hard' },
  { g: 2, label: '正解', cls: 'good' },
  { g: 3, label: '簡単', cls: 'easy' },
];

let dataPromise = null;
const loadData = () => {
  if (!dataPromise) {
    dataPromise = fetch('data/composition.json').then((r) => r.json());
    dataPromise.catch(() => (dataPromise = null));
  }
  return dataPromise;
};

export async function status() {
  const [store, meta] = await Promise.all([db.get(STORE, {}), db.get(META, { level: 1, tag: '' })]);
  const now = Date.now();
  return { due: Object.values(store).filter((e) => e.due <= now).length, learned: Object.keys(store).length, meta };
}

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

async function say(text, settings) {
  const u = await utterance(text, settings.voice);
  if (typeof u === 'string') return toast(u === 'no-voice' ? NO_VOICE_HELP : 'この端末は音声読み上げに対応していません', 5000);
  u.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/** @param host {settings, recordPractice(rec)} */
export async function startComposition(host) {
  let data;
  try {
    data = await loadData();
  } catch {
    return toast('例文データを読み込めませんでした（オフライン？）');
  }
  const store = await db.get(STORE, {});
  const meta = { level: 1, tag: '', ...(await db.get(META)) };
  const byId = new Map(data.items.map((it) => [it[0], it]));
  let stt = null;
  const el = overlay(() => {
    stt?.stop();
    speechSynthesis.cancel();
  });

  // ---------- lesson setup
  function setup() {
    const now = Date.now();
    const due = Object.values(store).filter((e) => e.due <= now && byId.has(e.id)).length;
    const pool = data.items.filter((it) => it[3] === meta.level && (!meta.tag || it[4].includes(meta.tag)));
    const fresh = pool.filter((it) => !store[it[0]]).length;
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button><span>瞬間英作文</span><span class="rv-spacer"></span></header>
      <div class="tr-body">
        <p class="tr-hint">日本語を見て、すぐに英語で言います。暗記ではなく、何度も英作文することで文の型を体に入れる練習です。</p>
        <div class="card form"><div class="row stacked"><span>レベル</span>
          <div class="seg">${[1, 2, 3, 4, 5].map((l) => `<button data-level="${l}" class="${meta.level === l ? 'on' : ''}">${l} ${LEVEL_NAMES[l]}</button>`).join('')}</div></div>
          <div class="row stacked"><span>文法で絞り込む（任意）</span>
          <div class="chips wrap">${['', ...data.tags].map((t) => `<button class="chip${meta.tag === t ? ' on' : ''}" data-tag="${esc(t)}">${t || 'すべて'}</button>`).join('')}</div></div></div>
        <dl class="facts"><div><dt>復習</dt><dd>${due}文</dd></div><div><dt>このレベルの未学習</dt><dd>${fresh}文</dd></div></dl>
        ${sttSupported ? `<p class="muted small">🎤 声で答えると自動で答え合わせします。${STT_NOTE}</p>` : '<p class="muted small">この端末では音声認識が使えないため、キーボードで答えます。</p>'}
      </div>
      <div class="tr-actions"><button class="btn primary wide" data-a="start" ${due + fresh ? '' : 'disabled'}>${icons.play}${LESSON_SIZE}問に挑戦</button></div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelectorAll('[data-level]').forEach((b) =>
      b.addEventListener('click', async () => {
        meta.level = Number(b.dataset.level);
        await db.set(META, meta);
        setup();
      }),
    );
    el.querySelectorAll('[data-tag]').forEach((b) =>
      b.addEventListener('click', async () => {
        meta.tag = b.dataset.tag;
        await db.set(META, meta);
        setup();
      }),
    );
    el.querySelector('[data-a=start]').onclick = () => {
      const reviews = Object.values(store).filter((e) => e.due <= Date.now() && byId.has(e.id)).sort((a, b) => a.due - b.due).slice(0, LESSON_SIZE);
      const fresh = pool.filter((it) => !store[it[0]]).slice(0, LESSON_SIZE - reviews.length);
      lesson([...reviews.map((e) => byId.get(e.id)), ...fresh]);
    };
  }

  // ---------- lesson
  function lesson(items) {
    const queue = [...items];
    const retry = [];
    const results = [];
    let k = 0;
    let answer = '';
    let result = null;
    let round = 1;

    function card() {
      if (k >= queue.length) {
        // Site method: after 10 sentences, do the missed ones again.
        if (round === 1 && retry.length) {
          round = 2;
          queue.push(...retry.splice(0));
          return card();
        }
        return finish();
      }
      const it = queue[k];
      answer = '';
      result = null;
      el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button>
          <span>${round === 2 ? '再チャレンジ' : '瞬間英作文'} · ${k + 1} / ${queue.length}</span><span class="rv-spacer"></span></header>
        <div class="rv-card">
          <div class="rv-label">英語で言いましょう${it[4].length ? ` · <span class="muted">${it[4].map(esc).join('・')}</span>` : ''}</div>
          <div class="cp-ja">${esc(it[2])}</div>
          <div class="cp-answer muted">${sttSupported ? '🎤 を押して話してください' : ''}</div>
          <form class="cp-type"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="キーボードで答える"><button class="btn ghost" type="submit">答え合わせ</button></form>
        </div>
        <div class="rv-actions">
          ${sttSupported ? `<button class="btn primary wide tr-count-btn" data-a="mic">🎤 話して答える</button>` : ''}
          <button class="link-btn center" data-a="giveup">わからない（答えを見る）</button></div>`;
      el.querySelector('[data-a=back]').onclick = () => popLayer();
      el.querySelector('.cp-type').addEventListener('submit', (e) => {
        e.preventDefault();
        const v = e.target.querySelector('input').value.trim();
        if (v) check(v);
      });
      el.querySelector('[data-a=giveup]').onclick = () => check('');
      el.querySelector('[data-a=mic]')?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const live = el.querySelector('.cp-answer');
        if (stt) {
          stt.stop();
          return;
        }
        btn.textContent = '■ 話し終えたらタップ';
        live.textContent = '聞き取り中…';
        stt = listen({
          continuous: false,
          onText: (fin, interim) => (live.textContent = `${fin} ${interim}`.trim()),
          onEnd: (text) => {
            stt = null;
            if (text) check(text);
            else {
              btn.textContent = '🎤 話して答える';
              live.textContent = 'うまく聞き取れませんでした。もう一度どうぞ';
            }
          },
          onError: (code) => {
            stt = null;
            toast(sttErrorText(code), 5000);
            btn.textContent = '🎤 話して答える';
          },
        });
      });
    }

    function check(text) {
      const it = queue[k];
      answer = text;
      result = text ? compare(it[1], text) : null;
      const pct = result ? Math.round(result.score * 100) : 0;
      const suggested = pct >= 90 ? 2 : pct >= 60 ? 1 : 0;
      const e = store[it[0]] || { id: it[0], due: 0, interval: 0, ease: 2.5, reps: 0, lapses: 0 };
      el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button>
          <span>${round === 2 ? '再チャレンジ' : '瞬間英作文'} · ${k + 1} / ${queue.length}</span><span class="rv-spacer"></span></header>
        <div class="rv-card">
          <div class="cp-ja small">${esc(it[2])}</div>
          <div class="rv-label">模範解答</div>
          <div class="cp-model">${result ? diffHtml(result) : esc(it[1])} <button class="icon-btn speak" data-a="speak" aria-label="発音を聞く">${icons.speaker}</button></div>
          ${text ? `<div class="rv-label">あなたの答え · 一致率 <b>${pct}%</b></div><div class="cp-mine">${esc(text)}</div>` : ''}
          <p class="muted small">赤い語が、あなたの答えになかった語です。言い方が違っても意味が合っていれば正解にして構いません。</p>
          <div class="cp-drill"><span class="small">お手本を聞いて</span>
            <button class="chip" data-drill="read">音読 <b>0</b>/3</button><button class="chip" data-drill="recite">暗唱 <b>0</b>/3</button></div>
          <small class="muted">例文: Tatoeba #${it[0]}（CC BY 2.0 FR）</small>
        </div>
        <div class="rv-actions"><div class="grades">${GRADES.map((x) => `<button class="grade ${x.cls}${x.g === suggested && text ? ' suggest' : ''}" data-g="${x.g}"><b>${x.label}</b><small>${intervalLabel(e, x.g)}</small></button>`).join('')}</div></div>`;
      el.querySelector('[data-a=back]').onclick = () => popLayer();
      el.querySelector('[data-a=speak]').onclick = () => say(it[1], host.settings);
      el.querySelectorAll('[data-drill]').forEach((b) =>
        b.addEventListener('click', () => {
          const n = Math.min(3, Number(b.querySelector('b').textContent) + 1);
          b.querySelector('b').textContent = n;
          b.classList.toggle('on', n >= 3);
          if (b.dataset.drill === 'read') say(it[1], host.settings);
        }),
      );
      el.querySelectorAll('[data-g]').forEach((b) =>
        b.addEventListener('click', async () => {
          const g = Number(b.dataset.g);
          store[it[0]] = { ...e, ...schedule(e, g), lastReview: Date.now() };
          await db.set(STORE, store);
          if (round === 1) results.push({ id: it[0], g, score: result ? result.score : 0 });
          if (g === 0 && round === 1) retry.push(it);
          k++;
          card();
        }),
      );
      say(it[1], host.settings);
    }

    function finish() {
      const correct = results.filter((r) => r.g >= 2).length;
      const avg = results.length ? Math.round((results.reduce((a, r) => a + r.score, 0) / results.length) * 100) : 0;
      host.recordPractice({ type: 'composition', n: results.length, correct, score: avg, level: meta.level });
      el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button><span></span><span class="rv-spacer"></span></header>
        <div class="rv-done"><div class="big-emoji">✍️</div><h2>レッスン完了</h2>
          <div class="tr-stat"><small>正解</small><b>${correct} / ${results.length}</b><small>平均一致率 ${avg}%</small></div>
          <p class="muted small">間違えた文は、忘れかけた頃にまた出題されます。</p>
          <button class="btn ghost wide" data-a="more">もう1レッスン</button>
          <button class="btn primary wide" data-a="back2">終わる</button></div>`;
      el.querySelector('[data-a=back]').onclick = () => popLayer();
      el.querySelector('[data-a=back2]').onclick = () => popLayer();
      el.querySelector('[data-a=more]').onclick = setup;
    }

    card();
  }

  setup();
}
