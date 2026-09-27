// Meaning-unit chunks for slash reading (スラッシュリーディング):
//   Then old Mrs. Rabbit / took a basket / and her umbrella, / and went / through the wood / to the baker's.
// Heuristic, no part-of-speech tagging: break before prepositions, conjunctions / relative words and
// (after a subject of 2+ words) common verbs; always break after punctuation; cap the chunk length.
import { F_SENTENCE, F_CLAUSE, F_PARA, F_HEADING } from './text.js';

const set = (s) => new Set(s.split(' '));
// "of" is left out on purpose ("a loaf of bread" is one unit); so are particles like up/out/off/away.
const PREPOSITIONS = set(
  'about above across after against along among amongst around at before behind below beneath beside besides between beyond by ' +
    'despite during except for from in inside into near onto outside past since through throughout till to toward towards ' +
    'under underneath until unto upon with within without',
);
const CONJUNCTIONS = set(
  'and but or nor yet because although though unless whereas while whilst whether if when whenever where wherever as than ' +
    'that which who whom whose why how what',
);
const AUX = set('am is are was were be been being have has had do does did will would shall should can could may might must');
const VERBS = new Set([
  ...AUX,
  ...'said went came took saw made got knew thought told found gave felt left kept began brought stood heard ran sat held wrote spoke ate fell grew drew flew lay led met paid sent slept sold taught understood won wore woke broke chose caught fought bought threw rose rode sang swam drank forgot hid shook struck tore froze stole put set cut let became looked wanted asked seemed turned tried called'.split(
    ' ',
  ),
]);
// A verb right after these belongs with them ("had been", "to go", "never saw").
const KEEP_VERB_AFTER = set('to not never also just only still always often ever even then so and but or that who which');
// After these a verb-looking word is a noun ("the thought", "a cut").
const DETERMINERS = set('a an the this that these those my your his her its our their some any no every each many much few several one');

const MAX_WORDS = 7;
const MAX_CHARS = 36;

const norm = (w) => w.toLowerCase().replace(/[‘’]/g, "'").replace(/^[^a-z]+|[^a-z']+$/g, '');

/** Uint8Array with 1 where a chunk starts. */
export function chunkStarts(doc) {
  const { words, flags } = doc;
  const n = words.length;
  const starts = new Uint8Array(n);
  let len = 0;
  let chars = 0;
  let first = '';
  for (let i = 0; i < n; i++) {
    const hard = i === 0 || flags[i - 1] & (F_SENTENCE | F_CLAUSE | F_PARA) || (flags[i] ^ flags[i - 1]) & F_HEADING;
    let brk = hard;
    if (!brk && !(flags[i] & F_HEADING)) {
      const w = norm(words[i]);
      const prev = norm(words[i - 1]);
      const opensQuote = /^["“‘']/.test(words[i]);
      const afterPrep = PREPOSITIONS.has(prev) || prev === 'of';
      // "or she" / "what they": a conjunction plus a pronoun is not yet a subject worth its own chunk.
      const onlyLinker = len === 2 && (CONJUNCTIONS.has(first) || PREPOSITIONS.has(first));
      if (len >= 2 && !afterPrep) {
        if (PREPOSITIONS.has(w) || CONJUNCTIONS.has(w) || opensQuote) brk = true;
        else if (VERBS.has(w) && !onlyLinker && !AUX.has(prev) && !KEEP_VERB_AFTER.has(prev) && !DETERMINERS.has(prev)) brk = true;
      }
      if (!brk && (len >= MAX_WORDS || chars + 1 + words[i].length > MAX_CHARS)) {
        // Don't strand the last word or two of a sentence ("...of being / poor.").
        let j = i;
        while (j < n - 1 && !(flags[j] & (F_SENTENCE | F_CLAUSE | F_PARA))) j++;
        const tail = words.slice(i, j + 1).join(' ').length;
        brk = !(j - i < 2 && chars + 1 + tail <= MAX_CHARS + 10);
      }
    }
    if (brk) {
      starts[i] = 1;
      len = 1;
      chars = words[i].length;
      first = norm(words[i]);
    } else {
      len++;
      chars += 1 + words[i].length;
    }
  }
  return starts;
}

/** Start of the chunk containing token i. */
export function chunkStartOf(starts, i) {
  while (i > 0 && !starts[i]) i--;
  return i;
}

/** End (exclusive) of the chunk containing token i. */
export function chunkEndOf(starts, i) {
  let j = i + 1;
  while (j < starts.length && !starts[j]) j++;
  return j;
}
