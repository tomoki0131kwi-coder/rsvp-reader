// 練習 tab: the training menu beyond reading, grouped by what each practice builds
// (意味理解 / 音声知覚 / 文章化 / 概念化・実践力).
import { chooseMaterial } from './shadowing.js';
import { startComposition, status as compositionStatus } from './composition.js';
import { startSpeech } from './speaking.js';
import { startGrammar, grammarStatus } from './grammarView.js';
import { sttSupported } from './stt.js';
import { esc } from './ui.js';

const WEEK = 7 * 86400000;

const PRACTICES = [
  { id: 'grammar', icon: '📘', skill: '文法', title: '英文法コース', desc: '本を読む → 要点 → 確認問題 → 実例。間違えた問題は忘れかけた頃に復習' },
  { id: 'training', icon: '📝', skill: '意味理解', title: '1文章トレーニング', desc: '黙読の時間を計り、チャンク確認・音読のあと再び黙読。読む速さの伸びを測る' },
  { id: 'shadowing', icon: '🎧', skill: '音声知覚', title: 'シャドーイング', desc: 'ネイティブ音声を聞く → スクリプト確認 → オーバーラッピング → シャドーイング' },
  { id: 'repeating', icon: '🔁', skill: '音声知覚', title: 'リピーティング', desc: '1文ずつ聞いて、文字を見ずにそのまま繰り返す' },
  { id: 'composition', icon: '✍️', skill: '文章化', title: '瞬間英作文', desc: '日本語を見て、すぐに英語で言う。4,000文・5レベル' },
  { id: 'speech', icon: '🗣', skill: '概念化・実践力', title: '1分間スピーチ', desc: 'お題について「結論→理由→結論」で1分間話し、自己採点して改善' },
];

/** Practice records from this week, by type. */
function weekly(host) {
  const since = Date.now() - WEEK;
  const list = (host.stats.practice || []).filter((p) => p.t >= since);
  const trainings = (host.stats.trainings || []).filter((t) => t.t >= since);
  const by = (type) => list.filter((p) => p.type === type);
  return { grammar: by('grammar'), training: trainings, shadowing: by('shadowing'), repeating: by('repeating'), composition: by('composition'), speech: by('speech') };
}

function summary(id, recs) {
  if (!recs.length) return '今週はまだ';
  const last = recs[recs.length - 1];
  if (id === 'grammar') return `今週 ${recs.filter((r) => r.kind === 'section').length}節 · 復習${recs.filter((r) => r.kind === 'review').length}回`;
  if (id === 'training') return `今週 ${recs.length}回 · 前回 ${last.wpm1}→${last.wpm2} WPM`;
  if (id === 'composition') return `今週 ${recs.reduce((a, r) => a + r.n, 0)}問 · 前回 正解${last.correct}/${last.n}`;
  if (id === 'speech') return `今週 ${recs.length}回 · 前回 ${last.score}/5点・${last.words}語`;
  return `今週 ${recs.length}回${last.score != null ? ` · 前回 一致率${last.score}%` : ''}`;
}

export function viewPractice(host) {
  const w = weekly(host);
  const groups = [...new Set(PRACTICES.map((p) => p.skill))];
  return `<header class="top"><div><h1>練習</h1><p class="muted">読む・聞く・話す・書くを1つのアプリで</p></div></header>
    ${groups
      .map((g) => `<h2 class="section">${g}</h2>${PRACTICES.filter((p) => p.skill === g)
        .map((p) => `<div class="card practice-card">
          <div class="pc-main"><div class="pc-title">${p.icon} ${esc(p.title)}</div>
            <div class="pc-desc">${esc(p.desc)}</div>
            <div class="pc-sum" ${p.id === 'composition' ? 'data-comp-status' : p.id === 'grammar' ? 'data-grammar-status' : ''}>${esc(summary(p.id, w[p.id]))}</div></div>
          <button class="btn primary" data-practice="${p.id}">始める</button></div>`)
        .join('')}`)
      .join('')}
    ${sttSupported ? '' : '<p class="notice small">この端末・ブラウザは音声認識に対応していないため、話す練習は録音と自己評価で行います（Android の Chrome なら自動で答え合わせできます）。</p>'}
    <p class="credits muted">音声: VOA Learning English（パブリックドメイン）／ 英作文の例文: <a href="https://tatoeba.org/" target="_blank" rel="noopener">Tatoeba</a>（CC BY 2.0 FR）</p>`;
}

export function bindPractice(view, host) {
  view.querySelectorAll('[data-practice]').forEach((b) => b.addEventListener('click', () => startPractice(b.dataset.practice, host)));
  const comp = view.querySelector('[data-comp-status]');
  if (comp) {
    compositionStatus().then((s) => {
      if (s.due) comp.textContent += ` · 復習 ${s.due}文`;
    });
  }
  const gram = view.querySelector('[data-grammar-status]');
  if (gram) {
    grammarStatus().then((s) => {
      gram.textContent = `${s.done}/${s.total}節${s.due ? ` · 復習 ${s.due}問` : ''}`;
    });
  }
}

/** Open a practice by id (also used by the 今日 checklist). */
export function startPractice(id, host) {
  if (id === 'grammar') return startGrammar(host);
  if (id === 'training') return host.openTraining();
  if (id === 'shadowing' || id === 'repeating') return chooseMaterial(host, id);
  if (id === 'composition') return startComposition(host);
  if (id === 'speech') return startSpeech(host);
}
