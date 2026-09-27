// Reading-speed goal (default: 150 WPM with 80% comprehension), measured by passage training.

export const DEFAULT_GOAL = { wpm: 150, comp: 80 };

/** A passage-training result meets the goal on the first silent read (before any practice). */
export const achieved = (t, goal) => t.wpm1 >= goal.wpm && t.comp >= goal.comp;

export function recordTraining(stats, t) {
  const list = (stats.trainings ||= []);
  list.push({ ...t, t: Date.now() });
  if (list.length > 500) list.splice(0, list.length - 500);
}

export function trainingSummary(stats, goal) {
  const list = stats.trainings || [];
  const recent = list.slice(-5);
  const avg = (f) => (recent.length ? Math.round(recent.reduce((a, t) => a + f(t), 0) / recent.length) : 0);
  let streak = 0;
  for (let k = list.length - 1; k >= 0 && achieved(list[k], goal); k--) streak++;
  return {
    list,
    latest: list[list.length - 1] || null,
    count: list.length,
    hits: list.filter((t) => achieved(t, goal)).length,
    streak,
    avgWpm1: avg((t) => t.wpm1),
    avgWpm2: avg((t) => t.wpm2),
    avgComp: avg((t) => t.comp),
    // Three passes in a row: time to aim higher.
    raiseTo: streak >= 3 ? goal.wpm + 25 : null,
  };
}

/** RSVP reading: how often "よく分かった" was answered while reading at or above the goal speed. */
export function rsvpSummary(stats, goal, n = 20) {
  const fast = (stats.checks || []).filter((c) => c.wpm >= goal.wpm).slice(-n);
  return { total: fast.length, good: fast.filter((c) => c.rating === 3).length };
}
