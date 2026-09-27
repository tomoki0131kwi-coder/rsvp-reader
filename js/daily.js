// 今日 tab: the daily checklist. Built-in items complete themselves from the learning records;
// custom items (e.g. shadowing, online lessons) are ticked by hand. Streak and a 7-day view keep the habit visible.
import * as vocab from './vocab.js';
import { dayKey } from './stats.js';
import { esc, icons, openSheet, closeSheet, toast } from './ui.js';

export const DEFAULT_DAILY = {
  items: {
    read: { on: true },
    words: { on: true },
    training: { on: true, n: 1 },
    listen: { on: false, min: 10 },
    test: { on: true },
    shadowing: { on: true, n: 1 },
    repeating: { on: false, n: 1 },
    composition: { on: true, n: 10 },
    speech: { on: false, n: 1 },
    grammar: { on: true, n: 1 },
  },
  custom: [],
  cue: '',
  remindAt: '07:30',
};

const TEST_INTERVAL_DAYS = 7;
const fmt = (n) => Math.round(n).toLocaleString('ja-JP');

/** The checklist for a given day (today by default) with progress for each item. */
export function checklist(host, key = dayKey()) {
  const s = host.settings;
  const d = { ...DEFAULT_DAILY, ...s.daily, items: { ...DEFAULT_DAILY.items, ...s.daily?.items } };
  const day = host.stats.days[key] || {};
  const today = key === dayKey();
  const items = [];
  if (d.items.read.on) {
    items.push({ id: 'read', icon: '📖', title: '多読', detail: `${fmt(s.goal)}語を読む`, value: day.w || 0, target: s.goal, unit: '語', action: '続きを読む' });
  }
  if (d.items.words.on) {
    items.push({ id: 'words', icon: '🗂', title: '単語学習', detail: `復習と新しい単語を${s.wordGoal}回`, value: day.r || 0, target: s.wordGoal, unit: '回', action: '学習する' });
  }
  if (d.items.training.on) {
    const n = (host.stats.trainings || []).filter((t) => dayKey(new Date(t.t)) === key).length;
    items.push({ id: 'training', icon: '📝', title: '1文章トレーニング', detail: `${d.items.training.n}回（黙読→チャンク確認→音読→再黙読）`, value: n, target: d.items.training.n, unit: '回', action: '始める' });
  }
  if (d.items.listen.on) {
    items.push({ id: 'listen', icon: '🎧', title: '多聴', detail: `文字を見ずに${d.items.listen.min}分聞く`, value: Math.floor((day.lms || 0) / 60000), target: d.items.listen.min, unit: '分', action: '聞く' });
  }
  const practice = (host.stats.practice || []).filter((p) => dayKey(new Date(p.t)) === key);
  const count = (type) => practice.filter((p) => p.type === type).length;
  if (d.items.shadowing.on) {
    items.push({ id: 'shadowing', icon: '🎧', title: 'シャドーイング', detail: `ネイティブ音声で${d.items.shadowing.n}区間`, value: count('shadowing'), target: d.items.shadowing.n, unit: '回', action: '始める' });
  }
  if (d.items.repeating.on) {
    items.push({ id: 'repeating', icon: '🔁', title: 'リピーティング', detail: `1文ずつ聞いて繰り返す（${d.items.repeating.n}回）`, value: count('repeating'), target: d.items.repeating.n, unit: '回', action: '始める' });
  }
  if (d.items.composition.on) {
    const n = practice.filter((p) => p.type === 'composition').reduce((a, p) => a + p.n, 0);
    items.push({ id: 'composition', icon: '✍️', title: '瞬間英作文', detail: `${d.items.composition.n}問`, value: n, target: d.items.composition.n, unit: '問', action: '始める' });
  }
  if (d.items.speech.on) {
    items.push({ id: 'speech', icon: '🗣', title: '1分間スピーチ', detail: `${d.items.speech.n}回・自己採点まで`, value: count('speech'), target: d.items.speech.n, unit: '回', action: '話す' });
  }
  if (d.items.grammar.on) {
    items.push({ id: 'grammar', icon: '📘', title: '英文法', detail: `${d.items.grammar.n}節（新しい節・復習・章末テストのどれか）`, value: count('grammar'), target: d.items.grammar.n, unit: '回', action: '始める' });
  }
  if (d.items.test.on && today) {
    const meta = vocab.cachedMeta();
    const last = meta.tests[meta.tests.length - 1];
    const doneToday = last && dayKey(new Date(last.t)) === key;
    const studied = vocab.cachedAll().filter((e) => e.reps > 0 || e.lapses > 0).length;
    const due = studied >= 20 && (!last || Date.now() - last.t > TEST_INTERVAL_DAYS * 86400000);
    if (due || doneToday) {
      items.push({ id: 'test', icon: '✅', title: '確認テスト（週1回）', detail: '学習した単語の4択テスト・目標9割', value: doneToday ? 1 : 0, target: 1, unit: '回', action: 'テストする' });
    }
  }
  for (const c of d.custom) {
    items.push({ id: `c:${c.id}`, icon: '☑️', title: c.label, detail: '自分で決めた学習', value: (day.c || []).includes(c.id) ? 1 : 0, target: 1, manual: true, customId: c.id });
  }
  for (const it of items) it.done = it.value >= it.target;
  return { items, done: items.filter((i) => i.done).length, total: items.length, config: d };
}

/** Days in a row (ending today, or yesterday if today isn't finished yet) with every item done. */
export function streak(host) {
  let n = 0;
  const d = new Date();
  const complete = (k) => {
    const c = checklist(host, k);
    return c.total > 0 && c.done === c.total;
  };
  if (!complete(dayKey(d))) d.setDate(d.getDate() - 1);
  while (n < 3650 && complete(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export const remaining = (host) => {
  const c = checklist(host);
  return c.total - c.done;
};

// ---------- view
export function viewToday(host) {
  const c = checklist(host);
  const all = c.total > 0 && c.done === c.total;
  const st = streak(host);
  const now = new Date();
  const dows = '日月火水木金土';
  const week = [];
  for (let k = 6; k >= 0; k--) {
    const d = new Date();
    d.setDate(d.getDate() - k);
    const cl = checklist(host, dayKey(d));
    const ratio = cl.total ? cl.done / cl.total : 0;
    week.push(`<div class="wk ${k === 0 ? 'today' : ''}"><small>${dows[d.getDay()]}</small>
      <i class="${ratio === 1 ? 'full' : ratio > 0 ? 'part' : ''}" title="${cl.done}/${cl.total}"></i><small>${d.getDate()}</small></div>`);
  }
  const rows = c.items
    .map((it) => {
      const pct = Math.min(100, (it.value / it.target) * 100);
      return `<div class="task ${it.done ? 'done' : ''}" data-task="${esc(it.id)}">
        <button class="task-check" ${it.manual ? `data-toggle="${esc(it.customId)}"` : 'disabled'} aria-label="${it.done ? '完了' : '未完了'}">${it.done ? '✓' : ''}</button>
        <div class="task-main">
          <div class="task-title">${it.icon} ${esc(it.title)}</div>
          <div class="task-detail">${esc(it.detail)}</div>
          ${it.manual ? '' : `<div class="bar"><i style="width:${pct}%"></i></div><div class="task-num">${fmt(it.value)} / ${fmt(it.target)}${it.unit}</div>`}
        </div>
        ${it.manual || it.done ? '' : `<button class="btn ghost task-go" data-go="${esc(it.id)}">${esc(it.action)}</button>`}
      </div>`;
    })
    .join('');
  return `<header class="top"><div><h1>今日の学習</h1><p class="muted">${now.getMonth() + 1}月${now.getDate()}日（${dows[now.getDay()]}）</p></div>
      <div class="streak ${st ? 'on' : ''}"><b>🔥 ${st}</b><small>日連続</small></div></header>
    ${c.config.cue ? `<div class="cue">📍 ${esc(c.config.cue)}</div>` : ''}
    <div class="card today-card ${all ? 'all' : ''}">
      <div class="today-head"><div><b>${c.done} / ${c.total}</b><small>完了</small></div>
        <p>${all ? '🎉 今日の学習はすべて完了です！この調子で明日も続けましょう。' : c.done ? `あと${c.total - c.done}つ。小さく始めて、1つずつ片付けましょう。` : 'まずは1つ。一番気軽なものから始めましょう。'}</p></div>
      <div class="bar"><i style="width:${c.total ? (c.done / c.total) * 100 : 0}%"></i></div>
    </div>
    <div class="card tasks">${rows || '<p class="muted pad">チェックリストが空です。「編集」から項目を追加してください。</p>'}</div>
    <div class="btn-row"><button class="btn ghost" data-edit-daily>${icons.list}チェックリストを編集</button></div>
    <h2 class="section">この1週間</h2>
    <div class="card week">${week.join('')}</div>
    <p class="muted small legend-week"><i class="full"></i>すべて完了 <i class="part"></i>一部 <i></i>未着手</p>`;
}

export function bindToday(view, host) {
  view.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => host.startTask(b.dataset.go)));
  view.querySelectorAll('[data-toggle]').forEach((b) =>
    b.addEventListener('click', () => {
      const id = b.dataset.toggle;
      const day = (host.stats.days[dayKey()] ||= { w: 0, ms: 0 });
      const set = new Set(day.c || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      day.c = [...set];
      host.saveStats();
      const now = checklist(host);
      host.rerender();
      if (set.has(id) && now.total && now.done === now.total) toast('🎉 今日の学習はすべて完了です！');
    }),
  );
  view.querySelector('[data-edit-daily]').addEventListener('click', () => editSheet(host));
}

function editSheet(host) {
  const d = checklist(host).config;
  const it = d.items;
  const sw = (id, on) => `<input type="checkbox" class="switch" data-item="${id}" ${on ? 'checked' : ''}>`;
  const panel = openSheet(`
    <h2 class="sheet-title">チェックリストを編集</h2>
    <div class="form daily-form">
      <label class="row"><span>📖 多読<small>目標語数は設定の「1日の目標語数」（${fmt(host.settings.goal)}語）</small></span>${sw('read', it.read.on)}</label>
      <label class="row"><span>🗂 単語学習<small>目標は設定の「1日の単語学習の目標」（${host.settings.wordGoal}回）</small></span>${sw('words', it.words.on)}</label>
      <div class="row"><span>📝 1文章トレーニング<small>1日の回数</small></span><span class="row-ctl"><input type="number" min="1" max="10" data-num="training.n" value="${it.training.n}">${sw('training', it.training.on)}</span></div>
      <div class="row"><span>🎧 多聴<small>1日の分数</small></span><span class="row-ctl"><input type="number" min="1" max="120" data-num="listen.min" value="${it.listen.min}">${sw('listen', it.listen.on)}</span></div>
      <div class="row"><span>🎧 シャドーイング<small>1日の区間数</small></span><span class="row-ctl"><input type="number" min="1" max="10" data-num="shadowing.n" value="${it.shadowing.n}">${sw('shadowing', it.shadowing.on)}</span></div>
      <div class="row"><span>🔁 リピーティング<small>1日の回数</small></span><span class="row-ctl"><input type="number" min="1" max="10" data-num="repeating.n" value="${it.repeating.n}">${sw('repeating', it.repeating.on)}</span></div>
      <div class="row"><span>✍️ 瞬間英作文<small>1日の問題数</small></span><span class="row-ctl"><input type="number" min="5" max="100" step="5" data-num="composition.n" value="${it.composition.n}">${sw('composition', it.composition.on)}</span></div>
      <div class="row"><span>🗣 1分間スピーチ<small>1日の回数</small></span><span class="row-ctl"><input type="number" min="1" max="10" data-num="speech.n" value="${it.speech.n}">${sw('speech', it.speech.on)}</span></div>
      <div class="row"><span>📘 英文法<small>1日の節数（復習・章末テストも1回に数えます）</small></span><span class="row-ctl"><input type="number" min="1" max="5" data-num="grammar.n" value="${it.grammar.n}">${sw('grammar', it.grammar.on)}</span></div>
      <label class="row"><span>✅ 確認テスト<small>前回から7日たつと表示</small></span>${sw('test', it.test.on)}</label>
    </div>
    <h3 class="sub">自分で決めた学習（手動でチェック）</h3>
    <div class="custom-list">${d.custom.map((c) => `<div class="custom-item"><span>☑️ ${esc(c.label)}</span><button class="link-btn danger-text" data-del="${esc(c.id)}">削除</button></div>`).join('') || '<p class="muted small">例: シャドーイング15分、オンライン英会話、瞬間英作文</p>'}</div>
    <form class="add-custom"><input type="text" maxlength="30" placeholder="項目を追加（例: シャドーイング15分）"><button class="btn ghost" type="submit">追加</button></form>
    <h3 class="sub">いつ・どこで学習する？</h3>
    <p class="muted small">「朝7時半、通勤電車で」のように決めておくと習慣になりやすくなります。今日のタブの上に表示します。</p>
    <input type="text" class="cue-input" maxlength="40" placeholder="例: 朝7:30 通勤電車で" value="${esc(d.cue)}">
    <h3 class="sub">毎日のリマインダー</h3>
    <p class="muted small">アプリを閉じている間は通知を出せないため、カレンダーアプリの通知を使います。</p>
    <div class="remind-row"><input type="time" class="remind-time" value="${esc(d.remindAt)}">
      <a class="btn ghost" data-gcal target="_blank" rel="noopener">Googleカレンダーに追加</a>
      <button class="btn ghost" data-ics>.icsファイル</button></div>
    <div class="sheet-actions"><button class="btn primary wide" data-a="done">完了</button></div>`, { onClose: () => host.rerender() });

  const save = (patch) => host.saveSettings({ daily: { ...d, ...patch, items: { ...d.items, ...patch.items } } });
  panel.querySelectorAll('[data-item]').forEach((x) =>
    x.addEventListener('change', () => {
      d.items[x.dataset.item] = { ...d.items[x.dataset.item], on: x.checked };
      save({ items: d.items });
    }),
  );
  panel.querySelectorAll('[data-num]').forEach((x) =>
    x.addEventListener('change', () => {
      const [id, field] = x.dataset.num.split('.');
      d.items[id] = { ...d.items[id], [field]: Math.max(1, Number(x.value) || 1) };
      save({ items: d.items });
    }),
  );
  const renderCustom = () => editSheet(host);
  panel.querySelectorAll('[data-del]').forEach((b) =>
    b.addEventListener('click', () => {
      d.custom = d.custom.filter((c) => c.id !== b.dataset.del);
      save({ custom: d.custom });
      renderCustom();
    }),
  );
  panel.querySelector('.add-custom').addEventListener('submit', (e) => {
    e.preventDefault();
    const label = e.target.querySelector('input').value.trim();
    if (!label) return;
    d.custom = [...d.custom, { id: Date.now().toString(36), label }];
    save({ custom: d.custom });
    renderCustom();
  });
  panel.querySelector('.cue-input').addEventListener('change', (e) => save({ cue: e.target.value.trim() }));
  const time = panel.querySelector('.remind-time');
  const gcal = panel.querySelector('[data-gcal]');
  const updateLink = () => (gcal.href = googleCalendarUrl(time.value));
  updateLink();
  time.addEventListener('change', () => {
    save({ remindAt: time.value });
    updateLink();
  });
  panel.querySelector('[data-ics]').addEventListener('click', () => downloadIcs(time.value));
  panel.querySelector('[data-a=done]').onclick = () => closeSheet();
}

// ---------- reminders through the calendar
function nextStart(hhmm) {
  const [h, m] = (hhmm || '07:30').split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  if (d < new Date()) d.setDate(d.getDate() + 1);
  return d;
}

const stamp = (d) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;

function googleCalendarUrl(hhmm) {
  const start = nextStart(hhmm);
  const end = new Date(start.getTime() + 15 * 60000);
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: '英語の学習（RSVP多読）',
    details: 'RSVP多読の「今日」タブでチェックリストを確認しましょう。',
    dates: `${stamp(start)}/${stamp(end)}`,
    recur: 'RRULE:FREQ=DAILY',
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

function downloadIcs(hhmm) {
  const start = nextStart(hhmm);
  const utc = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//RSVP Tadoku//JA', 'BEGIN:VEVENT',
    `UID:rsvp-daily-${Date.now()}@rsvp-reader`, `DTSTAMP:${utc}`, `DTSTART:${stamp(start)}`, 'DURATION:PT15M', 'RRULE:FREQ=DAILY',
    'SUMMARY:英語の学習（RSVP多読）', 'DESCRIPTION:「今日」タブでチェックリストを確認しましょう。',
    'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:英語の学習の時間です', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'rsvp-reader-reminder.ics';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

