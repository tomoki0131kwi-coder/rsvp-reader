// Spot the grammar in an English sentence by its surface form, and point to the 英文法コース section that explains it.
// Uses each section's example-search pattern plus a few extra patterns for very common structures.
// It is a rough guide (no parsing): the longer, more specific matches are shown first.
import { CHAPTERS } from './grammarCourse.js';

const NOT_ING = String.raw`(?!(?:nothing|something|anything|everything|thing|king|ring|morning|evening|during|spring|string|wing|ceiling|building|feeling|meaning|wedding)\b)`;
const PP = String.raw`(?:\w+ed|known|made|given|taken|seen|done|written|told|found|born|built|kept|left|brought|thought|called|caught|held|sent|shown|spoken|stolen|broken|chosen|driven|eaten|fallen|forgotten|hidden|sold|won|worn|torn|thrown|grown|drawn|put|set|cut|hit|hurt|shut|read|heard|paid|laid|led|lost|meant|met)`;

/** Extra detection-only patterns: section id -> regex source. */
const EXTRA = {
  '1-1-2': String.raw`\b(I|you|he|she|it|we|they)\s+(\w+ed|went|came|saw|said|made|took|got|gave|found|knew|thought|told|became|left|felt|brought|began|kept|held|stood|heard|met|ran|paid|sat|spoke|lay|led|grew|lost|fell|sent|built|understood|drew|broke|spent|rose|drove|bought|wore|chose|threw|caught|won|forgot|ate|hid|sang|swam|wrote|flew|slept|sold|taught|fought|woke|cried|tried|carried)\b`,
  '11-4-5': String.raw`\b(ask|asks|asked|tell|tells|told|want|wants|wanted|allow|allows|allowed|advise|advised|encourage|encouraged|expect|expected|order|ordered|force|forced|invite|invited|persuade|persuaded|remind|reminded|warn|warned)\s+(me|him|her|them|us|you|\w+)\s+(not\s+)?to\s+\w+`,
  '16-1-1': String.raw`^\W*(get|go|come|look|take|give|let|tell|be|don't|do not|please|keep|put|stop|listen|wait|turn|make|bring|help|try|remember|leave|sit|stand|run|hurry|call|show|open|close|never|follow|hold|throw|eat|drink|think|mind|beware|forgive)\b(?!\s+(you|we|they|I)\b)`,
  '1-3-1': String.raw`\b(am|is|are)\s+` + NOT_ING + String.raw`\w+ing\b`,
  '1-3-5': String.raw`\b(was|were)\s+` + NOT_ING + String.raw`\w+ing\b`,
  '5-1-2': String.raw`\bmay\s+(not\s+)?\w+`,
  '5-1-3': String.raw`\bmust\s+(not\s+)?\w+`,
  '5-1-5': String.raw`\b(can|cannot|can't)\s+\w+`,
  '5-2-5': String.raw`\bshould\s+(not\s+)?\w+`,
  '8-2-2': String.raw`\bit (is|was|'s) (\w+ ){1,2}(to|that)\b`,
  '11-4-2': String.raw`\b(made|make|makes|let|lets) (me|him|her|them|us|you) (?!to\b)\w+`,
  '12-1-1': String.raw`\bto (be|go|see|get|make|do|have|take|come|find|know|say|give|keep|help|tell|leave|put|bring|live|eat|play|look|ask|try|feel|become|begin|speak|hear|meet|buy|pay|learn|work|run|stay|win|visit|walk|sleep|read|write|open|carry|catch|save|show|think|call)\b`,
  '13-1-1': String.raw`\b(of|for|in|without|before|after|by|about|at|on)\s+` + NOT_ING + String.raw`\w+ing\b`,
  '15-1-2': String.raw`^\W*[A-Z]\w+ing\b[^,.;]{0,50},`,
  '17-1-1': String.raw`\bnot (all|every|always|necessarily|quite|entirely)\b`,
  '20-1-1': String.raw`\b(is|are|was|were|be|been|being)\s+(\w+ly\s+)?` + PP + String.raw`\b(\s+by\b)?`,
  '21-2-1': String.raw`\b(\w+er|more \w+|less \w+) than\b`,
  '21-2-3': String.raw`\bthe (most \w+|\w+est)\b`,
  '22-1-2': String.raw`\b[a-z]+ (who|whom|whose|which) \w+`,
  '22-2-1': String.raw`\bthe (place|day|time|reason|year|house|room|town|city|moment) (where|when|why)\b`,
  '22-5-1': String.raw`\b(what|all that) (I|you|he|she|we|they|it) \w+`,
};

// Patterns that match almost anything are kept but ranked last.
const WEAK = new Set(['1-1-2', '3-2-1', '19-1-2', '12-1-1', '16-2-1', '10-2-3']);

let compiled = null;
function rules() {
  if (compiled) return compiled;
  compiled = [];
  for (const c of CHAPTERS) {
    for (const s of c.sections) {
      const src = [s.pattern, EXTRA[s.id]].filter(Boolean);
      for (const p of src) {
        try {
          compiled.push({ re: new RegExp(p, 'i'), section: { ...s, chapter: c.n, chapterTitle: c.title } });
        } catch {
          /* skip a pattern this browser can't compile */
        }
      }
    }
  }
  return compiled;
}

/** Up to `max` course sections whose grammar appears in the sentence: [{section, match}] */
export function detectGrammar(sentence, max = 3) {
  const text = sentence.replace(/\s+/g, ' ').trim();
  const found = new Map();
  for (const { re, section } of rules()) {
    const m = text.match(re);
    if (!m) continue;
    const score = m[0].length - (WEAK.has(section.id) ? 100 : 0);
    const prev = found.get(section.id);
    if (!prev || prev.score < score) found.set(section.id, { section, match: m[0], score });
  }
  // "If I had known" is 仮定法過去完了, not a plain 過去完了 / 従属接続詞 example.
  if ([...found.keys()].some((id) => id.startsWith('4-'))) {
    found.delete('2-2-1');
    found.delete('3-2-1');
  }
  const list = [...found.values()].sort((a, b) => b.score - a.score);
  // One section per chapter keeps the list varied (e.g. not three kinds of relative clause).
  const out = [];
  const chapters = new Set();
  for (const x of list) {
    if (chapters.has(x.section.chapter)) continue;
    chapters.add(x.section.chapter);
    out.push(x);
    if (out.length >= max) break;
  }
  return out;
}
