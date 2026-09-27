// ②-3 概念化・実践力: 1分間スピーチ. Pick a topic, prepare with the 結論→理由→結論 frame, speak for 60 s
// (transcribed, or recorded when recognition isn't available), then score yourself on 5 points and retry.
import { listen, sttSupported, sttErrorText, STT_NOTE } from './stt.js';
import { startRecording, recordingSupported } from './recorder.js';
import { normWords } from './textdiff.js';
import { $, esc, icons, pushLayer, popLayer, toast } from './ui.js';

const SPEECH_SEC = 60;

export const TOPICS = [
  // Lv1: everyday life
  [1, 'self', '自己紹介をしてください', 'Introduce yourself.'],
  [1, 'food', '好きな食べ物とその理由', 'What is your favorite food, and why?'],
  [1, 'weekend', '週末の過ごし方', 'How do you usually spend your weekends?'],
  [1, 'season', '一番好きな季節', 'Which season do you like best, and why?'],
  [1, 'hometown', 'あなたの出身地を紹介してください', 'Tell me about your hometown.'],
  [1, 'hobby', 'あなたの趣味', 'What is your hobby?'],
  [1, 'morning', '朝のルーティン', 'Describe your morning routine.'],
  [1, 'friend', '親しい友人について', 'Tell me about a close friend.'],
  [1, 'travel', '行ってみたい国', 'Which country would you like to visit, and why?'],
  [1, 'book', '最近読んだ本や見た映画', 'Talk about a book you read or a movie you saw recently.'],
  [1, 'pet', '犬派？猫派？', 'Are you a dog person or a cat person?'],
  [1, 'childhood', '子どもの頃の思い出', 'Tell me about a memory from your childhood.'],
  // Lv2: opinions
  [2, 'english', 'なぜ英語を勉強しているのか', 'Why are you studying English?'],
  [2, 'city', '都会と田舎、住むならどちら？', 'Would you rather live in a city or in the countryside?'],
  [2, 'phone', '子どもにスマートフォンを持たせるべきか', 'Should children have smartphones?'],
  [2, 'reading', '紙の本と電子書籍、どちらが良いか', 'Paper books or e-books: which is better?'],
  [2, 'exercise', '運動を習慣にするためのアドバイス', 'Give advice on making exercise a habit.'],
  [2, 'uniform', '学校の制服は必要か', 'Are school uniforms necessary?'],
  [2, 'cooking', '外食と自炊、どちらを選ぶか', 'Eating out or cooking at home: which do you prefer?'],
  [2, 'sns', 'SNSの良い点と悪い点', 'What are the good and bad points of social media?'],
  [2, 'money', 'もし100万円もらったら何に使うか', 'What would you do with one million yen?'],
  [2, 'skill', '今、身につけたいスキル', 'What skill would you like to learn now?'],
  [2, 'sleep', '早起きは得か', 'Is it better to be an early bird?'],
  [2, 'japan', '外国人におすすめしたい日本の場所', 'Which place in Japan would you recommend to visitors?'],
  // Lv3: work & society
  [3, 'remote', 'リモートワークに賛成か反対か', 'Are you for or against remote work?'],
  [3, 'ai', 'AIは仕事をどう変えるか', 'How will AI change the way we work?'],
  [3, 'meeting', '良い会議にするためのコツ', 'What makes a meeting productive?'],
  [3, 'leader', '良いリーダーの条件', 'What makes a good leader?'],
  [3, 'failure', '失敗から学んだこと', 'Tell me about a failure and what you learned from it.'],
  [3, 'job', '仕事を選ぶときに一番大切なこと', 'What matters most when choosing a job?'],
  [3, 'environment', '個人にできる環境対策', 'What can individuals do for the environment?'],
  [3, 'aging', '高齢化社会への対策', 'How should Japan deal with its aging society?'],
  [3, 'product', '最近気に入っている商品やサービスを売り込んでください', 'Pitch a product or service you like.'],
  [3, 'tourism', '観光客が増えることの良い点と課題', 'What are the benefits and problems of more tourists?'],
  [3, 'education', '大学教育は無償化すべきか', 'Should university education be free?'],
  [3, 'change', 'あなたの会社（学校）で一つ変えるなら', 'If you could change one thing at your company or school, what would it be?'],
];

const RUBRIC = [
  '最初に結論（答え）を言えた',
  '理由・具体例を挙げられた（できれば3つ）',
  '最後にもう一度結論でまとめた',
  '1分間、止まらずに話し続けられた',
  '最近学んだ単語・表現を使えた',
];

// Signposts of the 結論→理由→結論 structure.
const MARKERS = [
  ['結論', /\b(i think|i believe|in my opinion|i'd say|my answer is|i prefer|i like|i would)\b/],
  ['理由', /\b(because|the reason|first|second|third|firstly|secondly|also|another)\b/],
  ['具体例', /\b(for example|for instance|such as|like when)\b/],
  ['まとめ', /\b(so|that's why|in conclusion|to sum up|overall|therefore)\b/],
];

function overlay(close) {
  let el = $('#practice');
  if (!el) {
    el = document.createElement('section');
    el.id = 'practice';
    el.className = 'training';
    document.body.append(el);
  }
  el.hidden = false;
  document.body.classList.add('training-open');
  pushLayer(() => {
    el.hidden = true;
    document.body.classList.remove('training-open');
    close?.();
  });
  return el;
}

/** @param host {settings, stats, recordPractice(rec)} */
export function startSpeech(host) {
  let stt = null;
  let timer = null;
  let rec = null;
  const el = overlay(() => {
    stt?.stop();
    rec?.stop();
    clearInterval(timer);
  });
  const history = (id) => (host.stats.practice || []).filter((p) => p.type === 'speech' && p.topic === id);
  let topic = null;
  let memo = '';
  let level = 1;

  const header = (t) => `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button><span>${t}</span><span class="rv-spacer"></span></header>`;
  const bindBack = () => (el.querySelector('[data-a=back]').onclick = () => popLayer());

  function choose() {
    el.innerHTML = `${header('1分間スピーチ')}
      <div class="tr-body">
        <p class="tr-hint">お題について英語で1分間話します。「結論 → 理由 → 結論」の型で、シンプルに話すのがコツです。</p>
        <div class="seg">${[1, 2, 3].map((l) => `<button data-lv="${l}" class="${level === l ? 'on' : ''}">${['', '身近な話題', '意見を言う', '仕事・社会'][l]}</button>`).join('')}</div>
        <button class="btn primary wide" data-a="random">🎲 おまかせで出題</button>
        <div class="menu">${TOPICS.filter((t) => t[0] === level)
          .map((t) => {
            const h = history(t[1]);
            const best = h.length ? Math.max(...h.map((x) => x.score)) : null;
            return `<button data-topic="${t[1]}">${esc(t[2])}<br><small class="muted">${esc(t[3])}${best != null ? ` · 最高 ${best}/5点` : ''}</small></button>`;
          })
          .join('')}</div>
      </div>`;
    bindBack();
    el.querySelectorAll('[data-lv]').forEach((b) =>
      b.addEventListener('click', () => {
        level = Number(b.dataset.lv);
        choose();
      }),
    );
    el.querySelector('[data-a=random]').onclick = () => {
      const pool = TOPICS.filter((t) => t[0] === level);
      topic = pool[Math.floor(Math.random() * pool.length)];
      prepare();
    };
    el.querySelectorAll('[data-topic]').forEach((b) =>
      b.addEventListener('click', () => {
        topic = TOPICS.find((t) => t[1] === b.dataset.topic);
        prepare();
      }),
    );
  }

  function prepare() {
    const last = history(topic[1]).slice(-1)[0];
    el.innerHTML = `${header('準備')}
      <div class="tr-body">
        <div class="sp-topic"><b>${esc(topic[3])}</b><small>${esc(topic[2])}</small></div>
        <ol class="sp-frame">
          <li><b>結論</b> I think … / My answer is …</li>
          <li><b>理由</b> First, … Second, … Third, …（For example, …）</li>
          <li><b>結論</b> So, … / That's why …</li>
        </ol>
        ${last?.note ? `<div class="notice small">前回の改善点: ${esc(last.note)}</div>` : ''}
        <label class="stack small">メモ（日本語でも英語でも）<textarea class="sp-memo" rows="4" placeholder="例: 結論=猫派 / 理由1 静か 2 一人で留守番できる 3 かわいい">${esc(memo)}</textarea></label>
        ${sttSupported ? `<p class="muted small">話した内容を文字にして振り返ります。${STT_NOTE}</p>` : `<p class="muted small">この端末では音声認識が使えないため、録音して聞き返します（録音は端末内だけに保存されます）。</p>`}
      </div>
      <div class="tr-actions"><button class="btn primary wide" data-a="go">${icons.play}${SPEECH_SEC}秒スピーチを始める</button>
        <button class="link-btn center" data-a="other">別のお題にする</button></div>`;
    bindBack();
    el.querySelector('.sp-memo').addEventListener('input', (e) => (memo = e.target.value));
    el.querySelector('[data-a=go]').onclick = speak;
    el.querySelector('[data-a=other]').onclick = choose;
  }

  async function speak() {
    let left = SPEECH_SEC;
    const t0 = performance.now();
    let transcript = '';
    let recording = null;
    el.innerHTML = `${header('スピーチ中')}
      <div class="tr-body">
        <div class="sp-topic"><b>${esc(topic[3])}</b></div>
        <div class="sp-timer"><b>${left}</b><small>秒</small></div>
        ${memo ? `<div class="sp-memo-view small muted">${esc(memo)}</div>` : ''}
        <div class="sp-live"></div>
      </div>
      <div class="tr-actions"><button class="btn ghost wide" data-a="stop">終わる</button></div>`;
    bindBack();
    const live = el.querySelector('.sp-live');
    const end = async () => {
      clearInterval(timer);
      timer = null;
      const elapsed = (performance.now() - t0) / 1000;
      if (stt) {
        const s = stt;
        stt = null;
        s.stop();
        return; // review() runs from onEnd with the final transcript
      }
      if (rec) {
        const r = rec;
        rec = null;
        recording = await r.stop();
      }
      review({ transcript, recording, elapsed });
    };
    if (sttSupported) {
      stt = listen({
        continuous: true,
        onText: (fin, interim) => (live.innerHTML = `${esc(fin)} <span class="muted">${esc(interim)}</span>`),
        onEnd: (text) => {
          clearInterval(timer);
          timer = null;
          stt = null;
          transcript = text;
          review({ transcript, recording: null, elapsed: Math.min(SPEECH_SEC, (performance.now() - t0) / 1000) });
        },
        onError: (code) => {
          toast(sttErrorText(code), 5000);
        },
      });
    } else if (recordingSupported) {
      try {
        rec = await startRecording();
        live.textContent = '録音中…';
      } catch {
        toast('マイクを使えませんでした');
      }
    }
    timer = setInterval(() => {
      left--;
      const t = el.querySelector('.sp-timer b');
      if (t) t.textContent = Math.max(0, left);
      if (left <= 0) end();
    }, 1000);
    el.querySelector('[data-a=stop]').onclick = end;
  }

  function review({ transcript, recording, elapsed }) {
    const words = normWords(transcript);
    const wpm = elapsed > 5 ? Math.round(words.length / (elapsed / 60)) : 0;
    const lower = transcript.toLowerCase();
    const found = MARKERS.map(([name, re]) => [name, re.test(lower)]);
    const prev = history(topic[1]).slice(-1)[0];
    el.innerHTML = `${header('振り返り')}
      <div class="tr-body">
        <div class="sp-topic"><b>${esc(topic[3])}</b></div>
        ${transcript ? `<dl class="facts"><div><dt>話した語数</dt><dd>${words.length}語</dd></div><div><dt>速さ</dt><dd>${wpm ? `${wpm} WPM` : '—'}</dd></div>
          <div><dt>使った語の種類</dt><dd>${new Set(words).size}語</dd></div><div><dt>前回</dt><dd>${prev ? `${prev.words}語・${prev.score}/5点` : '—'}</dd></div></dl>
          <div class="sp-markers">${found.map(([n, ok]) => `<span class="chip ${ok ? 'on' : ''}">${ok ? '✓' : '·'} ${n}</span>`).join('')}</div>
          <div class="tr-text sp-transcript">${esc(transcript)}</div>` : ''}
        ${recording ? `<audio controls src="${recording}" class="rec-audio"></audio>` : ''}
        ${!transcript && !recording ? '<p class="muted">うまく聞き取れませんでした。イヤホンのマイクを使うか、静かな場所でもう一度試してください。</p>' : ''}
        <h3 class="sub">自己採点（5点満点）</h3>
        <div class="rubric">${RUBRIC.map((r, i) => `<label><input type="checkbox" data-r="${i}"> ${r}</label>`).join('')}</div>
        <label class="stack small">改善点（次回に表示されます）<textarea class="sp-note" rows="2" placeholder="例: 理由が2つしか言えなかった。because の後が続かない"></textarea></label>
      </div>
      <div class="tr-actions"><button class="btn ghost wide" data-a="retry">記録してもう一度話す</button><button class="btn primary wide" data-a="save">記録して終わる</button></div>`;
    bindBack();
    const save = () => {
      const score = el.querySelectorAll('[data-r]:checked').length;
      const note = el.querySelector('.sp-note').value.trim();
      host.recordPractice({ type: 'speech', topic: topic[1], words: words.length, wpm, score, note });
      return score;
    };
    el.querySelector('[data-a=save]').onclick = () => {
      const score = save();
      toast(`${score}/5点で記録しました`);
      popLayer();
    };
    el.querySelector('[data-a=retry]').onclick = () => {
      save();
      prepare();
    };
  }

  choose();
}
