// Turns a plain-text book into a token stream for RSVP.

export const F_SENTENCE = 1; // token ends a sentence
export const F_CLAUSE = 2; // token ends with , ; : or a dash
export const F_PARA = 4; // last token of a paragraph
export const F_HEADING = 8; // token belongs to a heading

const START_RE = /^\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG.*$/im;
const END_RE = /^\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG.*$/im;
const HEADING_RE = /^(chapter|book|part|stave|volume|act|scene|adventure|section)\s+([ivxlcdm]+\b|\d+|(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|the)\b)/i;
const ROMAN_RE = /^[IVXLCDM]+\.?$/;
const MD_HEADING_RE = /^#{1,3}\s+\S/;
const ABBREV = new Set(['mr.', 'mrs.', 'ms.', 'dr.', 'st.', 'mt.', 'jr.', 'sr.', 'vs.', 'etc.', 'no.', 'co.', 'capt.', 'col.', 'gen.', 'rev.', 'prof.', 'e.g.', 'i.e.']);

export function stripGutenberg(text) {
  text = text.replace(/\r\n?/g, '\n').replace(/^﻿/, '');
  const s = START_RE.exec(text);
  if (s) text = text.slice(s.index + s[0].length);
  const e = END_RE.exec(text);
  if (e) text = text.slice(0, e.index);
  return text.trim();
}

function isHeading(lines) {
  const first = lines[0];
  if (MD_HEADING_RE.test(first)) return lines.length === 1; // "# Story title" in bundled collections
  if (first.length > 70) return false;
  // "CHAPTER IV. IN WHICH ..." titles may wrap over several lines.
  if (HEADING_RE.test(first) && /^[A-Z]/.test(first)) return lines.length <= 4 && lines.join(' ').length < 220;
  if (lines.length > 2) return false;
  if (ROMAN_RE.test(first)) return true;
  // Short all-caps line such as "THE CAT THAT WALKED BY HIMSELF"
  const letters = first.replace(/[^A-Za-z]/g, '');
  return lines.length === 1 && letters.length >= 3 && letters === letters.toUpperCase() && !/[,;!?"]$/.test(first);
}

function splitWords(para) {
  const out = [];
  for (let w of para.split(/\s+/)) {
    if (!w) continue;
    // Break "word—word" after the dash so each part is readable on its own.
    const parts = w.split(/(?<=[—–])(?=\S)/);
    for (const p of parts) {
      if (p.length > 18 && p.includes('-')) out.push(...p.split(/(?<=-)(?=\S)/));
      else out.push(p);
    }
  }
  return out;
}

function tokenFlags(w) {
  const core = w.replace(/["'”’)\]]+$/, '');
  if (/[.!?]$/.test(core)) {
    const lower = core.toLowerCase();
    if (ABBREV.has(lower) || /^[A-Z]\.$/.test(core)) return 0;
    return F_SENTENCE;
  }
  if (/[,;:—–]$/.test(core) || /\)$/.test(w)) return F_CLAUSE;
  return 0;
}

export function countWords(words, from = 0, to = words.length) {
  let n = 0;
  for (let i = from; i < to; i++) if (/[A-Za-z0-9]/.test(words[i])) n++;
  return n;
}

/** Split text into paragraphs (arrays of lines), coping with double-spaced texts. */
function paragraphs(text) {
  const toLines = (b) => b.split('\n').map((l) => l.trim()).filter(Boolean);
  let blocks = text.split(/\n[ \t]*\n+/).map(toLines).filter((b) => b.length);
  // Some texts put a blank line after every line; there paragraphs are separated by 2+ blank lines.
  const single = blocks.filter((b) => b.length === 1).length;
  const markdown = /^#{1,3}\s/m.test(text); // our own collections: one short line per page is intended
  if (!markdown && blocks.length > 20 && single / blocks.length > 0.8 && /\n[ \t]*\n[ \t]*\n/.test(text)) {
    blocks = text.split(/\n[ \t]*\n[ \t]*\n+/).map(toLines).filter((b) => b.length);
  }
  // Join a block that stops mid-sentence with a following block that starts in lowercase.
  const out = [];
  for (const b of blocks) {
    const prev = out[out.length - 1];
    if (prev && !isHeading(prev) && /[^.!?:;"'”’)\]]$/.test(prev[prev.length - 1]) && /^[a-z]/.test(b[0])) prev.push(...b);
    else out.push(b);
  }
  return out;
}

/** Prepare raw book text. Returns {words, flags, paraStart, chapters, wordCount}. */
export function prepare(raw) {
  let text = stripGutenberg(raw)
    // Drop illustration notes, but keep a chapter label some editions put inside them.
    .replace(/\[Illustration[^\]]*\]/gi, (m) => {
      const c = m.match(/\bchapter\s+([ivxlcdm]+|\d+)\b\.?/i);
      return c ? `\n\n${c[0]}\n\n` : '';
    })
    .replace(/_([^_\n]+(?:\n[^_\n]+)*)_/g, '$1')
    .replace(/--/g, '—')
    .replace(/[ \t]+$/gm, '');

  const words = [];
  const flags = [];
  const paraStart = [];
  const headings = [];

  for (let lines of paragraphs(text)) {
    const heading = isHeading(lines);
    const explicit = heading && MD_HEADING_RE.test(lines[0]);
    if (explicit) lines = [lines[0].replace(/^#+\s*/, '')];
    const toks = splitWords(lines.join(' '));
    if (!toks.length) continue;
    if (heading) {
      const title = lines.join(' — ').replace(/\s+/g, ' ');
      const prev = headings[headings.length - 1];
      // "CHAPTER I" directly followed by its title "JONATHAN HARKER'S JOURNAL": one chapter.
      if (prev && prev.end === words.length && !prev.joined && (HEADING_RE.test(prev.title) || ROMAN_RE.test(prev.title)) && !HEADING_RE.test(title)) {
        prev.title += ` — ${title}`;
        prev.joined = true;
      } else headings.push({ title, index: words.length, explicit });
    }
    paraStart.push(words.length);
    for (let i = 0; i < toks.length; i++) {
      let f = tokenFlags(toks[i]);
      if (heading) f = F_HEADING;
      if (i === toks.length - 1) f |= F_PARA | (heading ? 0 : F_SENTENCE);
      words.push(toks[i]);
      flags.push(f);
    }
    if (heading) headings[headings.length - 1].end = words.length;
  }

  // Headings followed by almost no text are table-of-contents lines, not chapters.
  // A heading repeated later (same "Chapter N" or same title) was a table-of-contents entry.
  const key = (h) => {
    if (ROMAN_RE.test(h.title)) return ''; // bare "I." / "II." restart in every story of a collection
    const m = h.title.match(HEADING_RE);
    return (m ? m[0] : h.title).toUpperCase().replace(/[^A-Z0-9]/g, '');
  };
  const keys = headings.map(key);
  const chapters = [];
  for (let i = 0; i < headings.length; i++) {
    const end = i + 1 < headings.length ? headings[i + 1].index : words.length;
    if (!headings[i].explicit && countWords(words, headings[i].index, end) < 40) continue;
    if (!headings[i].explicit && keys[i] && keys.indexOf(keys[i], i + 1) !== -1) continue;
    chapters.push(headings[i]);
  }

  return {
    words,
    flags: Uint8Array.from(flags),
    paraStart: Uint32Array.from(paraStart),
    chapters,
    wordCount: countWords(words),
  };
}

/** Index of the paragraph containing token i. */
export function paraOf(doc, i) {
  const ps = doc.paraStart;
  let lo = 0;
  let hi = ps.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (ps[mid] <= i) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function paraRange(doc, p) {
  const start = doc.paraStart[p];
  const end = p + 1 < doc.paraStart.length ? doc.paraStart[p + 1] : doc.words.length;
  return [start, end];
}

/** Start of the sentence containing token i. */
export function sentenceStart(doc, i) {
  let j = Math.min(i, doc.words.length - 1);
  while (j > 0 && !(doc.flags[j - 1] & (F_SENTENCE | F_PARA))) j--;
  return j;
}

/** Start of the sentence after the one containing token i. */
export function nextSentence(doc, i) {
  let j = i;
  while (j < doc.words.length - 1 && !(doc.flags[j] & (F_SENTENCE | F_PARA))) j++;
  return Math.min(j + 1, doc.words.length - 1);
}

export function chapterAt(doc, i) {
  let c = -1;
  for (let k = 0; k < doc.chapters.length && doc.chapters[k].index <= i; k++) c = k;
  return c;
}

/** Tokens [start, end) of doc as a document of their own (for passage training). */
export function sliceDoc(doc, start, end) {
  const paraStart = [];
  for (const s of doc.paraStart) if (s >= start && s < end) paraStart.push(s - start);
  if (!paraStart.length || paraStart[0] !== 0) paraStart.unshift(0);
  const words = doc.words.slice(start, end);
  return { words, flags: doc.flags.slice(start, end), paraStart: Uint32Array.from(paraStart), chapters: [], wordCount: countWords(words) };
}

/**
 * A passage of about 100-450 words around token i for passage training:
 * the current chapter if it is short (a story in a collection), otherwise paragraphs from here.
 */
export function pickPassage(doc, i) {
  const c = chapterAt(doc, i);
  if (c >= 0) {
    const cs = doc.chapters[c].index;
    const ce = c + 1 < doc.chapters.length ? doc.chapters[c + 1].index : doc.words.length;
    const n = countWords(doc.words, cs, ce);
    if (n >= 40 && n <= 600) return [cs, ce];
  }
  let p = paraOf(doc, i);
  const nextChapter = doc.chapters.find((ch) => ch.index > i)?.index ?? doc.words.length;
  while (p < doc.paraStart.length - 1 && doc.flags[doc.paraStart[p]] & F_HEADING) p++;
  const start = doc.paraStart[p];
  let end = paraRange(doc, p)[1];
  while (end < nextChapter && countWords(doc.words, start, end) < 200) {
    const [, next] = paraRange(doc, paraOf(doc, end));
    if (countWords(doc.words, start, next) > 450 && countWords(doc.words, start, end) >= 100) break;
    end = next;
  }
  return [start, Math.min(end, nextChapter)];
}
