// 単語帳 tab: daily goal, frequent-word decks, flashcard review (with read-aloud drill on misses),
// and the multiple-choice check test (目標9割).
import * as vocab from './vocab.js';
import { speak, NO_VOICE_HELP } from './speech.js';
import { translate, QuotaError } from './translate.js';
import { $, esc, icons, openSheet, closeSheet, pushLayer, popLayer, toast } from './ui.js';

const GRADES = [
  { g: 0, label: 'もう一度', cls: 'again' },
  { g: 1, label: '難しい', cls: 'hard' },
  { g: 2, label: '正解', cls: 'good' },
  { g: 3, label: '簡単', cls: 'easy' },
];
const READ_ALOUD_TIMES = 3;
const TEST_SIZE = 20;
const TEST_MIN = 10;
const TEST_GOAL = 90; // %
const TEST_INTERVAL_DAYS = 7;

const senses = (meaning, n = 8) => String(meaning || '').split(' / ').slice(0, n);
const firstSense = (meaning) => senses(meaning, 1)[0]?.replace(/〈[^〉]*〉|《[^》]*》/g, '').replace(/[『』]/g, '').trim() || '';
const shortSense = (meaning) => {
  const s = firstSense(meaning);
  return s.length > 26 ? `${s.slice(0, 25)}…` : s;
};
const fmtSense = (s) => esc(s).replace(/『(.+?)』/g, '<b>$1</b>');
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const studied = (e) => e.reps > 0 || e.lapses > 0;

function whenLabel(t) {
  const days = Math.round((new Date(t).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
  if (t <= Date.now()) return '今';
  if (days <= 0) return '今日';
  if (days === 1) return '明日';
  return `${days}日後`;
}

async function say(text, settings) {
  const r = await speak(text, settings.voice);
  if (r === 'unsupported') toast('この端末は音声読み上げに対応していません');
  else if (r === 'no-voice') toast(NO_VOICE_HELP, 6000);
}

/** Sentence with the word highlighted (or blanked for a cloze card). */
function contextHtml(e, mode = 'mark') {
  if (!e.ctx || !e.ctx.length) return '';
  return e.ctx
    .map((w, k) => {
      if (k !== e.at) return esc(w);
      const m = w.match(/^([^A-Za-z]*)(.*?)([^A-Za-z]*)$/);
      const [lead, core, tail] = m ? [m[1], m[2], m[3]] : ['', w, ''];
      if (mode === 'blank') return `${esc(lead)}<span class="blank">${esc(core[0] || '')}${'＿'.repeat(Math.max(2, core.length - 1))}</span>${esc(tail)}`;
      return `${esc(lead)}<mark>${esc(core)}</mark>${esc(tail)}`;
    })
    .join(' ');
}

const dots = (n) => `<span class="dots" title="定着度">${[1, 2, 3, 4].map((k) => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span>`;

function overlay() {
  let el = $('#review');
  if (!el) {
    el = document.createElement('section');
    el.id = 'review';
    el.className = 'review';
    document.body.append(el);
  }
  return el;
}

// ---------- tab
export function viewVocab(host) {
  const entries = vocab.cachedAll().sort((a, b) => b.added - a.added);
  const meta = vocab.cachedMeta();
  const due = entries.filter((e) => e.due <= Date.now()).length;
  const newLeft = vocab.newLeftToday();
  const learned = entries.filter((e) => vocab.strength(e) >= 3).length;
  const next = vocab.nextDue(entries);
  const done = host.todayReviews();
  const goal = host.settings.wordGoal;

  let box;
  if (due || newLeft) {
    box = `<div class="card review-box"><div class="rb-counts">
        ${due ? `<span><small>復習</small><b>${due}</b><small>語</small></span>` : ''}
        ${newLeft ? `<span><small>新しい単語</small><b>${newLeft}</b><small>語</small></span>` : ''}</div>
      <button class="btn primary" data-review>${icons.play}学習を始める</button></div>`;
  } else if (entries.length) {
    const nextCount = next ? entries.filter((e) => new Date(e.due).toDateString() === new Date(next).toDateString()).length : 0;
    box = `<div class="card review-box done"><div><b>今日の復習は完了です</b>
      <small>${next ? `次は${whenLabel(next)}（${nextCount}語）` : ''}</small></div></div>`;
  } else {
    box = `<div class="card review-box empty-vocab"><p>読書中に一時停止して単語をタップすると、調べた単語が<b>出てきた英文と一緒に</b>ここへ自動で保存されます。下の「単語デッキ」で、よく使う単語を毎日少しずつ覚えることもできます。</p>
      <p class="muted small">忘れかけた頃に復習の順番が回ってくるので、1日数分の復習で定着します。</p></div>`;
  }

  const goalBar = `<div class="card day-goal"><div class="dg-top"><span>今日の単語学習</span><span><b>${done}</b> / ${goal}回</span></div>
    <div class="bar"><i style="width:${Math.min(100, (done / goal) * 100)}%"></i></div>
    <small class="muted">${done >= goal ? '今日の目標を達成しました！' : `目標まであと${goal - done}回（復習・新しい単語の合計）`}</small></div>`;

  const deck = meta.deck === vocab.ADAPTIVE
    ? `<div class="card deck-card adaptive"><div class="deck-top"><div><b>📚 ${vocab.DECKS[meta.deck].name}</b>
          <span class="lv-now">Lv${meta.level || 1}<small data-level-range></small></span></div>
        <button class="link-btn" data-deck-change>変更</button></div>
        <div class="bar"><i data-deck-bar style="width:0%"></i></div>
        <small class="muted" data-deck-progress>読み込み中…</small>
        ${meta.placement ? `<small>推定語彙数 <b>約${meta.placement.estimate.toLocaleString()}語</b>（${new Date(meta.placement.t).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}の診断）</small>` : ''}
        ${meta.levelLog?.length ? `<small class="lv-log">${levelLogText(meta.levelLog[meta.levelLog.length - 1])}</small>` : ''}
        <div class="row-inline"><span>1日の新しい単語</span>
          <div class="seg small">${[5, 10, 20, 30].map((n) => `<button data-newper="${n}" class="${meta.newPerDay === n ? 'on' : ''}">${n}語</button>`).join('')}</div></div>
        <div class="btn-row"><button class="btn ghost" data-placement>レベル診断</button>
          <button class="btn ghost" data-level-step="-1" ${(meta.level || 1) <= 1 ? 'disabled' : ''}>Lv−</button>
          <button class="btn ghost" data-level-step="1" ${(meta.level || 1) >= 9 ? 'disabled' : ''}>Lv＋</button></div>
        <small class="muted">新しい単語で「簡単」を選ぶと“最初から知っていた”と記録されます。今のレベルの語を6割以上知っていればレベルが上がり、復習の正答率が65%を下回ると下がります。</small></div>`
    : meta.deck
    ? `<div class="card deck-card"><div class="deck-top"><div><b>📚 ${vocab.DECKS[meta.deck].name}</b>
          <small class="muted" data-deck-progress>読み込み中…</small></div>
        <button class="link-btn" data-deck-change>変更</button></div>
        <div class="bar"><i data-deck-bar style="width:0%"></i></div>
        <div class="row-inline"><span>1日の新しい単語</span>
          <div class="seg small">${[5, 10, 20, 30].map((n) => `<button data-newper="${n}" class="${meta.newPerDay === n ? 'on' : ''}">${n}語</button>`).join('')}</div></div></div>`
    : `<div class="card deck-card"><b>📚 単語デッキで覚える</b>
        <p class="muted small">よく使う単語を、同梱の本に出てくる頻度の高い順に、毎日少しずつ学びます。例文は同梱のやさしい本から選んであります。</p>
        <div class="deck-choices">${Object.entries(vocab.DECKS)
          .map(([id, d]) => `<button class="card pick" data-deck="${id}"><b>${d.name}</b><small class="muted">${d.desc}</small></button>`)
          .join('')}</div></div>`;

  const done4test = entries.filter(studied);
  const lastTest = meta.tests[meta.tests.length - 1];
  const testDue = done4test.length >= TEST_SIZE && (!lastTest || Date.now() - lastTest.t > TEST_INTERVAL_DAYS * 86400000);
  const test = `<div class="card test-card${testDue ? ' due' : ''}"><div><b>📝 確認テスト</b>
      <small class="muted">${done4test.length >= TEST_MIN
        ? `学習した単語から${Math.min(TEST_SIZE, done4test.length)}問・4択。目標は正答率${TEST_GOAL}%`
        : `${TEST_MIN}語以上学習するとテストできます（いま${done4test.length}語）`}</small>
      ${lastTest ? `<small class="muted">前回: ${Math.round((lastTest.correct / lastTest.n) * 100)}%（${lastTest.correct}/${lastTest.n}）· ${new Date(lastTest.t).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}</small>` : ''}
      ${testDue ? '<small class="test-due">そろそろ確認テストの時期です</small>' : ''}</div>
    <button class="btn ${testDue ? 'primary' : 'ghost'}" data-test ${done4test.length < TEST_MIN ? 'disabled' : ''}>テスト</button></div>`;

  const list = entries
    .map((e) => `<button class="card word-item" data-word="${esc(e.word)}" data-key="${esc(`${e.word} ${e.meaning}`.toLowerCase())}">
      <div class="w-top"><b>${esc(e.word)}</b>${e.pron ? `<span class="pron">/${esc(e.pron)}/</span>` : ''}${dots(vocab.strength(e))}</div>
      <div class="w-mean">${esc(firstSense(e.meaning)) || '<span class="muted">（英和辞書に未収録）</span>'}</div></button>`)
    .join('');

  return `<header class="top"><div><h1>単語帳</h1><p class="muted">${entries.length}語 · よく覚えた ${learned}語</p></div></header>
    ${box}${goalBar}${deck}${test}
    ${entries.length ? `<h2 class="section">単語一覧</h2><form class="search" id="vocab-search" autocomplete="off">${icons.search}<input id="vq" type="search" placeholder="単語帳を検索（英語・日本語）"></form>
    <div class="word-list">${list}</div>
    <div class="btn-row"><button class="btn ghost" data-csv>${icons.file}CSVで書き出す</button></div>` : ''}`;
}

export function bindVocab(view, host) {
  const q = $('#vq', view);
  if (q) {
    q.addEventListener('input', () => {
      const t = q.value.trim().toLowerCase();
      view.querySelectorAll('.word-item').forEach((el) => (el.hidden = t && !el.dataset.key.includes(t)));
    });
    $('#vocab-search', view).addEventListener('submit', (e) => {
      e.preventDefault();
      q.blur();
    });
  }
  view.querySelector('[data-review]')?.addEventListener('click', () => startReview(host));
  view.querySelector('[data-test]')?.addEventListener('click', () => startTest(host));
  view.querySelector('[data-csv]')?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + vocab.toCsv(vocab.cachedAll())], { type: 'text/csv' }));
    a.download = 'rsvp-reader-vocab.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  });
  view.querySelectorAll('[data-word]').forEach((b) => b.addEventListener('click', () => wordSheet(b.dataset.word, host)));
  view.querySelectorAll('[data-deck]').forEach((b) => b.addEventListener('click', () => chooseDeck(b.dataset.deck, host)));
  view.querySelector('[data-placement]')?.addEventListener('click', () => startPlacement(host));
  view.querySelectorAll('[data-level-step]').forEach((b) =>
    b.addEventListener('click', async () => {
      const to = Math.min(9, Math.max(1, (vocab.cachedMeta().level || 1) + Number(b.dataset.levelStep)));
      await vocab.setLevel(to, '手動で変更');
      host.rerender();
    }),
  );
  if (view.querySelector('.deck-card.adaptive')) {
    vocab
      .adaptiveStatus()
      .then((st) => {
        view.querySelector('[data-level-range]').textContent = ` 頻度${st.range}`;
        view.querySelector('[data-deck-progress]').textContent = `このレベルの学習中 ${st.inBook} / ${st.size}語`;
        view.querySelector('[data-deck-bar]').style.width = `${(st.inBook / st.size) * 100}%`;
      })
      .catch(() => (view.querySelector('[data-deck-progress]').textContent = '単語データを読み込めませんでした（オフライン？）'));
  }
  view.querySelector('[data-deck-change]')?.addEventListener('click', () => deckSheet(host));
  view.querySelectorAll('[data-newper]').forEach((b) =>
    b.addEventListener('click', async () => {
      await vocab.saveMeta({ newPerDay: Number(b.dataset.newper) });
      host.rerender();
    }),
  );
  const progress = view.querySelector('.deck-card:not(.adaptive) [data-deck-progress]');
  if (progress) {
    vocab
      .deckProgress()
      .then((p) => {
        progress.textContent = `学習中 ${p.inBook} / ${p.total}語 · 定着 ${p.learned}語`;
        view.querySelector('[data-deck-bar]').style.width = `${(p.inBook / p.total) * 100}%`;
      })
      .catch(() => (progress.textContent = '単語リストを読み込めませんでした（オフライン？）'));
  }
}

function deckSheet(host) {
  const cur = vocab.cachedMeta().deck;
  const panel = openSheet(`<h2 class="sheet-title">単語デッキ</h2><div class="menu">
    ${Object.entries(vocab.DECKS).map(([id, d]) => `<button data-d="${id}">${id === cur ? '✓ ' : ''}${d.name}<br><small class="muted">${d.desc}</small></button>`).join('')}
    <button data-d="" class="danger-text">デッキを使わない（覚えた単語は残ります）</button></div>`);
  panel.querySelectorAll('[data-d]').forEach((b) =>
    b.addEventListener('click', () => closeSheet(() => chooseDeck(b.dataset.d || null, host))));
}

function levelLogText(c) {
  const date = new Date(c.t).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
  return c.from === c.to ? `${date} Lv${c.to}に設定（${c.reason}）` : `${date} Lv${c.from}→Lv${c.to}（${c.reason}）`;
}

/** Choosing the adaptive deck offers the placement test first. */
function chooseDeck(id, host) {
  if (id !== vocab.ADAPTIVE) {
    vocab.saveMeta({ deck: id }).then(() => {
      if (id) toast(`「${vocab.DECKS[id].name}」で学習を始めます`);
      host.rerender();
    });
    return;
  }
  const panel = openSheet(`<div class="check"><h2 class="sheet-title">レベル別語彙（自動調整）</h2>
    <p class="small">はじめにレベル診断（約3〜5分）をすると、あなたに合ったレベルから始められます。診断しない場合はLv1から始まり、学習しながら自動で上がっていきます。</p>
    <div class="sheet-actions"><button class="btn ghost" data-a="skip">Lv1から始める</button><button class="btn primary" data-a="test">診断する</button></div></div>`);
  panel.querySelector('[data-a=skip]').onclick = async () => {
    await vocab.saveMeta({ deck: vocab.ADAPTIVE, level: vocab.cachedMeta().level || 1 });
    closeSheet(() => host.rerender());
  };
  panel.querySelector('[data-a=test]').onclick = () => closeSheet(() => startPlacement(host));
}

async function wordSheet(word, host) {
  const e = await vocab.get(word);
  if (!e) return;
  const panel = openSheet(`
    <div class="dict">
      <div class="dict-head"><div class="dict-title"><h2>${esc(e.word)}</h2>
        <button class="icon-btn speak" data-a="speak" aria-label="発音を聞く">${icons.speaker}</button></div>${dots(vocab.strength(e))}</div>
      <div class="dict-pron">${e.pron ? `/${esc(e.pron)}/` : ''}</div>
      <div class="dict-body"><ol>${senses(e.meaning).map((s) => `<li>${fmtSense(s)}</li>`).join('') || '<li class="muted">（英和辞書に未収録）</li>'}</ol></div>
      ${e.ctx ? `<blockquote class="w-ctx">${contextHtml(e)}<cite>${esc(e.bookTitle || '')}</cite></blockquote><button class="link-btn ctx-say" data-a="say-ctx">🔊 例文を聞く</button>` : ''}
      <p class="muted small">${e.source === 'deck' ? '単語デッキから' : `調べた回数 ${e.seen}回`} · 次の復習 ${whenLabel(e.due)}</p>
      <div class="sheet-actions"><button class="btn danger-ghost" data-a="del">単語帳から削除</button><button class="btn ghost" data-a="close">閉じる</button></div>
    </div>`);
  panel.querySelector('[data-a=speak]').onclick = () => say(e.word, host.settings);
  panel.querySelector('[data-a=say-ctx]')?.addEventListener('click', () => say(e.ctx.join(' '), host.settings));
  panel.querySelector('[data-a=close]').onclick = () => closeSheet();
  panel.querySelector('[data-a=del]').onclick = async () => {
    await vocab.remove(word);
    closeSheet();
    host.rerender();
  };
}

// ---------- review session
export async function startReview(host) {
  try {
    await vocab.introduceNew(); // today's new deck words join the queue (due now)
  } catch {
    toast('単語デッキを読み込めませんでした（オフライン？）。復習だけ行います');
  }
  const queue = await vocab.dueList();
  if (!queue.length) return host.rerender();
  const el = overlay();
  const shown = new Map(); // word -> times shown this session
  let idx = 0;
  let reviewed = 0;
  let revealed = false;
  let drill = 0; // >0 while the read-aloud drill after a miss is showing (count so far + 1)
  let knownCount = 0;
  let levelChange = null;

  const close = () => {
    el.hidden = true;
    document.body.classList.remove('reading');
    document.removeEventListener('keydown', onKey);
    host.rerender();
  };

  const card = () => queue[idx];
  const isNew = (e) => e.source === 'deck' && e.reps === 0 && e.lapses === 0;
  const cardType = (e) => (e.reps >= 2 && e.reps % 2 === 0 && e.ctx ? 'cloze' : 'meaning');
  const speakBtn = '<button class="icon-btn speak" data-a="speak" aria-label="発音を聞く">' + icons.speaker + '</button>';
  const ctxBtn = '<button class="link-btn ctx-say" data-a="say-ctx">🔊 例文を聞く</button>';
  let spokenAt = -1; // queue position whose word was already read out automatically

  function header(left) {
    return `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button>
      <span>${left}</span><span class="rv-spacer"></span></header>`;
  }

  function render() {
    const e = card();
    if (!e) {
      el.innerHTML = `${header('')}
        <div class="rv-done"><div class="big-emoji">✅</div><h2>今日の学習完了！</h2><p>${reviewed}回 学習しました。</p>
        ${knownCount ? `<p class="small">最初から知っていた単語 ${knownCount}語（1か月後に確認します）</p>` : ''}
        ${levelChange ? `<div class="goal-badge ${levelChange.to > levelChange.from ? 'ok' : ''}">レベルが Lv${levelChange.from} → Lv${levelChange.to} になりました<span>${levelChange.reason}</span></div>` : ''}
        <p class="muted small">今日の合計 ${host.todayReviews()} / ${host.settings.wordGoal}回</p>
        <button class="btn primary wide" data-a="back">単語帳へ戻る</button></div>`;
      el.querySelectorAll('[data-a=back]').forEach((b) => (b.onclick = () => popLayer()));
      return;
    }
    if (drill) return renderDrill(e);
    const type = cardType(e);
    const front =
      type === 'cloze'
        ? `<div class="rv-label">空所に入る単語は？</div>
           <p class="rv-ctx">${contextHtml(e, 'blank')}</p>
           <div class="rv-hint">ヒント: ${esc(firstSense(e.meaning)) || '—'}</div>`
        : `<div class="rv-label">${isNew(e) ? `<span class="new-tag">新しい単語${e.band ? ` Lv${e.band}` : ''}</span> 意味がわかりますか？` : '意味は？'}</div>
           <div class="rv-word">${esc(e.word)} ${speakBtn}</div>
           ${e.pron ? `<div class="rv-pron">/${esc(e.pron)}/</div>` : ''}
           ${e.ctx ? `<p class="rv-ctx">${contextHtml(e)}</p>${ctxBtn}` : ''}`;
    const back = revealed
      ? `<div class="rv-answer">
          ${type === 'cloze' ? `<div class="rv-word">${esc(e.word)} ${speakBtn}</div>${e.pron ? `<div class="rv-pron">/${esc(e.pron)}/</div>` : ''}<p class="rv-ctx">${contextHtml(e)}</p>${ctxBtn}` : ''}
          <ol>${senses(e.meaning, 5).map((s) => `<li>${fmtSense(s)}</li>`).join('') || '<li class="muted">（英和辞書に未収録）</li>'}</ol>
          ${e.bookTitle ? `<cite>${esc(e.bookTitle)}</cite>` : ''}
          ${e.ctx && host.settings.exampleHelp ? `<div class="ex-help">
            <div class="rv-label">例文の和訳 <small>機械翻訳</small></div><button class="link-btn ctx-say ex-ja-btn" data-a="show-ja">和訳を表示</button><p class="ex-ja" hidden></p>
            <div class="rv-label">例文の文法 <small>形から自動で判定（目安）</small></div><div class="ex-gram"></div></div>` : ''}
        </div>`
      : '';
    const actions = revealed
      ? `<div class="grades">${GRADES.map((x) => `<button class="grade ${x.cls}" data-g="${x.g}"><b>${x.label}</b><small>${vocab.intervalLabel(e, x.g)}</small></button>`).join('')}</div>`
      : '<button class="btn primary wide" data-a="show">答えを見る</button>';
    el.innerHTML = `${header(`学習 · 残り <b>${queue.length - idx}</b>`)}
      <div class="rv-card">${front}${back}</div>
      <div class="rv-actions">${actions}</div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelector('[data-a=show]')?.addEventListener('click', reveal);
    el.querySelectorAll('[data-a=speak]').forEach((b) => (b.onclick = () => say(e.word, host.settings)));
    el.querySelectorAll('[data-a=say-ctx]').forEach((b) => (b.onclick = () => say(e.ctx.join(' '), host.settings)));
    el.querySelectorAll('[data-g]').forEach((b) => (b.onclick = () => answer(Number(b.dataset.g))));
    if (revealed && el.querySelector('.ex-help')) exampleHelp(e);
    // Read the word out once when its card opens (not on a fill-in-the-blank card: that would give the answer away).
    if (!revealed && type === 'meaning' && spokenAt !== idx && host.settings.autoSpeakWord) {
      spokenAt = idx;
      say(e.word, host.settings);
    }
  }

  /** Answer side: Japanese translation of the example sentence and the grammar it uses (links to the 英文法コース). */
  async function exampleHelp(e) {
    const text = e.ctx.join(' ');
    const ja = el.querySelector('.ex-ja');
    const gram = el.querySelector('.ex-gram');
    import('./grammarDetect.js')
      .then(({ detectGrammar }) => {
        const hits = detectGrammar(text);
        if (!gram.isConnected) return;
        gram.innerHTML = hits.length
          ? hits.map((h) => `<button class="ex-gram-item" data-sec="${h.section.id}"><b>${esc(h.section.id)} ${esc(h.section.title)}</b>
              <span class="ex-gram-match">“${esc(h.match.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, ''))}”</span><span>${esc(h.section.points[0])}</span></button>`).join('')
          : '<p class="muted small">コースで扱う目立った文法の形は見つかりませんでした。</p>';
        gram.querySelectorAll('[data-sec]').forEach((b) => (b.onclick = () => host.openGrammar?.(b.dataset.sec)));
      })
      .catch(() => (gram.innerHTML = '<p class="muted small">文法データを読み込めませんでした（オフライン？）</p>'));
    // The translation is shown only on request (it uses the free translation quota).
    el.querySelector('[data-a=show-ja]').onclick = async (ev) => {
      ev.currentTarget.remove();
      ja.hidden = false;
      ja.textContent = '翻訳中…';
      try {
        const t = await translate(text, { email: host.settings.mmEmail });
        if (ja.isConnected) ja.textContent = t;
      } catch (err) {
        if (ja.isConnected) {
          ja.textContent = err instanceof QuotaError
            ? '今日の無料翻訳の上限に達しました（設定でメールアドレスを登録すると上限が増えます）'
            : '翻訳できませんでした（オフライン？）';
          ja.classList.add('muted');
        }
      }
    };
  }

  /** After a miss: say it aloud 3 times (word, then the example sentence). */
  function renderDrill(e) {
    const count = drill - 1;
    el.innerHTML = `${header(`学習 · 残り <b>${queue.length - idx}</b>`)}
      <div class="rv-card drill">
        <div class="rv-label">声に出して${READ_ALOUD_TIMES}回読みましょう</div>
        <div class="rv-word">${esc(e.word)} ${speakBtn}</div>
        ${e.pron ? `<div class="rv-pron">/${esc(e.pron)}/</div>` : ''}
        <div class="rv-answer"><ol>${senses(e.meaning, 2).map((s) => `<li>${fmtSense(s)}</li>`).join('')}</ol></div>
        ${e.ctx ? `<p class="rv-ctx">${contextHtml(e)}</p>${ctxBtn}` : ''}
        <p class="muted small">意味をイメージしながら読むと定着しやすくなります。</p>
      </div>
      <div class="rv-actions">
        <button class="btn primary wide tr-count-btn" data-a="count">読んだ <b>${count}</b> / ${READ_ALOUD_TIMES}回</button>
        <button class="link-btn center" data-a="skip">スキップ</button>
      </div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelector('[data-a=speak]').onclick = () => say(e.word, host.settings);
    el.querySelector('[data-a=say-ctx]')?.addEventListener('click', () => say(e.ctx.join(' '), host.settings));
    el.querySelector('[data-a=count]').onclick = () => {
      drill++;
      if (drill - 1 >= READ_ALOUD_TIMES) nextCard();
      else render();
    };
    el.querySelector('[data-a=skip]').onclick = nextCard;
  }

  function reveal() {
    revealed = true;
    render();
    if (host.settings.autoSpeakWord) say(card().word, host.settings);
  }

  async function answer(g) {
    const e = card();
    // A new word answered "簡単" at first sight was already known: see it again in a month, and
    // bring in another new word in its place.
    if (await vocab.noteDeckAnswer(e, g)) {
      await vocab.gradeKnown(e);
      host.addReviews(1);
      reviewed++;
      knownCount++;
      // Knowing most new words means the level is too easy: move up right away, so the
      // replacement word already comes from the next level.
      const change = await vocab.evaluateLevel();
      if (change) {
        levelChange = change;
        toast(`レベルが Lv${change.from} → Lv${change.to} に上がりました`);
        // Unseen new words from the old, too-easy level make way for words of the new level.
        const stale = queue.slice(idx + 1).filter((x) => vocab.isFirstSight(x) && x.band && x.band < change.to);
        if (stale.length) {
          await vocab.withdrawNew(stale);
          for (const x of stale) queue.splice(queue.indexOf(x), 1);
        }
      }
      try {
        queue.push(...(await vocab.introduceNew()));
      } catch {
        /* offline: carry on with the current queue */
      }
      return nextCard();
    }
    await vocab.grade(e, g);
    host.addReviews(1);
    reviewed++;
    shown.set(e.word, (shown.get(e.word) || 0) + 1);
    // "もう一度" comes back later in this session (at most 3 times).
    if (g === 0 && shown.get(e.word) < 3) queue.push(e);
    if (g === 0 && host.settings.readAloudOnMiss) {
      drill = 1;
      render();
      say(e.word, host.settings);
      return;
    }
    nextCard();
  }

  async function nextCard() {
    drill = 0;
    idx++;
    revealed = false;
    if (!card()) levelChange = (await vocab.evaluateLevel()) || levelChange;
    render();
  }

  function onKey(ev) {
    if (el.hidden || drill) return;
    if (!revealed && (ev.key === ' ' || ev.key === 'Enter') && card()) reveal();
    else if (revealed && ['1', '2', '3', '4'].includes(ev.key)) answer(Number(ev.key) - 1);
    else return;
    ev.preventDefault();
  }

  document.addEventListener('keydown', onKey);
  el.hidden = false;
  document.body.classList.add('reading');
  pushLayer(close);
  render();
}

// ---------- placement test (レベル診断): 6 words per level, from Lv1 up, until two levels in a row are mostly unknown
const PLACEMENT_PER_LEVEL = 6;

async function startPlacement(host) {
  const el = overlay();
  let index;
  try {
    index = await vocab.loadBandIndex();
  } catch {
    return toast('単語データを読み込めませんでした（オフライン？）');
  }
  const results = []; // {band, right, wrong, unknown}
  let band = 1;
  let items = [];
  let k = 0;
  let lowStreak = 0;

  const close = () => {
    el.hidden = true;
    document.body.classList.remove('reading');
    host.rerender();
  };

  async function loadLevel() {
    const data = await vocab.loadBand(band);
    const pick = shuffle([...data.words]).slice(0, PLACEMENT_PER_LEVEL);
    const others = data.words.map((r) => shortSense(r[1])).filter(Boolean);
    items = pick.map((row) => {
      const right = shortSense(row[1]);
      const wrong = new Set();
      for (const s of shuffle([...others])) {
        if (wrong.size >= 3) break;
        if (s !== right) wrong.add(s);
      }
      return { word: row[0], pron: row[2], opts: shuffle([{ s: right, ok: true }, ...[...wrong].map((s) => ({ s, ok: false }))]) };
    });
    results.push({ band, right: 0, wrong: 0, unknown: 0 });
    k = 0;
  }

  function intro() {
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button><span>レベル診断</span><span class="rv-spacer"></span></header>
      <div class="rv-card"><h2>語彙レベル診断</h2>
        <p>やさしいレベルから順に、各レベル${PLACEMENT_PER_LEVEL}語ずつ意味を4択で答えます。知らない単語は迷わず<b>「わからない」</b>を選んでください（当てずっぽうで正解すると、難しすぎるレベルから始まってしまいます）。</p>
        <p class="muted small">2つのレベル続けてほとんど分からなければ終了します。所要 約3〜5分。</p></div>
      <div class="rv-actions"><button class="btn primary wide" data-a="go">始める</button></div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelector('[data-a=go]').onclick = async () => {
      await loadLevel();
      render();
    };
  }

  function render() {
    const it = items[k];
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button>
        <span>レベル診断 · Lv${band} · ${k + 1}/${PLACEMENT_PER_LEVEL}</span><span class="rv-spacer"></span></header>
      <div class="rv-card test">
        <div class="rv-label">意味を選んでください</div>
        <div class="rv-word">${esc(it.word)} <button class="icon-btn speak" data-a="speak" aria-label="発音を聞く">${icons.speaker}</button></div>
        ${it.pron ? `<div class="rv-pron">/${esc(it.pron)}/</div>` : ''}
        <div class="choices">${it.opts.map((o, i) => `<button class="choice" data-o="${i}">${esc(o.s)}</button>`).join('')}
          <button class="choice dunno" data-o="-1">わからない</button></div>
      </div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelector('[data-a=speak]').onclick = () => say(it.word, host.settings);
    el.querySelectorAll('[data-o]').forEach((b) =>
      b.addEventListener('click', async () => {
        const r = results[results.length - 1];
        const o = Number(b.dataset.o);
        if (o < 0) r.unknown++;
        else if (it.opts[o].ok) r.right++;
        else r.wrong++;
        k++;
        if (k < items.length) return render();
        // Level finished: correct for guessing (4 choices), then decide whether to go on.
        r.rate = Math.max(0, (r.right - r.wrong / 3) / PLACEMENT_PER_LEVEL);
        lowStreak = r.rate < 0.5 ? lowStreak + 1 : 0;
        if (band < 9 && lowStreak < 2) {
          band++;
          await loadLevel();
          return render();
        }
        finish();
      }),
    );
  }

  function finish() {
    const rateOf = (b) => results.find((r) => r.band === b)?.rate ?? 0;
    const estimate = Math.round(index.bands.reduce((a, b) => a + rateOf(b.band) * b.size, 0) / 10) * 10;
    const start = (results.find((r) => r.rate < 0.7) || results[results.length - 1]).band;
    const rows = results
      .map((r) => `<div class="pl-row"><span>Lv${r.band}</span><div class="bar"><i style="width:${Math.round(r.rate * 100)}%"></i></div><b>${Math.round(r.rate * 100)}%</b></div>`)
      .join('');
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button><span>診断結果</span><span class="rv-spacer"></span></header>
      <div class="rv-card">
        <div class="tr-stat"><small>推定語彙数</small><b>約${estimate.toLocaleString()}</b><small>語</small></div>
        <p>おすすめの開始レベルは <b>Lv${start}</b>（頻度${index.bands[start - 1].from.toLocaleString()}〜${index.bands[start - 1].to.toLocaleString()}位）です。</p>
        <div class="pl-rows">${rows}</div>
        <p class="muted small">各レベルの「知っている割合」（当てずっぽうの分を差し引いた推定）。7割未満の最初のレベルから学びます。</p>
      </div>
      <div class="rv-actions"><button class="btn primary wide" data-a="start">Lv${start}から始める</button></div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelector('[data-a=start]').onclick = async () => {
      await vocab.saveMeta({ deck: vocab.ADAPTIVE, placement: { t: Date.now(), estimate, rates: results.map((r) => [r.band, Math.round(r.rate * 100)]) } });
      await vocab.setLevel(start, `レベル診断で推定語彙数 約${estimate.toLocaleString()}語`);
      popLayer();
    };
  }

  el.hidden = false;
  document.body.classList.add('reading');
  pushLayer(close);
  intro();
}

// ---------- check test: English word -> choose the meaning (4 options)
export async function startTest(host) {
  const pool = vocab.cachedAll().filter(studied);
  if (pool.length < TEST_MIN) return;
  const questions = shuffle([...pool]).slice(0, TEST_SIZE);
  // Wrong options come from the word book and, when available, the word deck.
  let distractors = vocab.cachedAll().map((e) => ({ word: e.word, sense: shortSense(e.meaning) }));
  try {
    const d = await vocab.loadDecks();
    distractors = distractors.concat(Object.entries(d.words).map(([w, x]) => ({ word: w, sense: shortSense(x.m) })));
  } catch {
    /* offline: the word book alone gives enough options */
  }
  distractors = distractors.filter((x) => x.sense);
  const optionsFor = (e) => {
    const right = shortSense(e.meaning);
    const wrong = new Set();
    for (const x of shuffle([...distractors])) {
      if (wrong.size >= 3) break;
      if (x.word !== e.word && x.sense !== right) wrong.add(x.sense);
    }
    return shuffle([{ s: right, ok: true }, ...[...wrong].map((s) => ({ s, ok: false }))]);
  };

  const el = overlay();
  let k = 0;
  let correct = 0;
  const missed = [];
  let answered = false;

  const close = () => {
    el.hidden = true;
    document.body.classList.remove('reading');
    host.rerender();
  };

  function render() {
    const e = questions[k];
    if (!e) return finish();
    const opts = optionsFor(e);
    answered = false;
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button>
        <span>確認テスト · <b>${k + 1}</b> / ${questions.length}</span><span class="rv-spacer"></span></header>
      <div class="rv-card test">
        <div class="rv-label">意味を選んでください</div>
        <div class="rv-word">${esc(e.word)} <button class="icon-btn speak" data-a="speak" aria-label="発音を聞く">${icons.speaker}</button></div>
        ${e.pron ? `<div class="rv-pron">/${esc(e.pron)}/</div>` : ''}
        <div class="choices">${opts.map((o, i) => `<button class="choice" data-o="${i}">${esc(o.s)}</button>`).join('')}</div>
      </div>
      <div class="rv-actions"><button class="btn primary wide" data-a="next" hidden>次へ</button></div>`;
    el.querySelector('[data-a=back]').onclick = () => popLayer();
    el.querySelector('[data-a=speak]').onclick = () => say(e.word, host.settings);
    el.querySelectorAll('[data-o]').forEach((b) =>
      b.addEventListener('click', async () => {
        if (answered) return;
        answered = true;
        const o = opts[Number(b.dataset.o)];
        el.querySelectorAll('[data-o]').forEach((x) => {
          const oo = opts[Number(x.dataset.o)];
          if (oo.ok) x.classList.add('right');
        });
        if (o.ok) {
          correct++;
          b.insertAdjacentHTML('afterbegin', '✓ ');
          setTimeout(() => {
            k++;
            render();
          }, 650);
        } else {
          b.classList.add('wrong');
          b.insertAdjacentHTML('afterbegin', '✗ ');
          missed.push(e);
          await vocab.markDue(e.word); // back into today's review
          el.querySelector('[data-a=next]').hidden = false;
        }
      }),
    );
    el.querySelector('[data-a=next]').onclick = () => {
      k++;
      render();
    };
  }

  async function finish() {
    const pct = Math.round((correct / questions.length) * 100);
    await vocab.recordTest({ n: questions.length, correct });
    const ok = pct >= TEST_GOAL;
    el.innerHTML = `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button><span></span></header>
      <div class="rv-done">
        <div class="tr-stat"><small>正答率</small><b>${pct}%</b><small>${correct} / ${questions.length}問</small></div>
        <div class="goal-badge ${ok ? 'ok' : ''}">${ok ? '✓ 目標9割を達成' : `目標9割まであと${Math.ceil(questions.length * 0.9) - correct}問`}</div>
        ${missed.length ? `<div class="missed"><p class="small">間違えた単語（今日の復習に戻しました）</p>
          <ul>${missed.map((e) => `<li><b>${esc(e.word)}</b> ${esc(shortSense(e.meaning))}</li>`).join('')}</ul></div>` : '<p>全問正解です！</p>'}
        <button class="btn primary wide" data-a="back">単語帳へ戻る</button></div>`;
    el.querySelectorAll('[data-a=back]').forEach((b) => (b.onclick = () => popLayer()));
  }

  el.hidden = false;
  document.body.classList.add('reading');
  pushLayer(close);
  render();
}
