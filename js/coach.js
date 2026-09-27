// Comprehension self-checks and speed / level suggestions.

export const RATINGS = [
  { r: 3, label: 'よく分かった', emoji: '😀' },
  { r: 2, label: 'だいたい分かった', emoji: '🙂' },
  { r: 1, label: '難しかった', emoji: '😵' },
];

/** Percent choices for 多聴 (listening without text), where the target is 80%. */
export const COMP_LEVELS = [100, 80, 60, 40, 20];
export const LISTEN_GOAL = 80;
export const ratingFromPercent = (p) => (p >= 80 ? 3 : p >= 60 ? 2 : 1);

const WORDS_PER_CHECK_AT_CHAPTER = 300; // ask at a chapter end once this much has been read
const WORDS_PER_CHECK = 2500; // ...or after this much reading without a chapter break

export function shouldCheck(wordsSinceCheck, crossedChapter) {
  return (crossedChapter && wordsSinceCheck >= WORDS_PER_CHECK_AT_CHAPTER) || wordsSinceCheck >= WORDS_PER_CHECK;
}

export function record(stats, check) {
  const list = (stats.checks ||= []);
  list.push({ ...check, t: Date.now() });
  if (list.length > 300) list.splice(0, list.length - 300);
}

/**
 * What to suggest after a check, based on the last few checks for the same book.
 * final: the book was just finished (no point changing speed mid-book then).
 * Returns {kind: 'faster'|'slower'|'levelUp'|'levelDown'|'keep', msg, wpm?, level?}.
 */
export function suggest(stats, { bookId, level, wpm, final = false }) {
  const recent = (stats.checks || []).filter((c) => c.bookId === bookId).slice(-3);
  const last = recent[recent.length - 1];
  if (!last) return { kind: 'keep', msg: '' };
  const hasLevel = typeof level === 'number';
  const allGood = recent.length >= 2 && recent.every((c) => c.rating === 3);
  const hards = recent.filter((c) => c.rating === 1).length;

  if (last.rating === 3 && allGood) {
    if (!final && wpm < 350) return { kind: 'faster', wpm: wpm + 25, msg: '続けてよく分かっています。少しだけ速くしてみましょう。' };
    if (hasLevel && level < 5) return { kind: 'levelUp', level: level + 1, msg: `この速さでよく分かっています。Lv${level + 1}の本にも挑戦できそうです。` };
    return { kind: 'keep', msg: 'とても順調です。この調子で読み進めましょう。' };
  }
  if (last.rating === 1) {
    if (hards >= 2) {
      if (!final && wpm > 150) return { kind: 'slower', wpm: Math.max(100, wpm - 50), msg: '難しい状態が続いています。速度を落とすと理解しやすくなります。' };
      if (hasLevel && level > 0) return { kind: 'levelDown', level: level - 1, msg: `多読は「やさしい本をたくさん」が基本です。Lv${level - 1}の本に切り替えてみましょう。` };
    } else if (!final && wpm > 150) {
      return { kind: 'slower', wpm: wpm - 25, msg: '少し速度を落としてみましょう。分からない所は一時停止して辞書や和訳で確認できます。' };
    }
    return { kind: 'keep', msg: '分からない所は一時停止して、辞書や和訳で確認しましょう。' };
  }
  if (last.rating === 2) return { kind: 'keep', msg: 'だいたい分かれば十分です。多読では細部より話の流れを楽しみましょう。' };
  return { kind: 'keep', msg: 'いい調子です。' };
}

/** 多聴 comprehension over the last n listening checks. */
export function listenSummary(stats, n = 10) {
  const list = (stats.checks || []).filter((c) => c.mode === 'listen').slice(-n);
  const avg = list.length ? Math.round(list.reduce((a, c) => a + c.comp, 0) / list.length) : 0;
  return { total: list.length, avg, hits: list.filter((c) => c.comp >= LISTEN_GOAL).length };
}

/** Counts of each rating over the last n checks, for the stats screen. */
export function recentSummary(stats, n = 20) {
  const list = (stats.checks || []).filter((c) => c.mode !== 'listen').slice(-n);
  return { total: list.length, counts: Object.fromEntries(RATINGS.map((x) => [x.r, list.filter((c) => c.rating === x.r).length])) };
}
