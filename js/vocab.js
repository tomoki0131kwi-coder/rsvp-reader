// Word book (単語帳) with spaced-repetition review scheduling.
import * as db from './db.js';
import { dayKey } from './stats.js';

const KEY = 'vocab';
const MIN = 60000;
const DAY = 86400000;
let cache = null;

export async function load() {
  if (!cache) cache = (await db.get(KEY)) || {};
  return cache;
}

function save() {
  return db.set(KEY, cache);
}

/** Entries from memory; call load() once at startup first. */
export function cachedAll() {
  return Object.values(cache || {});
}

export async function replaceAll(data) {
  cache = data || {};
  await save();
}

export async function get(word) {
  return (await load())[word];
}

/**
 * Record a dictionary lookup. New words are added and due for review now.
 * Looking up a word that's already in the book means it wasn't remembered: it becomes due again.
 */
export async function addLookup(item) {
  const v = await load();
  const now = Date.now();
  let e = v[item.word];
  if (e) {
    e.seen++;
    e.lastSeen = now;
    if (e.due > now) e.due = now;
    await save();
    return { entry: e, isNew: false };
  }
  e = v[item.word] = { ...item, added: now, lastSeen: now, seen: 1, due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0 };
  await save();
  return { entry: e, isNew: true };
}

export async function remove(word) {
  delete (await load())[word];
  await save();
}

export async function all() {
  return Object.values(await load());
}

export async function dueList(now = Date.now()) {
  return (await all()).filter((e) => e.due <= now).sort((a, b) => a.due - b.due);
}

/** Start of the local day `days` from now; reviews due "in 1 day" appear from tomorrow morning. */
function dayStart(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

/**
 * Next schedule for a grade: 0 = もう一度, 1 = 難しい, 2 = 正解, 3 = 簡単. (A simplified SM-2.)
 * Returns the fields to merge into the entry.
 */
export function schedule(e, g) {
  if (g === 0) return { reps: 0, interval: 0, lapses: e.lapses + 1, ease: Math.max(1.3, e.ease - 0.2), due: Date.now() + 10 * MIN };
  let interval;
  if (e.reps === 0) interval = [0, 1, 1, 4][g];
  else if (e.reps === 1) interval = [0, 2, 3, 6][g];
  else interval = Math.max(e.interval + 1, Math.round(e.interval * [0, 1.2, e.ease, e.ease * 1.3][g]));
  const ease = Math.max(1.3, e.ease + [0, -0.15, 0, 0.15][g]);
  return { reps: e.reps + 1, interval, ease, due: dayStart(interval) };
}

export async function grade(e, g) {
  Object.assign(e, schedule(e, g), { lastReview: Date.now() });
  await save();
}

export function intervalLabel(e, g) {
  const s = schedule(e, g);
  if (g === 0) return '10分';
  if (s.interval < 30) return `${s.interval}日`;
  if (s.interval < 365) return `${Math.round(s.interval / 30)}か月`;
  return `${(s.interval / 365).toFixed(1)}年`;
}

/** How well a word is known, 0-4, for the list display. */
export function strength(e) {
  if (e.reps === 0) return 0;
  if (e.interval < 3) return 1;
  if (e.interval < 10) return 2;
  if (e.interval < 30) return 3;
  return 4;
}

export function nextDue(entries) {
  const now = Date.now();
  const future = entries.filter((e) => e.due > now).map((e) => e.due);
  return future.length ? Math.min(...future) : null;
}

export function toCsv(entries) {
  const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  const rows = [['word', 'pronunciation', 'meaning', 'sentence', 'book'].join(',')];
  for (const e of entries) rows.push([e.word, e.pron ? `/${e.pron}/` : '', e.meaning, (e.ctx || []).join(' '), e.bookTitle].map(q).join(','));
  return rows.join('\r\n');
}

// ---------- word decks (frequent-word lists), daily new words, check tests

export const ADAPTIVE = 'adaptive';

export const DECKS = {
  adaptive: { name: 'レベル別語彙（自動調整）', desc: '基本語から難解な語まで約1万7千語。覚え具合に合わせてレベルが自動で上下します' },
  basic850: { name: '基本850語', desc: 'Basic English の850語。英語の土台になる基本語' },
  core2000: { name: '重要2000語', desc: '日常的によく使われる2000語。多読に必要な語彙の中心' },
};

const META_KEY = 'vocabMeta';
let meta = null;
let deckData = null;

export async function loadMeta() {
  if (!meta) meta = { deck: null, newPerDay: 10, introduced: {}, tests: [], level: 1, ...(await db.get(META_KEY)) };
  return meta;
}

/** Meta from memory; call loadMeta() once at startup first. */
export function cachedMeta() {
  return meta || { deck: null, newPerDay: 10, introduced: {}, tests: [] };
}

export async function saveMeta(partial) {
  Object.assign(await loadMeta(), partial);
  await db.set(META_KEY, meta);
}

export function loadDecks() {
  if (!deckData) {
    deckData = fetch('data/wordlists.json').then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
    deckData.catch(() => (deckData = null));
  }
  return deckData;
}

export const newIntroducedToday = () => cachedMeta().introduced[dayKey()] || 0;

/** New deck words still to learn today (0 without a deck). */
export const newLeftToday = () => (cachedMeta().deck ? Math.max(0, cachedMeta().newPerDay - newIntroducedToday()) : 0);

const normToken = (t) => t.toLowerCase().replace(/[^a-z'-]/g, '');

/** Add today's quota of new words from the chosen deck (most frequent first) to the word book. */
export async function introduceNew() {
  const m = await loadMeta();
  const want = newLeftToday();
  if (!m.deck || !want) return [];
  if (m.deck === ADAPTIVE) {
    const added = await introduceAdaptive(want);
    await saveMeta({ introduced: { [dayKey()]: newIntroducedToday() + added.length } });
    return added;
  }
  const d = await loadDecks();
  const v = await load();
  const now = Date.now();
  const added = [];
  for (const w of d.lists[m.deck]) {
    if (added.length >= want) break;
    if (v[w]) continue;
    const info = d.words[w];
    const ctx = info.ex ? info.ex.split(' ') : null;
    v[w] = {
      word: w, form: w, meaning: info.m, pron: info.p, ctx, at: ctx ? ctx.findIndex((t) => normToken(t) === w) : -1,
      bookTitle: info.src, source: 'deck', added: now, lastSeen: now, seen: 0, due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0,
    };
    added.push(v[w]);
  }
  await save();
  await saveMeta({ introduced: { [dayKey()]: newIntroducedToday() + added.length } });
  return added;
}

/** How far through the chosen deck: words already in the word book / total. */
export async function deckProgress() {
  const m = await loadMeta();
  if (!m.deck || m.deck === ADAPTIVE) return null;
  const d = await loadDecks();
  const v = await load();
  const list = d.lists[m.deck];
  return { total: list.length, inBook: list.filter((w) => v[w]).length, learned: list.filter((w) => v[w] && strength(v[w]) >= 2).length };
}

export async function recordTest(result) {
  const m = await loadMeta();
  const tests = [...m.tests, { ...result, t: Date.now() }].slice(-50);
  await saveMeta({ tests });
}

/** Make a word due for review now (e.g. missed in a check test). */
export async function markDue(word) {
  const e = (await load())[word];
  if (!e) return;
  e.due = Date.now();
  e.lapses++;
  await save();
}

// ---------- levelled vocabulary with automatic difficulty adjustment
// ~17,000 base forms in 9 frequency bands (Lv1 = the 1,000 most common words ... Lv9 = rank 13,001-17,000).

const KNOWN_INTERVAL = 30; // days: a new word that was already known comes back once, a month later
const WINDOW_FIRST = 20; // judge "too easy" on the last N first-sight words of the current level
const MIN_FIRST = 12;
const KNOWN_UP = 0.6; // >= 60% already known -> level up
const WINDOW_REVIEW = 40; // judge "too hard" on the last N reviews of the current level's words
const MIN_REVIEW = 20;
const RETENTION_DOWN = 0.65; // < 65% remembered -> level down

let bandIndex = null;
const bands = new Map();

export function loadBandIndex() {
  if (!bandIndex) {
    bandIndex = fetch('data/vocab/index.json').then((r) => r.json());
    bandIndex.catch(() => (bandIndex = null));
  }
  return bandIndex;
}

export function loadBand(n) {
  if (!bands.has(n)) {
    const p = fetch(`data/vocab/L${n}.json`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
    p.catch(() => bands.delete(n));
    bands.set(n, p);
  }
  return bands.get(n);
}

export const levelRange = async (n) => {
  const b = (await loadBandIndex()).bands[n - 1];
  return `${b.from.toLocaleString()}〜${b.to.toLocaleString()}位`;
};

async function entryFromBand(row, band) {
  const [word, meaning, pron, ex, at, src] = row;
  const idx = await loadBandIndex();
  const now = Date.now();
  return {
    word, form: word, meaning, pron, ctx: ex ? ex.split(' ') : null, at: ex ? at : -1, bookTitle: src >= 0 ? idx.sources[src] : '',
    source: 'deck', band, added: now, lastSeen: now, seen: 0, due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0,
  };
}

/** Next n words not yet in the word book, from the current level upward. */
async function nextAdaptiveWords(n) {
  const m = await loadMeta();
  const v = await load();
  const out = [];
  for (let band = m.level || 1; band <= 9 && out.length < n; band++) {
    const data = await loadBand(band);
    for (const row of data.words) {
      if (out.length >= n) break;
      if (!v[row[0]] && !out.some((e) => e.word === row[0])) out.push(await entryFromBand(row, band));
    }
  }
  return out;
}

export async function introduceAdaptive(n) {
  const v = await load();
  const added = await nextAdaptiveWords(n);
  for (const e of added) v[e.word] = e;
  await save();
  return added;
}

export const isFirstSight = (e) => e.source === 'deck' && e.reps === 0 && e.lapses === 0 && !e.lastReview;

/**
 * Called before grading a deck word. Logs what the grade says about the level, and for a word that was
 * already known on first sight, schedules it a month out and frees today's new-word slot.
 * Returns true when the word counted as "already known".
 */
export async function noteDeckAnswer(e, g) {
  const m = await loadMeta();
  if (e.source !== 'deck' || !e.band) return false;
  const t = Date.now();
  if (isFirstSight(e)) {
    const known = g === 3;
    await saveMeta({ firstSight: [...(m.firstSight || []), { t, band: e.band, known }].slice(-100) });
    if (known) {
      await saveMeta({ introduced: { [dayKey()]: Math.max(0, newIntroducedToday() - 1) } });
      return true;
    }
  } else {
    await saveMeta({ reviewLog: [...(m.reviewLog || []), { t, band: e.band, ok: g >= 2 }].slice(-200) });
  }
  return false;
}

export async function gradeKnown(e) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + KNOWN_INTERVAL);
  Object.assign(e, { reps: 2, interval: KNOWN_INTERVAL, ease: 2.8, due: d.getTime(), lastReview: Date.now(), known: true });
  await save();
}

/** Move the level up or down if the recent answers say it is too easy / too hard. Returns the change or null. */
export async function evaluateLevel() {
  const m = await loadMeta();
  if (m.deck !== ADAPTIVE) return null;
  const level = m.level || 1;
  const since = m.levelLog?.length ? m.levelLog[m.levelLog.length - 1].t : 0;
  const first = (m.firstSight || []).filter((x) => x.band === level && x.t > since).slice(-WINDOW_FIRST);
  const reviews = (m.reviewLog || []).filter((x) => x.band === level && x.t > since).slice(-WINDOW_REVIEW);
  const knownRate = first.length ? first.filter((x) => x.known).length / first.length : 0;
  const retention = reviews.length ? reviews.filter((x) => x.ok).length / reviews.length : 1;
  let to = level;
  let reason = '';
  if (first.length >= MIN_FIRST && knownRate >= KNOWN_UP && level < 9) {
    to = level + 1;
    reason = `新しい単語の${Math.round(knownRate * 100)}%を最初から知っていたため`;
  } else if (reviews.length >= MIN_REVIEW && retention < RETENTION_DOWN && level > 1) {
    to = level - 1;
    reason = `復習の正答率が${Math.round(retention * 100)}%と低かったため`;
  }
  if (to === level) return null;
  return setLevel(to, reason);
}

export async function setLevel(to, reason) {
  const m = await loadMeta();
  const change = { t: Date.now(), from: m.level || 1, to, reason };
  await saveMeta({ level: to, levelLog: [...(m.levelLog || []), change].slice(-30) });
  return change;
}

/** Current level's stats for the word tab. */
export async function adaptiveStatus() {
  const m = await loadMeta();
  const level = m.level || 1;
  const [data, v] = await Promise.all([loadBand(level), load()]);
  const inBook = data.words.filter((r) => v[r[0]]).length;
  return { level, size: data.words.length, inBook, range: await levelRange(level), last: m.levelLog?.[m.levelLog.length - 1] || null, placement: m.placement || null };
}

/** Take back new words that were queued but not yet seen (e.g. after the level went up). */
export async function withdrawNew(entries) {
  const v = await load();
  for (const e of entries) delete v[e.word];
  await save();
  await saveMeta({ introduced: { [dayKey()]: Math.max(0, newIntroducedToday() - entries.length) } });
}
