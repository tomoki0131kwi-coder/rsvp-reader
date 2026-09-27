// Reading statistics for extensive reading (多読): words, time, streaks, finished books.

export const MILESTONES = [10000, 50000, 100000, 300000, 500000, 1000000, 2000000, 3000000, 5000000, 10000000];

export function emptyStats() {
  return { days: {}, books: {}, finished: [] };
}

export function dayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function addReading(stats, bookId, words, ms) {
  if (words <= 0 && ms <= 0) return;
  const k = dayKey();
  const day = (stats.days[k] ||= { w: 0, ms: 0 });
  day.w += words;
  day.ms += ms;
  stats.books[bookId] = (stats.books[bookId] || 0) + words;
}

/** 多聴 (listening without text) is counted apart from reading. */
export function addListening(stats, words, ms) {
  if (words <= 0 && ms <= 0) return;
  const day = (stats.days[dayKey()] ||= { w: 0, ms: 0 });
  day.lw = (day.lw || 0) + words;
  day.lms = (day.lms || 0) + ms;
}

export function addReviews(stats, n) {
  const day = (stats.days[dayKey()] ||= { w: 0, ms: 0 });
  day.r = (day.r || 0) + n;
}

export function markFinished(stats, book) {
  if (stats.finished.some((f) => f.id === book.id)) return false;
  stats.finished.push({ id: book.id, title: book.title, words: book.words, date: dayKey() });
  return true;
}

export function summary(stats, goal) {
  let words = 0;
  let ms = 0;
  let reviews = 0;
  let listenWords = 0;
  let listenMs = 0;
  for (const d of Object.values(stats.days)) {
    words += d.w;
    ms += d.ms;
    reviews += d.r || 0;
    listenWords += d.lw || 0;
    listenMs += d.lms || 0;
  }
  const today = stats.days[dayKey()] || { w: 0, ms: 0 };

  let streak = 0;
  const d = new Date();
  if (!stats.days[dayKey(d)]?.w) d.setDate(d.getDate() - 1); // today not started yet: keep yesterday's streak
  while (stats.days[dayKey(d)]?.w > 0) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  const recent = [];
  const r = new Date();
  r.setDate(r.getDate() - 13);
  for (let i = 0; i < 14; i++) {
    const k = dayKey(r);
    recent.push({ key: k, day: r.getDate(), dow: r.getDay(), w: stats.days[k]?.w || 0 });
    r.setDate(r.getDate() + 1);
  }

  const next = MILESTONES.find((m) => m > words) || words;
  const prev = [...MILESTONES].reverse().find((m) => m <= words) || 0;
  return {
    words,
    ms,
    reviews,
    listenWords,
    listenMs,
    wpm: ms > 60000 ? Math.round(words / (ms / 60000)) : 0,
    today,
    goal,
    streak,
    recent,
    finished: stats.finished,
    milestone: { prev, next, ratio: next === prev ? 1 : (words - prev) / (next - prev) },
  };
}
