// App shell: tabs (today / books: shelf+discover / practice / vocab / stats / settings), shelf management, persistence.
import * as db from './db.js';
import { prepare } from './text.js';
import * as gb from './gutenberg.js';
import * as st from './stats.js';
import { Reader } from './reader.js';
import { englishVoices, speak, NO_VOICE_HELP } from './speech.js';
import * as vocab from './vocab.js';
import * as coach from './coach.js';
import * as goals from './goals.js';
import * as grammar from './grammar.js';
import { viewVocab, bindVocab, startReview, startTest } from './vocabView.js';
import { viewToday, bindToday, remaining, DEFAULT_DAILY } from './daily.js';
import { viewPractice, bindPractice, startPractice } from './practice.js';
import { $, esc, fmt, fmtDuration, icons, toast, openSheet, closeSheet, confirmSheet, initSheet } from './ui.js';

const DEFAULT_SETTINGS = {
  wpm: 250, chunk: 1, pause: 1, rewind: true, orp: true, fontSize: 2, font: 'sans',
  theme: 'system', goal: 3000, dictMode: 'ja', proxy: '', showJa: false, mmEmail: '', voice: '', autoSaveWords: true,
  listen: false, comprehensionCheck: true,
  goalWpm: goals.DEFAULT_GOAL.wpm, goalComp: goals.DEFAULT_GOAL.comp, readAloudGoal: 5,
  wordGoal: 50, readAloudOnMiss: true, autoSpeakWord: true, hideText: false,
  daily: structuredClone(DEFAULT_DAILY),
};
const LEVELS = {
  0: { name: 'はじめて', desc: '学習者向けの短い英語絵本' },
  1: { name: '絵本', desc: 'とてもやさしい' },
  2: { name: 'やさしい', desc: '児童書' },
  3: { name: 'ふつう', desc: '児童文学' },
  4: { name: 'やや難', desc: '一般小説' },
  5: { name: '難しめ', desc: '古典' },
};

const S = {
  settings: { ...DEFAULT_SETTINGS },
  shelf: [],
  stats: st.emptyStats(),
  library: [],
  tab: 'today',
  libSub: 'shelf', // 本 tab: 'shelf' (本棚) or 'discover' (探す)
  levelFilter: 'all',
  query: '',
  results: null,
};

let reader;

// ---------- persistence
const saveShelf = () => db.set('shelf', S.shelf);
const saveStats = () => db.set('stats', S.stats);

function saveSettings(partial) {
  Object.assign(S.settings, partial);
  db.set('settings', S.settings);
  applyTheme();
}

function applyTheme() {
  const t = S.settings.theme;
  if (t === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  $('meta[name=theme-color]').content = dark ? '#161513' : '#f7f4ee';
}

// ---------- shelf helpers
const shelfEntry = (id) => S.shelf.find((b) => b.id === id);
const curatedFor = (gid) => S.library.find((b) => b.gid === gid);
const curatedById = (id) => S.library.find((b) => b.id === id);
const minutes = (words) => fmtDuration((words / S.settings.wpm) * 60000);

function addToShelf(meta) {
  let e = shelfEntry(meta.id);
  if (!e) {
    e = { pos: 0, tokens: 0, finished: false, addedAt: Date.now(), lastReadAt: Date.now(), ...meta };
    S.shelf.push(e);
    saveShelf();
  }
  return e;
}

async function getText(entry) {
  if (entry.source === 'bundled') {
    const r = await fetch(`data/${entry.file || `books/${entry.gid}.txt`}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.text();
  }
  const t = await db.get(`text:${entry.id}`);
  if (!t) throw new Error('本文が見つかりません');
  return t;
}

async function openBook(entry) {
  const loading = $('#loading');
  loading.hidden = false;
  try {
    const doc = prepare(await getText(entry));
    if (!doc.words.length) throw new Error('本文が空です');
    entry.tokens = doc.words.length;
    entry.words = doc.wordCount;
    entry.lastReadAt = Date.now();
    saveShelf();
    reader.open(entry, doc);
  } catch (e) {
    toast(`開けませんでした: ${e.message}`);
  } finally {
    loading.hidden = true;
  }
}

// ---------- rendering
function render() {
  document.querySelectorAll('.tabbar button').forEach((b) => b.classList.toggle('on', b.dataset.tab === S.tab));
  const view = $('#view');
  const books = () =>
    `<div class="seg lib-switch">${[['shelf', '本棚'], ['discover', '探す']].map(([k, l]) => `<button data-lib="${k}" class="${S.libSub === k ? 'on' : ''}">${l}</button>`).join('')}</div>${S.libSub === 'discover' ? viewDiscover() : viewLibrary()}`;
  view.innerHTML = { today: () => viewToday(todayHost), library: books, practice: () => viewPractice(practiceHost), vocab: () => viewVocab(vocabHost), stats: viewStats, settings: viewSettings }[S.tab]();
  view.scrollTop = 0;
  bindView(view);
  if (S.tab === 'vocab') bindVocab(view, vocabHost);
  if (S.tab === 'today') bindToday(view, todayHost);
  if (S.tab === 'practice') bindPractice(view, practiceHost);
  updateBadge();
}

/** Number of words due for review, shown on the 単語 tab. */
function updateBadge() {
  const due = vocab.cachedAll().filter((e) => e.due <= Date.now()).length + vocab.newLeftToday();
  const badge = $('.tabbar [data-tab=vocab] .badge');
  if (badge) {
    badge.textContent = due > 99 ? '99+' : due;
    badge.hidden = !due;
  }
  const left = remaining(todayHost);
  const todayBadge = $('.tabbar [data-tab=today] .badge');
  if (todayBadge) {
    todayBadge.textContent = left;
    todayBadge.hidden = !left;
  }
}

/** The book to continue: most recently read, not finished. */
const currentBook = () => S.shelf.filter((b) => !b.finished).sort((a, b) => b.lastReadAt - a.lastReadAt)[0];

const todayHost = {
  get settings() {
    return S.settings;
  },
  get stats() {
    return S.stats;
  },
  saveStats: () => saveStats(),
  saveSettings: (p) => saveSettings(p),
  rerender: () => render(),
  /** The button on each checklist item. */
  async startTask(id) {
    const book = currentBook();
    const needBook = () => {
      toast('まず「探す」から読む本を選びましょう');
      switchTab('discover');
    };
    if (id === 'words') {
      if (!vocab.cachedAll().some((e) => e.due <= Date.now()) && !vocab.newLeftToday()) {
        toast('今日の復習はありません。単語デッキを選ぶと新しい単語を学べます');
        return switchTab('vocab');
      }
      return startReview(vocabHost);
    }
    if (id === 'test') return startTest(vocabHost);
    if (['shadowing', 'repeating', 'composition', 'speech', 'grammar'].includes(id)) return startPractice(id, practiceHost);
    if (!book) return needBook();
    if (id === 'listen') {
      saveSettings({ listen: true, hideText: true });
      toast('多聴モード（文字なし）で開きます。▶で聞き始めましょう', 3500);
    } else if (id === 'read' && S.settings.hideText) {
      saveSettings({ hideText: false }); // reading means seeing the text
    }
    await openBook(book);
    if (id === 'training' && reader.player) reader.openTraining();
  },
};

const practiceHost = {
  get settings() {
    return S.settings;
  },
  get stats() {
    return S.stats;
  },
  get library() {
    return S.library;
  },
  saveSettings: (p) => saveSettings(p),
  rerender: () => render(),
  currentBook: () => currentBook(),
  /** Text of a bundled book (library entry) or of a shelf entry. */
  async loadText(b) {
    if (b.file && !b.source?.match(/^(bundled|download|file)$/)) {
      const r = await fetch(`data/${b.file}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    }
    return getText(b);
  },
  async openTraining() {
    const book = currentBook();
    if (!book) {
      toast('まず「探す」から読む本を選びましょう');
      return switchTab('discover');
    }
    await openBook(book);
    if (reader.player) reader.openTraining();
  },
  recordPractice(rec) {
    const list = (S.stats.practice ||= []);
    list.push({ ...rec, t: Date.now() });
    if (list.length > 1000) list.splice(0, list.length - 1000);
    saveStats();
    render();
  },
};

const vocabHost = {
  get settings() {
    return S.settings;
  },
  addReviews(n) {
    st.addReviews(S.stats, n);
    saveStats();
  },
  todayReviews: () => S.stats.days[st.dayKey()]?.r || 0,
  rerender: () => render(),
};

function ring(ratio, size = 44) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const v = Math.min(1, ratio);
  const fg = v > 0 ? `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c * v} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/>` : '';
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/>
    ${fg}
  </svg>`;
}

function levelBadge(level) {
  return level != null ? `<span class="lv lv${level}">Lv${level} ${LEVELS[level].name}</span>` : '';
}

function bookCard(e) {
  const pct = e.tokens ? Math.min(100, Math.floor((e.pos / Math.max(1, e.tokens - 1)) * 100)) : 0;
  const left = e.words ? Math.round(e.words * (1 - pct / 100)) : 0;
  return `<div class="card book" data-open="${esc(e.id)}">
    <div class="book-main">
      <div class="book-title">${esc(e.title)}</div>
      <div class="book-sub">${e.ja ? `${esc(e.ja)} · ` : ''}${esc(e.author || '')}</div>
      <div class="bar"><i style="width:${e.finished ? 100 : pct}%"></i></div>
      <div class="book-meta">${e.finished ? '読了' : `${pct}%`} · ${fmt(e.words)}語${e.finished ? '' : ` · 残り約${minutes(left)}`}</div>
    </div>
    <button class="icon-btn" data-more="${esc(e.id)}" aria-label="メニュー">${icons.more}</button>
  </div>`;
}

function viewLibrary() {
  const sum = st.summary(S.stats, S.settings.goal);
  const reading = S.shelf.filter((b) => !b.finished).sort((a, b) => b.lastReadAt - a.lastReadAt);
  const done = S.shelf.filter((b) => b.finished).sort((a, b) => b.lastReadAt - a.lastReadAt);
  const header = `<header class="top">
      <div><h1>本棚</h1><p class="muted">累計 <b>${fmt(sum.words)}</b> 語</p></div>
      <div class="today">${ring(sum.today.w / S.settings.goal)}<div><small>今日</small><b>${fmt(sum.today.w)}</b><small>/ ${fmt(S.settings.goal)}語</small></div></div>
    </header>`;
  if (!S.shelf.length) {
    return `${header}<div class="empty">
      <div class="empty-icon">${icons.book}</div>
      <h2>本棚はまだ空です</h2>
      <p>「探す」から、やさしい本を選んで読み始めましょう。<br>多読は <b>やさしい本をたくさん</b> がコツです。<br>英語の本に慣れていなければ「Lv0 はじめて」の絵本から。</p>
      <button class="btn primary" data-tab-go="discover">${icons.search}本を探す</button></div>`;
  }
  return `${header}
    ${reading.length ? `<h2 class="section">読書中</h2>${reading.map(bookCard).join('')}` : ''}
    ${done.length ? `<h2 class="section">読了した本</h2>${done.map(bookCard).join('')}` : ''}`;
}

const SOURCE_LABEL = { gutenberg: 'Gutenberg', storybooks: 'Storybooks', voa: 'VOA' };

function curatedCard(b) {
  const e = shelfEntry(b.id);
  const state = e ? (e.finished ? '<span class="tag done">読了</span>' : '<span class="tag">本棚</span>') : '';
  return `<button class="card pick" data-pick="${b.id}">
    <div class="book-title">${esc(b.ja)} ${state}</div>
    <div class="book-sub">${esc(b.title)} · ${esc(b.author)}</div>
    <div class="book-meta">${levelBadge(b.level)} ${fmt(b.words)}語 · 約${minutes(b.words)} <span class="src">${SOURCE_LABEL[b.source] || ''}</span></div>
  </button>`;
}

function viewDiscover() {
  const chips = ['all', 0, 1, 2, 3, 4, 5]
    .map((l) => `<button class="chip${S.levelFilter === l ? ' on' : ''}" data-level="${l}">${l === 'all' ? 'すべて' : `Lv${l} ${LEVELS[l].name}`}</button>`)
    .join('');
  const list = S.library.filter((b) => S.levelFilter === 'all' || b.level === S.levelFilter);
  const curated = S.library.length
    ? list.map(curatedCard).join('')
    : '<p class="muted pad">おすすめ一覧を読み込めませんでした（オフライン？）</p>';
  return `<header class="top"><div><h1>本を探す</h1><p class="muted">学習者向け絵本・VOA・Gutenbergの名作</p></div></header>
    <form class="search" id="search-form" autocomplete="off">
      ${icons.search}<input id="q" type="search" enterkeyhint="search" placeholder="6万冊から検索（タイトル・著者名）" value="${esc(S.query)}">
    </form>
    <div id="results">${S.results !== null ? resultsHtml() : ''}</div>
    <div id="curated" ${S.results !== null ? 'hidden' : ''}>
      <h2 class="section">多読向けおすすめ <small>やさしい順</small></h2>
      <div class="chips">${chips}</div>
      ${curated}
      <div class="import-box">
        <p class="muted">手元の英文テキスト（.txt）も読み込めます。Gutenbergからのダウンロードがうまくいかないときにも使えます。</p>
        <button class="btn ghost" data-import>${icons.file}テキストファイルを読み込む</button>
      </div>
    </div>`;
}

function resultsHtml() {
  if (S.results === 'loading') return '<p class="muted pad">検索カタログを読み込み中…（初回のみ数秒かかります）</p>';
  if (S.results === 'error') return '<p class="muted pad">検索カタログを読み込めませんでした。通信状態を確認してください。</p>';
  if (!S.results.length) return '<p class="muted pad">見つかりませんでした。英語のタイトルや著者名で検索してください。</p>';
  return `<h2 class="section">検索結果 <small>${S.results.length >= 60 ? '上位60件' : `${S.results.length}件`}</small></h2>
    ${S.results
      .map((b) => {
        const cur = curatedFor(b.id);
        return `<button class="card pick" data-result="${b.id}">
        <div class="book-title">${esc(b.title)}</div>
        <div class="book-sub">${esc(b.author || '著者不明')}</div>
        <div class="book-meta">${cur ? `${levelBadge(cur.level)} おすすめ収録 · ` : ''}${b.kids ? '<span class="tag">児童書</span> ' : ''}#${b.id}</div>
      </button>`;
      })
      .join('')}`;
}

function viewStats() {
  const s = st.summary(S.stats, S.settings.goal);
  const max = Math.max(S.settings.goal, ...s.recent.map((d) => d.w), 1);
  const dows = '日月火水木金土';
  const bars = s.recent
    .map((d) => `<div class="col${d.key === st.dayKey() ? ' today' : ''}">
      <div class="colbar"><i style="height:${(d.w / max) * 100}%" title="${fmt(d.w)}語"></i></div>
      <div class="lbl"><small>${d.day}</small><small class="dow">${dows[d.dow]}</small></div></div>`)
    .join('');
  const goalLine = `<div class="goal-line" style="bottom:calc(28px + (100% - 28px) * ${S.settings.goal / max})"><span>目標</span></div>`;
  const cs = coach.recentSummary(S.stats);
  const finished = s.finished
    .slice()
    .reverse()
    .map((f) => `<li><span>${esc(f.title)}</span><small>${fmt(f.words)}語 · ${f.date}</small></li>`)
    .join('');
  return `<header class="top"><div><h1>読書記録</h1><p class="muted">多読は累計語数が目安です</p></div></header>
    <div class="card hero">
      <small>累計語数</small>
      <div class="big">${fmt(s.words)}<span>語</span></div>
      <div class="bar"><i style="width:${s.milestone.ratio * 100}%"></i></div>
      <small class="muted">次の目標 ${fmt(s.milestone.next)}語まで あと ${fmt(Math.max(0, s.milestone.next - s.words))}語</small>
    </div>
    ${goalSection()}
    ${listenSection(s)}
    ${practiceSection()}
    <div class="tiles">
      <div class="card tile">${ring(s.today.w / s.goal, 40)}<div><small>今日</small><b>${fmt(s.today.w)}</b><small>/ ${fmt(s.goal)}語</small></div></div>
      <div class="card tile"><div><small>連続</small><b>${s.streak}</b><small>日</small></div></div>
      <div class="card tile"><div><small>平均速度</small><b>${s.wpm || '—'}</b><small>WPM</small></div></div>
      <div class="card tile"><div><small>読書時間</small><b>${fmtDuration(s.ms)}</b><small>読了 ${s.finished.length}冊</small></div></div>
      <div class="card tile"><div><small>単語帳</small><b>${fmt(vocab.cachedAll().length)}</b><small>語</small></div></div>
      <div class="card tile"><div><small>今日の復習</small><b>${fmt(s.today.r || 0)}</b><small>回（累計 ${fmt(s.reviews)}回）</small></div></div>
    </div>
    <h2 class="section">この2週間</h2>
    <div class="card chart"><div class="cols">${goalLine}${bars}</div></div>
    <h2 class="section">理解度チェック <small>直近${cs.total}回</small></h2>
    ${cs.total ? `<div class="card comp">${coach.RATINGS.map((x) => `<div class="comp-row"><span>${x.emoji} ${x.label}</span>
      <div class="bar"><i class="r${x.r}" style="width:${(cs.counts[x.r] / cs.total) * 100}%"></i></div><b>${cs.counts[x.r]}</b></div>`).join('')}</div>`
      : '<p class="muted pad">読書中、章の区切りで理解度を聞きます。答えに合わせて速さやレベルを提案します。</p>'}
    <h2 class="section">読了した本</h2>
    ${finished ? `<ul class="card finished">${finished}</ul>` : '<p class="muted pad">最後まで読んだ本がここに並びます。</p>'}`;
}

/** This week's speaking / listening / writing practice. */
function practiceSection() {
  const since = Date.now() - 7 * 86400000;
  const list = (S.stats.practice || []).filter((p) => p.t >= since);
  if (!list.length) return '';
  const avg = (xs) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
  const rows = [
    ['🎧 シャドーイング', 'shadowing', (xs) => `${xs.length}回${avg(xs.map((x) => x.score).filter((x) => x != null)) != null ? ` · 平均一致率 ${avg(xs.map((x) => x.score).filter((x) => x != null))}%` : ''}`],
    ['🔁 リピーティング', 'repeating', (xs) => `${xs.length}回${avg(xs.map((x) => x.score).filter((x) => x != null)) != null ? ` · 平均一致率 ${avg(xs.map((x) => x.score).filter((x) => x != null))}%` : ''}`],
    ['📘 英文法', 'grammar', (xs) => `${xs.filter((x) => x.kind === 'section').length}節 · 復習 ${xs.filter((x) => x.kind === 'review').length}回${xs.some((x) => x.kind === 'test') ? ` · 章末テスト ${xs.filter((x) => x.kind === 'test').map((x) => `${x.score}%`).join('・')}` : ''}`],
    ['✍️ 瞬間英作文', 'composition', (xs) => `${xs.reduce((a, x) => a + x.n, 0)}問 · 正解 ${xs.reduce((a, x) => a + x.correct, 0)}問`],
    ['🗣 1分間スピーチ', 'speech', (xs) => `${xs.length}回 · 平均 ${avg(xs.map((x) => x.score))}/5点`],
  ]
    .map(([label, type, fmtRow]) => {
      const xs = list.filter((p) => p.type === type);
      return xs.length ? `<li><span>${label}</span><small>${fmtRow(xs)}</small></li>` : '';
    })
    .join('');
  return `<h2 class="section">今週の練習</h2><ul class="card finished">${rows}</ul>`;
}

/** 多聴: words / time listened with the text hidden, and comprehension against the 80% target. */
function listenSection(s) {
  const ls = coach.listenSummary(S.stats);
  if (!s.listenWords && !ls.total) return '';
  return `<h2 class="section">多聴 <small>文字を見ずに聞く・目標 理解度${coach.LISTEN_GOAL}%</small></h2>
    <div class="card listen-card">
      <div><small>累計</small><b>${fmt(s.listenWords)}</b><small>語 · ${fmtDuration(s.listenMs)}</small></div>
      <div><small>理解度（直近${ls.total}回）</small><b>${ls.total ? `${ls.avg}%` : '—'}</b><small>${ls.total ? `80%以上 ${ls.hits}回` : 'チェック待ち'}</small></div>
    </div>`;
}

const GOAL_CHART = { w: 320, h: 150, l: 34, r: 48, t: 12, b: 20 };

/** 目標 (e.g. 150 WPM・理解度80%) status, trend of first-read speed, and the training log. */
function goalSection() {
  const goal = { wpm: S.settings.goalWpm, comp: S.settings.goalComp };
  const sum = goals.trainingSummary(S.stats, goal);
  const rsvp = goals.rsvpSummary(S.stats, goal);
  const head = `<h2 class="section">目標 <small>黙読 ${goal.wpm} WPM・理解度${goal.comp}%</small></h2>`;
  if (!sum.count) {
    return `${head}<div class="card goal-empty"><p>読書中に一時停止して「📝 1文章トレーニング」を選ぶと、黙読の速さと理解度を測って記録します。</p>
      <p class="muted small">目標は「1回目の黙読で ${goal.wpm} WPM・理解度${goal.comp}%」。設定で変更できます。</p>
      ${rsvp.total ? `<p class="muted small">RSVP読書: ${goal.wpm} WPM以上で「よく分かった」${rsvp.good} / ${rsvp.total}回</p>` : ''}</div>`;
  }
  const last = sum.latest;
  const ok = goals.achieved(last, goal);
  const rows = sum.list
    .slice(-10)
    .reverse()
    .map((t) => `<tr><td>${new Date(t.t).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}</td><td class="t-title">${esc(t.title)}</td>
      <td class="num">${t.wpm1}→${t.wpm2}</td><td class="num">${t.comp}%</td><td>${goals.achieved(t, goal) ? '✓' : ''}</td></tr>`)
    .join('');
  return `${head}
    <div class="card goal-card">
      <div class="goal-status">
        <div class="goal-badge ${ok ? 'ok' : ''}">${ok ? '✓ 前回は目標達成' : '前回は目標まであと少し'}
          <span>1回目の黙読 ${last.wpm1} WPM・理解度${last.comp}%</span></div>
        <div class="goal-nums"><div><small>直近5回の平均</small><b>${sum.avgWpm1}</b><small>WPM → 練習後 ${sum.avgWpm2}</small></div>
          <div><small>達成</small><b>${sum.hits}</b><small>/ ${sum.count}回（連続${sum.streak}回）</small></div></div>
      </div>
      ${goalChart(sum.list.slice(-20), goal)}
      ${sum.raiseTo ? `<div class="notice goal-raise">3回続けて目標を達成しました。目標を <b>${sum.raiseTo} WPM</b> に上げてみませんか？
        <button class="btn primary" data-raise="${sum.raiseTo}">目標を${sum.raiseTo} WPMにする</button></div>` : ''}
      ${rsvp.total ? `<p class="muted small">RSVP読書: ${goal.wpm} WPM以上で読んだときの「よく分かった」${rsvp.good} / ${rsvp.total}回</p>` : ''}
      <details class="goal-table"><summary>記録の一覧（直近10回）</summary>
        <table><thead><tr><th>日付</th><th>文章</th><th class="num">WPM</th><th class="num">理解</th><th>達成</th></tr></thead><tbody>${rows}</tbody></table></details>
    </div>`;
}

/** First-read WPM per training as a line with the goal as a dashed rule; filled dot = comprehension met. */
function goalChart(list, goal) {
  const { w, h, l, r, t, b } = GOAL_CHART;
  const top = Math.ceil(Math.max(goal.wpm * 1.3, ...list.map((x) => x.wpm1)) / 50) * 50;
  const x = (k) => (list.length === 1 ? (l + w - r) / 2 : l + (k * (w - l - r)) / (list.length - 1));
  const y = (v) => t + (1 - v / top) * (h - t - b);
  const grid = [0, top / 2, top]
    .map((v) => `<line class="gc-grid" x1="${l}" x2="${w - r}" y1="${y(v)}" y2="${y(v)}"/><text class="gc-axis" x="${l - 6}" y="${y(v) + 3.5}" text-anchor="end">${v}</text>`)
    .join('');
  const path = list.map((p, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)},${y(p.wpm1).toFixed(1)}`).join('');
  const dots = list
    .map((p, k) => `<circle class="gc-dot ${p.comp >= goal.comp ? 'met' : ''}" cx="${x(k)}" cy="${y(p.wpm1)}" r="4.5"/>
      <circle class="gc-hit" data-k="${k}" data-x="${((x(k) / w) * 100).toFixed(1)}" cx="${x(k)}" cy="${y(p.wpm1)}" r="14"><title>${p.wpm1} WPM・理解度${p.comp}%</title></circle>`)
    .join('');
  const data = esc(JSON.stringify(list.map((p) => [new Date(p.t).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }), p.title, p.wpm1, p.wpm2, p.comp])));
  return `<figure class="goal-chart" data-points="${data}">
    <figcaption>1回目の黙読の速さ（WPM）</figcaption>
    <div class="gc-tip" hidden></div>
    <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="1回目の黙読の速さの推移">
      ${grid}
      <line class="gc-goal" x1="${l}" x2="${w - r}" y1="${y(goal.wpm)}" y2="${y(goal.wpm)}"/>
      <text class="gc-goal-label" x="${w - r + 6}" y="${y(goal.wpm) + 3.5}">目標 ${goal.wpm}</text>
      ${list.length > 1 ? `<path class="gc-line" d="${path}"/>` : ''}
      ${dots}
    </svg>
    <div class="gc-key"><span><i class="k-met"></i>理解度${goal.comp}%以上</span><span><i class="k-miss"></i>${goal.comp}%未満</span><span><i class="k-goal"></i>目標</span></div>
  </figure>`;
}

function seg(key, options) {
  const v = S.settings[key];
  return `<div class="seg" data-key="${key}">${options
    .map(([val, label]) => `<button data-val="${esc(JSON.stringify(val))}" class="${v === val ? 'on' : ''}">${label}</button>`)
    .join('')}</div>`;
}

function viewSettings() {
  const s = S.settings;
  return `<header class="top"><div><h1>設定</h1></div></header>
    <h2 class="section">読む速さ</h2>
    <div class="card form">
      <div class="row"><span><span>速度 <b id="wpm-val">${s.wpm}</b> WPM</span><small>1分あたりの語数。最初は200〜300がおすすめ</small></span></div>
      <input type="range" id="wpm" min="100" max="1000" step="25" value="${s.wpm}">
      <div class="row stacked"><span>表示単位<small>「まとまり」は前置詞・接続詞などの前で区切るスラッシュリーディング。英語の語順のまま意味をつかむ練習に</small></span>${seg('chunk', [[1, '1語'], [2, '2語'], [3, '3語'], ['phrase', 'まとまり']])}</div>
      <div class="row"><span>句読点での間<small>文末・カンマで少し止まる</small></span>${seg('pause', [[0, 'なし'], [0.6, '短'], [1, '標準'], [1.6, '長']])}</div>
      <label class="row"><span>再開時に文頭へ戻る<small>一時停止後、文の最初から表示し直す</small></span><input type="checkbox" class="switch" id="rewind" ${s.rewind ? 'checked' : ''}></label>
      <label class="row"><span>聞き読みモード<small>英語音声で読み上げながら、読んでいる単語を表示します（読書画面の🎧ボタンでも切り替え可）。速さはWPMに連動し、目安は100〜300</small></span><input type="checkbox" class="switch" id="listen" ${s.listen ? 'checked' : ''}></label>
      <label class="row"><span>多聴（文字を隠す）<small>聞き読みモードで文字を表示せず、音声だけで理解する練習。🎧ボタンを押すたびに オフ→聞き読み→多聴 と切り替わります</small></span><input type="checkbox" class="switch" id="hideText" ${s.hideText ? 'checked' : ''}></label>
      <label class="row"><span>理解度チェック<small>章の区切り（または2,500語ごと）に理解度を聞き、速さや本のレベルを提案します</small></span><input type="checkbox" class="switch" id="comprehensionCheck" ${s.comprehensionCheck ? 'checked' : ''}></label>
    </div>
    <h2 class="section">表示</h2>
    <div class="card form">
      <label class="row"><span>注視点を色付け<small>単語の中心付近の1文字を赤くし、視線を固定しやすくします</small></span><input type="checkbox" class="switch" id="orp" ${s.orp ? 'checked' : ''}></label>
      <div class="row"><span>文字の大きさ</span>${seg('fontSize', [[0, 'S'], [1, 'M'], [2, 'L'], [3, 'XL'], [4, 'XXL']])}</div>
      <div class="row"><span>書体</span>${seg('font', [['sans', 'ゴシック'], ['serif', '明朝']])}</div>
      <div class="row"><span>テーマ</span>${seg('theme', [['system', '自動'], ['light', 'ライト'], ['dark', 'ダーク']])}</div>
    </div>
    <h2 class="section">記録と辞書</h2>
    <div class="card form">
      <label class="row"><span>1日の目標語数</span><input type="number" id="goal" min="100" step="100" inputmode="numeric" value="${s.goal}"></label>
      <label class="row"><span>黙読の目標速度<small>1文章トレーニングの1回目の黙読で目指す速さ</small></span><input type="number" id="goalWpm" min="50" max="600" step="25" inputmode="numeric" value="${s.goalWpm}"></label>
      <div class="row"><span>目標の理解度</span>${seg('goalComp', [[60, '60%'], [70, '70%'], [80, '80%'], [90, '90%']])}</div>
      <div class="row"><span>辞書</span>${seg('dictMode', [['ja', '英和'], ['en', '英英']])}</div>
      <label class="row"><span>1日の単語学習の目標<small>復習と新しい単語の合計回数</small></span><input type="number" id="wordGoal" min="5" max="500" step="5" inputmode="numeric" value="${s.wordGoal}"></label>
      <label class="row"><span>単語を自動で読み上げる<small>学習で単語のカードを開いたときと「答えを見る」を押したときに、発音を1回ずつ再生します（例文は🔊で再生）</small></span><input type="checkbox" class="switch" id="autoSpeakWord" ${s.autoSpeakWord ? 'checked' : ''}></label>
      <label class="row"><span>間違えたら音読3回<small>復習で「もう一度」を選んだとき、発音を聞いて声に出して読む練習をはさみます</small></span><input type="checkbox" class="switch" id="readAloudOnMiss" ${s.readAloudOnMiss ? 'checked' : ''}></label>
      <label class="row"><span>調べた単語を単語帳に保存<small>辞書で引いた単語を、出てきた英文と一緒に自動で保存します</small></span><input type="checkbox" class="switch" id="autoSaveWords" ${s.autoSaveWords ? 'checked' : ''}></label>
      <label class="stack"><span>読み上げ音声<small>辞書の🔊で使う英語の音声</small></span>
        <div class="voice-row"><select id="voice"><option value="">自動（英語・米国を優先）</option></select>
        <button class="btn ghost" id="voice-test" type="button">試聴</button></div></label>
    </div>
    <h2 class="section">和訳</h2>
    <div class="card form">
      <label class="row"><span>一時停止中に和訳を表示<small>本文の下に日本語訳を出します（読書画面の「和訳」ボタンでも切り替え可）。多読では、訳に頼らず分かるところを楽しむのが基本です</small></span><input type="checkbox" class="switch" id="showJa" ${s.showJa ? 'checked' : ''}></label>
      <label class="stack"><span>翻訳サービス用メールアドレス（任意）<small>MyMemoryの無料翻訳は1日あたり約5,000文字（本の10〜15段落ほど）までです。メールアドレスを登録すると約50,000文字に増えます。アドレスはMyMemoryにだけ送られます</small></span>
      <input type="email" id="mmEmail" autocomplete="email" placeholder="you@example.com" value="${esc(s.mmEmail)}"></label>
    </div>
    <h2 class="section">ダウンロード</h2>
    <div class="card form">
      <label class="stack"><span>独自のCORSプロキシ（任意）<small>Gutenbergからの取得が失敗する場合に。<code>https://…/?url={url}</code> の形式、または末尾にURLを連結する形式</small></span>
      <input type="url" id="proxy" placeholder="https://your-proxy.example.workers.dev/?url={url}" value="${esc(s.proxy)}"></label>
    </div>
    <h2 class="section">データ</h2>
    <div class="card form">
      <div class="row"><span>バックアップ<small>本棚・しおり・記録・単語帳・設定（ダウンロードした本文は含みません）</small></span></div>
      <div class="btn-row"><button class="btn ghost" id="export">書き出す</button><button class="btn ghost" id="import">読み込む</button></div>
      <div class="btn-row"><button class="btn danger-ghost" id="reset">すべてのデータを削除</button></div>
    </div>
    <p class="credits muted">書籍: <a href="https://www.gutenberg.org/" target="_blank" rel="noopener">Project Gutenberg</a>（米国でパブリックドメインの作品）／
    <a href="https://globalstorybooks.net/" target="_blank" rel="noopener">Global Storybooks</a>（<a href="https://africanstorybook.org/" target="_blank" rel="noopener">African Storybook</a>・<a href="https://storyweaver.org.in/" target="_blank" rel="noopener">Pratham Books StoryWeaver</a>、CC BY。各作品の作者は本の詳細画面に表示）／
    <a href="https://learningenglish.voanews.com/" target="_blank" rel="noopener">VOA Learning English</a>「American Stories」（米国政府の著作物、パブリックドメイン）<br>
    英和辞書: <a href="https://github.com/kujirahand/EJDict" target="_blank" rel="noopener">EJDict-hand</a>（CC0）／ 英英辞書: <a href="https://freedictionaryapi.com/" target="_blank" rel="noopener">Free Dictionary API</a>（Wiktionary）<br>
    発音記号: <a href="https://github.com/cmusphinx/cmudict" target="_blank" rel="noopener">CMU Pronouncing Dictionary</a>（© Carnegie Mellon University, BSDライセンス）を英和辞典式の表記に変換<br>
    和訳: <a href="https://mymemory.translated.net/" target="_blank" rel="noopener">MyMemory</a>（機械翻訳）<br>
    単語の頻度順位: <a href="https://github.com/rspeer/wordfreq" target="_blank" rel="noopener">wordfreq</a>（Robyn Speer, CC BY-SA 4.0）をもとに作成</p>`;
}

// ---------- events
function bindView(view) {
  view.onclick = async (e) => {
    const t = e.target.closest('button, [data-open]');
    if (!t) return;
    if (t.dataset.more) return bookMenu(shelfEntry(t.dataset.more));
    if (t.dataset.open) return openBook(shelfEntry(t.dataset.open));
    if (t.dataset.tabGo) return switchTab(t.dataset.tabGo);
    if (t.dataset.lib) return switchTab(t.dataset.lib);
    if (t.dataset.level !== undefined) {
      S.levelFilter = t.dataset.level === 'all' ? 'all' : Number(t.dataset.level);
      return render();
    }
    if (t.dataset.pick) return curatedSheet(curatedById(t.dataset.pick));
    if (t.dataset.result) return resultSheet(Number(t.dataset.result));
    if (t.hasAttribute('data-import')) return $('#file-input').click();
    const segEl = t.closest('.seg[data-key]');
    if (segEl && t.dataset.val) {
      saveSettings({ [segEl.dataset.key]: JSON.parse(t.dataset.val) });
      segEl.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === t));
    }
    if (t.dataset.raise) {
      saveSettings({ goalWpm: Number(t.dataset.raise) });
      toast(`目標を ${t.dataset.raise} WPM にしました`);
      return render();
    }
    if (t.id === 'export') exportData();
    if (t.id === 'import') $('#backup-input').click();
    if (t.id === 'reset' && (await confirmSheet('本棚・しおり・読書記録・単語帳・設定をすべて削除します。元に戻せません。', '削除する', true))) {
      await db.clearAll();
      location.reload();
    }
  };

  const chart = $('.goal-chart', view);
  if (chart) {
    const points = JSON.parse(chart.dataset.points);
    const tip = $('.gc-tip', chart);
    chart.addEventListener('click', (e) => {
      const hit = e.target.closest('.gc-hit');
      if (!hit) return (tip.hidden = true);
      const [date, title, w1, w2, comp] = points[Number(hit.dataset.k)];
      tip.innerHTML = `<b>${w1} WPM</b> → 練習後 ${w2} · 理解度${comp}%<br><small>${esc(date)} · ${esc(title)}</small>`;
      tip.hidden = false;
      tip.style.left = `${Math.min(75, Math.max(25, Number(hit.dataset.x)))}%`; // near the tapped point
    });
  }

  const q = $('#q', view);
  if (q) {
    let timer;
    const run = async () => {
      S.query = q.value.trim();
      const box = $('#results');
      if (!S.query) {
        S.results = null;
        box.innerHTML = '';
        $('#curated').hidden = false;
        return;
      }
      $('#curated').hidden = true;
      if (S.results === null) {
        S.results = 'loading';
        box.innerHTML = resultsHtml();
      }
      try {
        S.results = await gb.search(S.query);
      } catch {
        S.results = 'error';
      }
      if (q.value.trim() === S.query) box.innerHTML = resultsHtml();
    };
    q.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(run, 250);
    });
    $('#search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      q.blur();
      run();
    });
  }

  const wpm = $('#wpm', view);
  if (wpm) {
    wpm.addEventListener('input', () => ($('#wpm-val').textContent = wpm.value));
    wpm.addEventListener('change', () => saveSettings({ wpm: Number(wpm.value) }));
    for (const id of ['rewind', 'orp', 'showJa', 'autoSaveWords', 'listen', 'comprehensionCheck', 'readAloudOnMiss', 'autoSpeakWord', 'hideText']) $(`#${id}`).addEventListener('change', (e) => saveSettings({ [id]: e.target.checked }));
    $('#goal').addEventListener('change', (e) => saveSettings({ goal: Math.max(100, Number(e.target.value) || DEFAULT_SETTINGS.goal) }));
    $('#wordGoal').addEventListener('change', (e) => saveSettings({ wordGoal: Math.min(500, Math.max(5, Number(e.target.value) || DEFAULT_SETTINGS.wordGoal)) }));
    $('#goalWpm').addEventListener('change', (e) => saveSettings({ goalWpm: Math.min(600, Math.max(50, Number(e.target.value) || DEFAULT_SETTINGS.goalWpm)) }));
    $('#proxy').addEventListener('change', (e) => saveSettings({ proxy: e.target.value.trim() }));
    $('#mmEmail').addEventListener('change', (e) => saveSettings({ mmEmail: e.target.value.trim() }));
    const voiceSel = $('#voice');
    englishVoices().then((voices) => {
      for (const v of voices) voiceSel.add(new Option(`${v.name}（${v.lang}）`, v.voiceURI, false, v.voiceURI === S.settings.voice));
      if (!voices.length) voiceSel.options[0].text = '英語の音声が見つかりません';
    });
    voiceSel.addEventListener('change', () => saveSettings({ voice: voiceSel.value }));
    $('#voice-test').addEventListener('click', async () => {
      const r = await speak('Once upon a time, there were four little rabbits.', S.settings.voice);
      if (r === 'unsupported') toast('この端末は音声読み上げに対応していません');
      else if (r === 'no-voice') toast(NO_VOICE_HELP, 6000);
    });
  }
}

function switchTab(tab) {
  if (tab === 'discover' || tab === 'shelf') {
    S.libSub = tab;
    tab = 'library';
  }
  S.tab = tab;
  render();
}

let creditsPromise = null;
const loadCredits = () => (creditsPromise ||= fetch('data/credits.json').then((r) => r.json()).catch(() => ((creditsPromise = null), {})));

function curatedSheet(b) {
  const id = b.id;
  const e = shelfEntry(id);
  const panel = openSheet(`
    <div class="detail">
      ${levelBadge(b.level)}
      <h2>${esc(b.ja)}</h2>
      <p class="en-title">${esc(b.title)}</p>
      <p class="muted">${esc(b.author)}</p>
      <dl class="facts">
        <div><dt>語数</dt><dd>${fmt(b.words)}語</dd></div>
        <div><dt>所要時間</dt><dd>約${minutes(b.words)}<small>（${S.settings.wpm}WPM）</small></dd></div>
        <div><dt>平均文長</dt><dd>${b.sentenceLen}語</dd></div>
        <div><dt>基本2000語以外</dt><dd>${b.rarePct}%</dd></div>
      </dl>
      <p class="muted small">レベル${b.level}「${LEVELS[b.level].desc}」の目安です。難しく感じたら迷わず下のレベルへ。</p>
      ${b.source === 'gutenberg' ? '' : '<details class="credits-box"><summary>収録作品とクレジット</summary><div class="muted small">読み込み中…</div></details>'}
      <div class="sheet-actions"><button class="btn primary wide" data-a="read">${icons.play}${e && e.pos ? '続きから読む' : '読む'}</button></div>
    </div>`);
  panel.querySelector('details')?.addEventListener('toggle', async (ev) => {
    const box = ev.target.querySelector('div');
    const list = (await loadCredits())[b.id] || [];
    box.innerHTML = `<ol class="credit-list">${list
      .map((c) => `<li><b>${esc(c.title)}</b><br>${[c.text && `文: ${esc(c.text)}`, c.illustration && `絵: ${esc(c.illustration)}`].filter(Boolean).join(' / ')}<br>${esc(c.origin)} · ${esc(c.license)}</li>`)
      .join('')}</ol>`;
  }, { once: true });
  panel.querySelector('[data-a=read]').onclick = () => {
    const entry = addToShelf({ id, gid: b.gid, file: b.file, source: 'bundled', title: b.title, author: b.author, ja: b.ja, level: b.level, words: b.words });
    closeSheet(() => openBook(entry));
  };
}

function resultSheet(gid) {
  const cur = curatedFor(gid);
  if (cur) return curatedSheet(cur);
  const b = (S.results || []).find((r) => r.id === gid);
  const id = `pg-${gid}`;
  const existing = shelfEntry(id);
  const panel = openSheet(`
    <div class="detail">
      <h2>${esc(b.title)}</h2>
      <p class="muted">${esc(b.author || '著者不明')} · Project Gutenberg #${gid}</p>
      <p class="small muted">本文をGutenbergから取得して端末に保存します（数百KB〜数MB）。取得には公開のCORSプロキシを使うため、混雑時は失敗することがあります。</p>
      <div class="dl-status"></div>
      <div class="sheet-actions">
        <a class="btn ghost" href="${gb.pageUrl(gid)}" target="_blank" rel="noopener">Gutenbergで見る</a>
        <button class="btn primary" data-a="dl">${existing ? '読む' : 'ダウンロードして読む'}</button>
      </div>
    </div>`);
  const btn = panel.querySelector('[data-a=dl]');
  const status = panel.querySelector('.dl-status');
  btn.onclick = async () => {
    if (existing) return closeSheet(() => openBook(existing));
    btn.disabled = true;
    try {
      const raw = await gb.download(gid, S.settings.proxy, (n, total) => (status.textContent = `取得中…（経路 ${n}/${total}）`));
      const doc = prepare(raw);
      if (doc.wordCount < 50) throw new Error('本文がほとんどありません（英語テキスト以外の可能性）');
      await db.set(`text:${id}`, raw);
      const entry = addToShelf({ id, gid, source: 'download', title: b.title, author: b.author, words: doc.wordCount, tokens: doc.words.length });
      closeSheet(() => openBook(entry));
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'もう一度試す';
      status.innerHTML = `<div class="notice">ダウンロードできませんでした（${esc(err.message)}）。<br>
        代わりの方法: <a href="${gb.textUrl(gid)}" target="_blank" rel="noopener">プレーンテキスト版</a>を開いてファイルとして保存し、
        「探す」の一番下にある「テキストファイルを読み込む」から読み込んでください。</div>`;
    }
  };
}

function bookMenu(e) {
  const panel = openSheet(`
    <h2 class="sheet-title">${esc(e.title)}</h2>
    <div class="menu">
      <button data-a="restart">最初から読み直す</button>
      ${e.finished ? '' : '<button data-a="finish">読了にする</button>'}
      <button data-a="remove" class="danger-text">本棚から削除</button>
    </div>`);
  panel.querySelector('[data-a=restart]').onclick = () => {
    e.pos = 0;
    e.finished = false;
    saveShelf();
    closeSheet(() => openBook(e));
  };
  const fin = panel.querySelector('[data-a=finish]');
  if (fin) fin.onclick = () => markDone(e, false);
  panel.querySelector('[data-a=remove]').onclick = async () => {
    S.shelf = S.shelf.filter((b) => b !== e);
    saveShelf();
    if (e.source !== 'bundled') db.del(`text:${e.id}`);
    closeSheet();
    render();
    toast('本棚から削除しました（読書記録は残ります）');
  };
}

function markDone(e, celebrate) {
  e.finished = true;
  e.lastReadAt = Date.now();
  saveShelf();
  const added = st.markFinished(S.stats, e);
  saveStats();
  if (!celebrate) {
    closeSheet();
    render();
    return;
  }
  const total = st.summary(S.stats, S.settings.goal).words;
  const panel = openSheet(`<div class="celebrate">
      <div class="big-emoji">🎉</div>
      <h2>読了おめでとうございます！</h2>
      <p><b>${esc(e.title)}</b><br>${fmt(e.words)}語を読み切りました。</p>
      <p class="muted">累計 ${fmt(total)}語${added ? ` · 読了 ${S.stats.finished.length}冊目` : ''}</p>
      <div class="check-final"><p class="small">この本はどのくらい分かりましたか？</p>
        <div class="ratings">${coach.RATINGS.map((x) => `<button class="rating" data-r="${x.r}"><span>${x.emoji}</span>${x.label}</button>`).join('')}</div></div>
      <div class="sheet-actions"><button class="btn primary wide" data-a="ok">本棚へ戻る</button></div>
    </div>`);
  panel.querySelector('[data-a=ok]').onclick = () => closeSheet(() => history.back());
  panel.querySelectorAll('[data-r]').forEach((b) =>
    b.addEventListener('click', () => {
      const sug = recordCheck(e, Number(b.dataset.r), 0, true);
      const box = panel.querySelector('.check-final');
      box.innerHTML = `<p class="suggest">${sug.msg || '記録しました。'}</p>${sug.level != null ? `<button class="btn ghost wide" data-a="lv">Lv${sug.level}の本を見る</button>` : ''}`;
      box.querySelector('[data-a=lv]')?.addEventListener('click', () => closeSheet(() => showLevel(sug.level)));
    }),
  );
}

function recordCheck(book, rating, words, final = false, extra = {}) {
  coach.record(S.stats, { bookId: book.id, level: book.level, wpm: S.settings.wpm, rating, words, ...extra });
  saveStats();
  return coach.suggest(S.stats, { bookId: book.id, level: book.level, wpm: S.settings.wpm, final });
}

/** Leave the reader (if open) and show the recommended books of one level. */
function showLevel(level) {
  S.levelFilter = level;
  S.tab = 'discover';
  S.query = '';
  S.results = null;
  if (document.body.classList.contains('reading')) history.back(); // closing the reader re-renders
  else render();
}

async function importFile(file) {
  if (!file) return;
  try {
    const raw = await file.text();
    const doc = prepare(raw);
    if (doc.wordCount < 20) throw new Error('英文が見つかりません');
    const info = gb.headerInfo(raw);
    const gidMatch = raw.slice(0, 3000).match(/EBook #(\d+)/i);
    const id = gidMatch ? `pg-${gidMatch[1]}` : `file-${Date.now()}`;
    await db.set(`text:${id}`, raw);
    const entry = shelfEntry(id) || addToShelf({
      id, gid: gidMatch ? Number(gidMatch[1]) : null, source: 'file',
      title: info.title || file.name.replace(/\.txt$/i, ''), author: info.author, words: doc.wordCount, tokens: doc.words.length,
    });
    if (entry.source === 'bundled') entry.source = 'file';
    toast('読み込みました');
    openBook(entry);
  } catch (e) {
    toast(`読み込めませんでした: ${e.message}`);
  }
}

async function exportData() {
  const data = {
    app: 'rsvp-reader', version: 2, exportedAt: new Date().toISOString(), settings: S.settings, shelf: S.shelf, stats: S.stats,
    vocab: Object.fromEntries(vocab.cachedAll().map((e) => [e.word, e])),
    vocabMeta: vocab.cachedMeta(),
    grammar: grammar.cached(),
    composition: await db.get('composition', {}),
    compositionMeta: await db.get('compositionMeta'),
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  a.download = `rsvp-reader-backup-${st.dayKey()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

async function importBackup(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.app !== 'rsvp-reader') throw new Error('このアプリのバックアップではありません');
    if (!(await confirmSheet('現在の本棚・記録・単語帳・設定をバックアップの内容で置き換えます。', '置き換える', true))) return;
    S.settings = { ...DEFAULT_SETTINGS, ...data.settings };
    S.shelf = data.shelf || [];
    S.stats = { ...st.emptyStats(), ...data.stats };
    await Promise.all([db.set('settings', S.settings), saveShelf(), saveStats(), data.vocab ? vocab.replaceAll(data.vocab) : null, data.vocabMeta ? vocab.saveMeta(data.vocabMeta) : null,
      data.grammar ? grammar.replaceAll(data.grammar) : null, data.composition ? db.set('composition', data.composition) : null,
      data.compositionMeta ? db.set('compositionMeta', data.compositionMeta) : null]);
    applyTheme();
    render();
    toast('バックアップを読み込みました');
  } catch (e) {
    toast(`読み込めませんでした: ${e.message}`);
  }
}

// ---------- startup
async function init() {
  const [settings, shelf, stats] = await Promise.all([db.get('settings'), db.get('shelf'), db.get('stats'), vocab.load(), vocab.loadMeta(), grammar.load()]);
  S.settings = { ...DEFAULT_SETTINGS, ...settings };
  S.settings.daily = { ...structuredClone(DEFAULT_DAILY), ...S.settings.daily };
  S.shelf = shelf || [];
  S.stats = { ...st.emptyStats(), ...stats };
  applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  document.querySelectorAll('.tabbar button').forEach((b) => {
    b.innerHTML = `${icons[b.dataset.icon]}<span>${b.textContent}</span>${['vocab', 'today'].includes(b.dataset.tab) ? '<i class="badge" hidden></i>' : ''}`;
    b.addEventListener('click', () => switchTab(b.dataset.tab));
  });
  $('#r-back').innerHTML = icons.back;
  $('#r-toc').innerHTML = icons.list;
  $('#r-listen').innerHTML = icons.headphones;
  $('#r-prev-sent').innerHTML = icons.prev;
  $('#r-next-sent').innerHTML = icons.next;
  initSheet();
  $('#file-input').addEventListener('change', (e) => {
    importFile(e.target.files[0]);
    e.target.value = '';
  });
  $('#backup-input').addEventListener('change', (e) => {
    importBackup(e.target.files[0]);
    e.target.value = '';
  });

  reader = new Reader({
    get settings() {
      return S.settings;
    },
    saveSettings,
    saveProgress: () => saveShelf(),
    addReading: (book, words, ms) => {
      st.addReading(S.stats, book.id, words, ms);
      saveStats();
    },
    finished: (book) => markDone(book, true),
    recordCheck: (book, rating, words, extra) => recordCheck(book, rating, words, false, extra),
    addListening: (book, words, ms) => {
      st.addListening(S.stats, words, ms);
      saveStats();
    },
    recordTraining: (rec) => {
      goals.recordTraining(S.stats, rec);
      saveStats();
    },
    showLevel,
    closed: () => render(),
  });
  setInterval(updateBadge, 60000); // "もう一度" cards come back after 10 minutes

  render();
  try {
    S.library = await gb.loadLibrary();
  } catch {
    S.library = [];
  }
  if (S.tab === 'discover') render();

  englishVoices(); // start loading the voice list now so the first 🔊 tap speaks English
  db.requestPersistence();
  // On localhost the service worker would serve stale files while developing; opt in with ?sw.
  const dev = location.hostname === 'localhost' && !location.search.includes('sw');
  if ('serviceWorker' in navigator && !dev) navigator.serviceWorker.register('sw.js').catch(() => {});
}

init();
