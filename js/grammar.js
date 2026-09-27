// 英文法コース: progress, spaced review of the check questions, and the imported book pack
// (your own scan of the book, made on the PC with tools/book_pack.py and imported on the phone).
// The pack stays on this device only: it is not part of backups and never leaves the phone.
import * as db from './db.js';
import { schedule } from './vocab.js';
import { CHAPTERS } from './grammarCourse.js';

const BOOK_KEY = 'grammarBook';
const STORE = 'grammar';
const VERIFIED_PAGES = 901; // the scan the course's PDF page numbers were checked against

// ---------- course helpers
export const SECTIONS = CHAPTERS.flatMap((c) => c.sections.map((s) => ({ ...s, chapter: c.n })));
const byId = new Map(SECTIONS.map((s) => [s.id, s]));
export const section = (id) => byId.get(id);
export const chapter = (n) => CHAPTERS.find((c) => c.n === n);
export const qid = (s, k) => `${s.id}#${k}`;

/** The question for a card id ("1-1-1#2"). */
export function question(id) {
  const [sid, k] = id.split('#');
  const s = byId.get(sid);
  return s && s.questions[Number(k)] ? { ...s.questions[Number(k)], id, section: s } : null;
}

/** Book pages of a section: from its first page to the page before the next section (or the chapter's end). */
export function bookRange(s) {
  const c = chapter(s.chapter);
  const i = c.sections.indexOf(c.sections.find((x) => x.id === s.id));
  const next = c.sections[i + 1];
  const nextChapter = CHAPTERS.find((x) => x.n === s.chapter + 1);
  const end = next ? next.book - 1 : nextChapter ? nextChapter.toc.book - 1 : s.book + (s.pdf[1] - s.pdf[0]);
  return [s.book, Math.max(s.book, end)];
}

// ---------- progress
let progress = null;
const empty = () => ({ sections: {}, cards: {}, tests: {}, last: null });

export async function load() {
  if (!progress) progress = { ...empty(), ...(await db.get(STORE)) };
  return progress;
}
export const cached = () => progress || empty();
export const save = () => db.set(STORE, progress);

export async function replaceAll(data) {
  progress = { ...empty(), ...data };
  await save();
}

export function sectionState(id) {
  return cached().sections[id] || {};
}

export async function markSection(id, patch) {
  await load();
  progress.sections[id] = { ...progress.sections[id], ...patch };
  progress.last = id;
  await save();
}

/** Record the answer to a question: a spaced-review card per question (wrong -> soon, right -> later). */
export async function answer(id, correct) {
  await load();
  const e = progress.cards[id] || { id, due: 0, interval: 0, ease: 2.5, reps: 0, lapses: 0 };
  progress.cards[id] = { ...e, ...schedule(e, correct ? 2 : 0), lastReview: Date.now(), last: correct };
}

export function dueCards(now = Date.now()) {
  return Object.values(cached().cards).filter((e) => e.due <= now && question(e.id)).sort((a, b) => a.due - b.due);
}

export async function addTest(n, score, total) {
  await load();
  (progress.tests[n] ||= []).push({ t: Date.now(), score, n: total });
  await save();
}

/** The next section to study: the first one not finished, in book order. */
export function nextSection() {
  return SECTIONS.find((s) => !sectionState(s.id).done) || null;
}

export function summary() {
  const done = SECTIONS.filter((s) => sectionState(s.id).done).length;
  const shaky = SECTIONS.filter((s) => sectionState(s.id).self === 1).length;
  return { done, total: SECTIONS.length, due: dueCards().length, shaky };
}

// ---------- the book pack
let book = null; // {title, pages, pageNo, missing, text, data: Blob, norm: string[]}

/** Parse a .rsvpbook file (see tools/book_pack.py) and keep it on this device. */
export async function importPack(file) {
  const head = new DataView(await file.slice(0, 12).arrayBuffer());
  const magic = new TextDecoder().decode(new Uint8Array(head.buffer, 0, 8));
  if (magic !== 'RSVPBK01') throw new Error('本のパック（.rsvpbook）ではありません');
  const n = head.getUint32(8, true);
  const header = JSON.parse(await file.slice(12, 12 + n).text());
  if (!Array.isArray(header.pages) || !Array.isArray(header.text)) throw new Error('パックの内容が不完全です');
  const data = file.slice(12 + n, file.size, 'application/octet-stream');
  const last = header.pages[header.pages.length - 1];
  if (last && last[0] + last[1] > data.size) throw new Error('ファイルが途中までしかありません（コピーし直してください）');
  const rec = { title: header.title, pages: header.pages, pageNo: header.pageNo || header.pages.map((_, i) => i + 1), missing: header.missing || [], text: header.text, data, importedAt: Date.now() };
  await db.set(BOOK_KEY, rec);
  book = null;
  return loadBook();
}

export async function loadBook() {
  if (book) return book;
  const rec = await db.get(BOOK_KEY);
  if (!rec) return null;
  book = { ...rec, norm: null };
  return book;
}

export async function removeBook() {
  await db.del(BOOK_KEY);
  book = null;
}

/** Blob of one scanned page (0-based PDF index). */
export function pageBlob(b, i) {
  const [off, len] = b.pages[i];
  return b.data.slice(off, off + len, 'image/jpeg');
}

// The course records where every chapter page, intro and section sits in the verified scan, so page numbers
// come from there; other scans fall back to the page numbers read from the bottom of each page.
const verified = (b) => b.pages.length === VERIFIED_PAGES;
const SPANS = CHAPTERS.flatMap((c) => [
  [c.toc.pdf, c.toc.pdf, c.toc.book],
  [c.intro.pdf[0], c.intro.pdf[1], c.intro.book[0]],
  ...c.sections.map((s) => [s.pdf[0], s.pdf[1], s.book]),
]);

/** Printed page number of a PDF index (0-based). */
export function bookPage(b, i) {
  if (verified(b)) {
    const sp = SPANS.find(([a, z]) => i + 1 >= a && i + 1 <= z);
    if (sp) return sp[2] + (i + 1 - sp[0]);
  }
  return b.pageNo[i];
}
export const pageLabel = (b, i) => `p.${bookPage(b, i)}`;

/** PDF index where a section starts. */
export function sectionStart(b, s) {
  if (verified(b)) return s.pdf[0] - 1;
  const i = b.pageNo.indexOf(s.book);
  return i >= 0 ? i : s.pdf[0] - 1;
}

export function pdfIndexOfBookPage(b, page) {
  if (verified(b)) {
    const sp = SPANS.find(([a, z, p0]) => page >= p0 && page <= p0 + (z - a));
    if (sp) return sp[0] - 1 + (page - sp[2]);
  }
  const i = b.pageNo.indexOf(page);
  if (i >= 0) return i;
  // Page missing from the scan: the nearest page before it.
  let best = 0;
  b.pageNo.forEach((p, k) => {
    if (p < page) best = k;
  });
  return best;
}

/** How many of a section's book pages the scan lacks (a single blank page before the next chapter is ignored). */
export function missingIn(b, s) {
  if (!verified(b)) {
    const [a, z] = bookRange(s);
    return b.missing.filter((p) => p >= a && p <= z).length;
  }
  const [a, z] = bookRange(s);
  const n = z - a + 1 - (s.pdf[1] - s.pdf[0] + 1);
  const c = chapter(s.chapter);
  const last = c.sections[c.sections.length - 1].id === s.id;
  return n > 0 && !(last && n === 1) ? n : 0;
}

/** The course section (or chapter intro) a PDF page (0-based) belongs to. */
export function whereIs(b, i) {
  const p = i + 1;
  const page = b.pageNo[i];
  for (const c of CHAPTERS) {
    for (const x of c.sections) {
      const s = byId.get(x.id);
      if (verified(b)) {
        if (p >= s.pdf[0] && p <= s.pdf[1]) return { chapter: c, section: s };
      } else {
        const [a, z] = bookRange(s);
        if (page >= a && page <= z) return { chapter: c, section: s };
      }
    }
    if (verified(b) ? p >= c.toc.pdf && p <= c.intro.pdf[1] : page >= c.toc.book && page < c.sections[0].book) return { chapter: c, section: null };
  }
  return null;
}

// ---------- full-text search over the OCR text
// OCR drops the spaces between English words and confuses I / l / |, so both the pages and the query
// are compared without spaces and with those letters folded together.
const FOLD = /[il|｜!]/g;
function normChar(ch) {
  return ch.normalize('NFKC').toLowerCase().replace(FOLD, 'l');
}
export function normalize(s) {
  return s.normalize('NFKC').toLowerCase().replace(/\s+/g, '').replace(FOLD, 'l');
}

function indexed(text) {
  let norm = '';
  const map = [];
  for (let k = 0; k < text.length; k++) {
    const ch = text[k];
    if (/\s/.test(ch)) continue;
    const n = normChar(ch);
    norm += n;
    for (let j = 0; j < n.length; j++) map.push(k);
  }
  return { norm, map };
}

/** Pages containing the query: [{i, snippet: [before, hit, after]}]. */
export function search(b, query, limit = 200) {
  const q = normalize(query);
  if (!q) return [];
  if (!b.norm) b.norm = b.text.map(indexed);
  const out = [];
  for (let i = 0; i < b.norm.length && out.length < limit; i++) {
    const { norm, map } = b.norm[i];
    const at = norm.indexOf(q);
    if (at < 0) continue;
    const t = b.text[i];
    const s = map[at];
    const e = map[at + q.length - 1] + 1;
    const flat = (x) => x.replace(/\s+/g, ' ');
    out.push({ i, count: norm.split(q).length - 1, snippet: [flat(t.slice(Math.max(0, s - 40), s)), flat(t.slice(s, e)), flat(t.slice(e, e + 50))] });
  }
  return out;
}

// ---------- answer checking
export function normAnswer(s) {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
