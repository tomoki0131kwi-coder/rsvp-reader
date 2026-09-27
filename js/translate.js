// English -> Japanese translation of paragraphs, cached on the device.
// Uses Chrome's on-device Translator API when available (desktop Chrome today), otherwise MyMemory.
import * as db from './db.js';

const MAX_CHARS = 400; // MyMemory rejects queries over 500 bytes

export class QuotaError extends Error {}

function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36) + s.length.toString(36);
}

/** Split text into pieces under MAX_CHARS, preferring sentence and then clause boundaries. */
function pieces(text) {
  const out = [];
  let cur = '';
  const push = (s) => {
    if (cur && (cur + ' ' + s).length > MAX_CHARS) {
      out.push(cur);
      cur = s;
    } else cur = cur ? `${cur} ${s}` : s;
  };
  for (const sentence of text.split(/(?<=[.!?]["'”’)]*)\s+/)) {
    if (sentence.length <= MAX_CHARS) push(sentence);
    else for (const part of sentence.split(/(?<=[,;:—])\s+/)) {
      if (part.length <= MAX_CHARS) push(part);
      else for (const w of part.split(' ')) push(w);
    }
  }
  if (cur) out.push(cur);
  return out;
}

function decodeEntities(s) {
  const t = document.createElement('textarea');
  t.innerHTML = s;
  return t.value;
}

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

let chromeTranslator = null;
let chromeUnavailable = !('Translator' in self);
async function viaChrome(text) {
  if (chromeUnavailable) return null;
  try {
    if (!chromeTranslator) {
      const opts = { sourceLanguage: 'en', targetLanguage: 'ja' };
      // availability() can hang on devices without the model, so don't wait long.
      if ((await withTimeout(self.Translator.availability(opts), 2000)) !== 'available') throw new Error('unavailable');
      chromeTranslator = await withTimeout(self.Translator.create(opts), 5000);
    }
    return await withTimeout(chromeTranslator.translate(text), 20000);
  } catch {
    chromeUnavailable = true;
    return null;
  }
}

async function viaMyMemory(text, email) {
  const out = [];
  for (const q of pieces(text)) {
    let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=en|ja`;
    if (email) url += `&de=${encodeURIComponent(email)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    let d;
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      d = await r.json();
    } finally {
      clearTimeout(timer);
    }
    if (d.quotaFinished || d.responseStatus === 429) throw new QuotaError('quota');
    if (d.responseStatus !== 200 || !d.responseData) throw new Error(d.responseDetails || `status ${d.responseStatus}`);
    out.push(decodeEntities(d.responseData.translatedText));
  }
  return out.join('');
}

/** Translate a paragraph to Japanese. Cached results are returned without a network request. */
export async function translate(text, { email = '' } = {}) {
  const key = `tr:${hash(text)}`;
  const cached = await db.get(key);
  if (cached) return cached;
  const ja = (await viaChrome(text)) || (await viaMyMemory(text, email));
  db.set(key, ja);
  return ja;
}
