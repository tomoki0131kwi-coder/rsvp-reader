// Compare what was said (speech recognition) with a script / model answer, word by word.
import { esc } from './ui.js';

const NUMBERS = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split(' ');
const TENS = { 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety', 100: 'hundred' };
const CONTRACTIONS = [
  [/\bcan't\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\bwon't\b/g, 'will not'], [/\bshan't\b/g, 'shall not'],
  [/n't\b/g, ' not'], [/'m\b/g, ' am'], [/'re\b/g, ' are'], [/'ve\b/g, ' have'], [/'ll\b/g, ' will'], [/'d\b/g, ' would'],
  [/\b(it|that|there|here|what|who|he|she|where|how)'s\b/g, '$1 is'],
];

/** Normalised words: lower case, no punctuation, contractions expanded, small numbers spelled out. */
export function normWords(text) {
  let t = String(text).toLowerCase().replace(/[’‘]/g, "'");
  for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  return t
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/[\s-]+/)
    .map((w) => w.replace(/^'+|'+$/g, ''))
    .filter(Boolean)
    .map((w) => (/^\d+$/.test(w) ? NUMBERS[Number(w)] || TENS[Number(w)] || w : w));
}

/**
 * Align reference words with spoken words (longest common subsequence).
 * Returns {ref: [{word, ok}], matched, total, score (0-1), missed: [words], extra: [words]}
 */
export function compare(reference, spoken) {
  // Keep each display word together with its normalised form(s).
  const display = String(reference).split(/\s+/).filter(Boolean);
  const refUnits = [];
  display.forEach((w, i) => normWords(w).forEach((n) => refUnits.push({ n, i })));
  const hyp = normWords(spoken);
  const R = refUnits.length;
  const H = hyp.length;
  const dp = Array.from({ length: R + 1 }, () => new Uint16Array(H + 1));
  for (let i = R - 1; i >= 0; i--) {
    for (let j = H - 1; j >= 0; j--) {
      dp[i][j] = refUnits[i].n === hyp[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const okUnit = new Array(R).fill(false);
  const usedHyp = new Array(H).fill(false);
  for (let i = 0, j = 0; i < R && j < H; ) {
    if (refUnits[i].n === hyp[j]) {
      okUnit[i] = true;
      usedHyp[j] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  // A display word counts as said when all of its parts were said.
  const ref = display.map((word, i) => {
    const units = refUnits.map((u, k) => (u.i === i ? k : -1)).filter((k) => k >= 0);
    return { word, ok: units.length ? units.every((k) => okUnit[k]) : true, counted: units.length > 0 };
  });
  const matched = okUnit.filter(Boolean).length;
  return {
    ref,
    matched,
    total: R,
    score: R ? matched / R : 0,
    missed: ref.filter((r) => r.counted && !r.ok).map((r) => r.word),
    extra: hyp.filter((_, j) => !usedHyp[j]),
  };
}

/** Reference text with the words that were not said marked. */
export function diffHtml(result) {
  return result.ref.map((r) => (r.ok ? esc(r.word) : `<span class="miss">${esc(r.word)}</span>`)).join(' ');
}
