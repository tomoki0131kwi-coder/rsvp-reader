// 英文法コース screens: course map, section flow (読む → 要点 → 確認問題 → 実例 → まとめ), the scanned-book viewer,
// full-text search, spaced review and chapter tests.
import * as G from './grammar.js';
import * as db from './db.js';
import { BOOK, CHAPTERS } from './grammarCourse.js';
import { utterance, NO_VOICE_HELP } from './speech.js';
import { $, esc, icons, pushLayer, popLayer, toast } from './ui.js';

const PASS = 0.8;
const SELF = [
  { v: 3, mark: '◎', label: 'しっかり理解' },
  { v: 2, mark: '○', label: 'だいたい' },
  { v: 1, mark: '△', label: 'あやしい' },
];
const selfMark = (v) => SELF.find((x) => x.v === v)?.mark || '';
const shuffle = (xs) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const top = (title, sub = '') =>
  `<header class="rv-top"><button class="icon-btn" data-a="back" aria-label="戻る">${icons.back}</button><span class="tr-title">${title}</span><span class="rv-spacer">${sub}</span></header>`;

async function say(text, settings) {
  const u = await utterance(text, settings.voice);
  if (typeof u === 'string') return toast(u === 'no-voice' ? NO_VOICE_HELP : 'この端末は音声読み上げに対応していません', 5000);
  u.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/** Status line for the 練習 card. */
export async function grammarStatus() {
  await G.load();
  return G.summary();
}

/** @param host {settings, library, loadText(b), recordPractice(rec)} */
export async function startGrammar(host, { sectionId } = {}) {
  await G.load();
  let el = $('#grammar');
  if (!el) {
    el = document.createElement('section');
    el.id = 'grammar';
    el.className = 'training';
    document.body.append(el);
  }
  el.hidden = false;
  document.body.classList.add('training-open');
  const stack = [() => map()]; // the course map is the base screen
  pushLayer(() => {
    el.hidden = true;
    document.body.classList.remove('training-open');
    speechSynthesis.cancel();
    host.rerender?.();
  });
  /** Show a sub-screen; Android back returns to the previous one. */
  const go = (render) => {
    stack.push(render);
    pushLayer(() => {
      stack.pop();
      stack[stack.length - 1]?.();
    });
    render();
  };
  /** Swap the current sub-screen for another (same back-button depth). */
  const replace = (render) => {
    stack[stack.length - 1] = render;
    render();
  };
  const bindBack = () => (el.querySelector('[data-a=back]').onclick = () => popLayer());
  let book = await G.loadBook();

  // ---------- course map
  let openCh = (G.nextSection() || G.SECTIONS[0]).chapter; // the chapter shown open
  function map() {
    const s = G.summary();
    const next = G.nextSection();
    el.innerHTML = `${top('英文法コース')}
      <div class="tr-body">
        <div class="gm-book card">
          <div><b>📘 ${esc(BOOK.title)}</b><small>${esc(BOOK.author)}（${esc(BOOK.publisher)}）</small></div>
          ${book ? `<p class="small muted">スキャンした本（${book.pages.length}ページ）をこの端末で読めます。</p>
              <div class="btn-row"><button class="btn ghost" data-a="search">${icons.search}全文検索</button><button class="btn ghost" data-a="bookmenu">本の管理</button></div>`
            : `<p class="small">本の説明は本で読みます。スキャンした本を取り込むと、アプリ内でページを開いたり全文検索したりできます（紙の本でも学習できます）。</p>
              <div class="btn-row"><button class="btn ghost" data-a="import">${icons.file}本を取り込む</button></div>`}
        </div>
        <dl class="facts"><div><dt>進み具合</dt><dd>${s.done} / ${s.total}節</dd></div><div><dt>復習</dt><dd>${s.due}問${s.shaky ? ` <small>△${s.shaky}節</small>` : ''}</dd></div></dl>
        <div class="btn-row">${next ? `<button class="btn primary" data-sec="${next.id}">${icons.play}次の節 ${next.id}</button>` : ''}
          <button class="btn ghost" data-a="review" ${s.due ? '' : 'disabled'}>復習する（${s.due}問）</button></div>
        ${CHAPTERS.map((c, k) => {
          const done = c.sections.filter((x) => G.sectionState(x.id).done).length;
          const tests = G.cached().tests[c.n] || [];
          const best = tests.length ? Math.max(...tests.map((t) => t.score)) : null;
          const shaky = c.sections.filter((x) => G.sectionState(x.id).self === 1).length;
          const nq = c.sections.reduce((a, x) => a + x.questions.length, 0);
          const open = openCh === c.n;
          return `${k === 0 || CHAPTERS[k - 1].part !== c.part ? `<h2 class="section gm-part">${esc(c.part)}</h2>` : ''}
            <div class="card gm-list${open ? ' open' : ''}">
              <button class="gm-ch" data-ch="${c.n}" aria-expanded="${open}"><span class="gm-ch-t">第${c.n}章 ${esc(c.title)}</span>
                <small>${done}/${c.sections.length}節${shaky ? ` · △${shaky}` : ''}${best != null ? ` · テスト${best}%` : ''}</small>
                <i class="gm-bar"><b style="width:${(done / c.sections.length) * 100}%"></b></i></button>
              ${open ? `<button class="gm-row gm-sub" data-intro="${c.n}"><span class="gm-id">導入</span><span class="gm-t">目次・イントロ</span><small>p.${c.toc.book}–${c.intro.book[1]}</small></button>
              ${c.sections.map((x) => {
                const st = G.sectionState(x.id);
                return `<button class="gm-row${st.done ? ' done' : ''}" data-sec="${x.id}"><span class="gm-id">${x.id}</span><span class="gm-t">${esc(x.title)}</span>
                  <small>${st.done ? `${selfMark(st.self)} ${st.score ?? ''}${st.score != null ? '%' : ''}` : `p.${x.book}`}</small></button>`;
              }).join('')}
              <button class="gm-row gm-sub" data-test="${c.n}"><span class="gm-id">✅</span><span class="gm-t">章末テスト（${nq}問から${Math.min(20, nq)}問・目標${PASS * 100}%）</span></button>` : ''}
            </div>`;
        }).join('')}
        <p class="muted small">要点と確認問題はこのアプリのオリジナルです。本の解説・例文は本で読んでください。各節は［応用］［発展］の項目まで含めて読みます（難しければ1周目は飛ばして、2周目で読んでもかまいません）。</p>
      </div>`;
    bindBack();
    el.querySelectorAll('[data-sec]').forEach((b) => b.addEventListener('click', () => go(() => sectionFlow(G.section(b.dataset.sec)))));
    el.querySelectorAll('[data-intro]').forEach((b) =>
      b.addEventListener('click', () => {
        const c = G.chapter(Number(b.dataset.intro));
        if (!book) return toast(`本の p.${c.toc.book}–${c.intro.book[1]} を読みましょう`);
        const at = G.pdfIndexOfBookPage(book, c.toc.book);
        openViewer(at, { title: `第${c.n}章 ${c.title}`, range: [at, at + (c.intro.pdf[1] - c.toc.pdf)] });
      }),
    );
    el.querySelectorAll('[data-ch]').forEach((b) =>
      b.addEventListener('click', () => {
        const n = Number(b.dataset.ch);
        openCh = openCh === n ? 0 : n;
        const y = el.querySelector('.tr-body').scrollTop;
        map();
        el.querySelector('.tr-body').scrollTop = y;
      }),
    );
    el.querySelectorAll('[data-test]').forEach((b) => b.addEventListener('click', () => go(() => chapterTest(Number(b.dataset.test)))));
    el.querySelector('[data-a=review]').onclick = () => go(review);
    el.querySelector('[data-a=search]')?.addEventListener('click', () => go(searchScreen));
    el.querySelector('[data-a=import]')?.addEventListener('click', () => go(importScreen));
    el.querySelector('[data-a=bookmenu]')?.addEventListener('click', () => go(importScreen));
  }

  // ---------- importing the book pack
  function importScreen() {
    el.innerHTML = `${top('本の取り込み')}
      <div class="tr-body">
        ${book ? `<div class="card"><b>取り込み済み</b><p class="small muted">${esc(book.title)} · ${book.pages.length}ページ · ${new Date(book.importedAt).toLocaleDateString('ja-JP')}</p>
          <div class="btn-row"><button class="btn ghost" data-a="pick">取り込み直す</button><button class="btn ghost danger-text" data-a="remove">この端末から削除</button></div></div>` : ''}
        <div class="card"><b>取り込み方</b>
          <ol class="gm-steps">
            <li>PC で <code>python tools/book_pack.py "スキャンしたPDF"</code> を実行します（ページを軽い画像にし、文字を検索用に取り出します）。</li>
            <li>できた <code>tools/.cache/book.rsvpbook</code>（約125MB）を USB や Google ドライブでスマホにコピーします。</li>
            <li>下のボタンでそのファイルを選びます。</li></ol>
          <p class="small muted">本はこの端末の中だけに保存され、どこにも送信されません。バックアップにも含まれません（あなた自身が持っている本を、自分で読むために使ってください）。</p>
          ${book ? '' : '<button class="btn primary wide" data-a="pick">ファイルを選ぶ</button>'}
          <p class="gm-import-status small"></p></div>
      </div>`;
    bindBack();
    const status = el.querySelector('.gm-import-status');
    el.querySelectorAll('[data-a=pick]').forEach((b) =>
      b.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;
          status.textContent = `取り込み中…（${Math.round(file.size / 1e6)}MB）`;
          try {
            db.requestPersistence();
            book = await G.importPack(file);
            toast('本を取り込みました');
            popLayer();
          } catch (e) {
            status.textContent = `取り込めませんでした: ${e.message}`;
          }
        };
        input.click();
      }),
    );
    el.querySelector('[data-a=remove]')?.addEventListener('click', async () => {
      await G.removeBook();
      book = null;
      toast('この端末から本を削除しました');
      popLayer();
    });
  }

  // ---------- one section: 読む → 要点 → 確認問題 → 実例 → まとめ
  function sectionFlow(sec) {
    const STEPS = ['読む', '要点', '確認問題', '実例', 'まとめ'];
    const [a, z] = G.bookRange(sec);
    let step = 0;
    let quizResult = null;
    const head = () => `${top(`${sec.id} ${esc(sec.title)}`)}
      <ol class="tr-steps">${STEPS.map((t, i) => `<li class="${i === step ? 'on' : i < step ? 'done' : ''}"><i>${i + 1}</i>${t}</li>`).join('')}</ol>`;

    function read() {
      step = 0;
      const missing = book ? G.missingIn(book, sec) : 0;
      el.innerHTML = `${head()}<div class="tr-body">
          <div class="card gm-read"><div class="rv-label">第${sec.chapter}章 ${esc(G.chapter(sec.chapter).title)}</div>
            <div class="gm-sec-title">${sec.id} ${esc(sec.title)}</div>
            <div class="gm-pages">本の <b>p.${a}${z > a ? `–${z}` : ''}</b>（${z - a + 1}ページ）</div>
            ${missing ? `<p class="notice small">この節のページのうち${missing}ページがスキャンに含まれていないようです。紙の本で確認してください（白紙ページのこともあります）。</p>` : ''}
            <p class="small muted">説明と例文を読み、例文は声に出して読みましょう。［応用］［発展］の項目も含めて読みます。</p></div>
        </div>
        <div class="tr-actions">
          ${book ? `<button class="btn primary wide" data-a="open">${icons.book}本を開く（p.${a}から）</button>` : '<p class="small muted center">紙の本で読んでください（本を取り込むとアプリ内で開けます）</p>'}
          <button class="btn ${book ? 'ghost' : 'primary'} wide" data-a="next">読んだ → 要点へ</button></div>`;
      bindBack();
      el.querySelector('[data-a=open]')?.addEventListener('click', async () => {
        const start = G.sectionStart(book, sec);
        await openViewer(start, { title: `${sec.id} ${sec.title}`, range: [start, start + (sec.pdf[1] - sec.pdf[0])] });
        G.markSection(sec.id, { read: Date.now() });
      });
      el.querySelector('[data-a=next]').onclick = points;
    }

    function points() {
      step = 1;
      el.innerHTML = `${head()}<div class="tr-body">
          <div class="card"><div class="rv-label">要点（アプリのまとめ）</div>
            <ul class="gm-points">${sec.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
            <p class="small muted">詳しい説明・例外・例文は本の p.${a}${z > a ? `–${z}` : ''} にあります。思い出せない点があれば読み直しましょう。</p></div></div>
        <div class="tr-actions">${book ? `<button class="btn ghost wide" data-a="open">${icons.book}本をもう一度見る</button>` : ''}
          <button class="btn primary wide" data-a="next">確認問題へ（${sec.questions.length}問）</button></div>`;
      bindBack();
      el.querySelector('[data-a=open]')?.addEventListener('click', () => {
        const start = G.sectionStart(book, sec);
        openViewer(start, { title: `${sec.id} ${sec.title}`, range: [start, start + (sec.pdf[1] - sec.pdf[0])] });
      });
      el.querySelector('[data-a=next]').onclick = () => {
        step = 2;
        quiz(sec.questions.map((q, k) => ({ ...q, id: G.qid(sec, k), section: sec })), {
          title: `${sec.id} 確認問題`,
          header: head,
          onDone: (r) => {
            quizResult = r;
            examples();
          },
        });
      };
    }

    async function examples() {
      step = 3;
      el.innerHTML = `${head()}<div class="tr-body"><div class="card"><div class="rv-label">実例（収録している本から）</div>
          <div class="gm-ex">${sec.pattern ? '<p class="muted small">探しています…</p>' : '<p class="muted small">この節は形だけでは探しにくいため、実例はありません。本の例文を音読しましょう。</p>'}</div></div></div>
        <div class="tr-actions"><button class="btn primary wide" data-a="next">まとめへ</button></div>`;
      bindBack();
      el.querySelector('[data-a=next]').onclick = wrapUp;
      if (!sec.pattern) return;
      const box = el.querySelector('.gm-ex');
      const found = await findExamples(host, sec.pattern);
      if (!box.isConnected) return;
      box.innerHTML = found.length
        ? `<p class="muted small">本物の英文の中で、この文法がどう使われているかを見てみましょう。🔊で音声を聞けます。</p>
          ${found.map((f, k) => `<div class="gm-ex-item"><p>${f.html}</p><div class="gm-ex-src"><small>${esc(f.book)}</small><button class="icon-btn speak" data-say="${k}" aria-label="読み上げ">${icons.speaker}</button></div></div>`).join('')}
          <button class="link-btn" data-a="more">別の例を探す</button>`
        : '<p class="muted small">今回は見つかりませんでした（オフラインのときは探せません）。</p><button class="link-btn" data-a="more">別の本で探す</button>';
      box.querySelectorAll('[data-say]').forEach((b) => b.addEventListener('click', () => say(found[Number(b.dataset.say)].text, host.settings)));
      box.querySelector('[data-a=more]')?.addEventListener('click', examples);
    }

    function wrapUp() {
      step = 4;
      const st = G.sectionState(sec.id);
      const score = quizResult ? Math.round((quizResult.correct / quizResult.n) * 100) : st.score;
      el.innerHTML = `${head()}<div class="tr-body">
          <div class="card"><div class="rv-label">確認問題</div>
            <div class="tr-stat"><b>${quizResult ? `${quizResult.correct} / ${quizResult.n}` : '—'}</b><small>${score != null ? `${score}%` : ''}</small></div>
            <p class="small muted">間違えた問題は、忘れかけた頃に「復習」で出題されます。</p></div>
          <div class="card"><div class="rv-label">この節の理解度は？</div>
            <div class="gm-self">${SELF.map((x) => `<button class="rating" data-self="${x.v}"><span>${x.mark}</span>${x.label}</button>`).join('')}</div>
            <p class="small muted">「あやしい」の節はコース一覧に △ が付きます。後日、本を読み直しましょう。</p></div></div>`;
      bindBack();
      el.querySelectorAll('[data-self]').forEach((b) =>
        b.addEventListener('click', async () => {
          await G.markSection(sec.id, { done: Date.now(), self: Number(b.dataset.self), score });
          host.recordPractice({ type: 'grammar', kind: 'section', section: sec.id, n: quizResult?.n || 0, correct: quizResult?.correct || 0, score });
          finished();
        }),
      );
    }

    function finished() {
      const next = G.nextSection();
      el.innerHTML = `${top('')}<div class="rv-done"><div class="big-emoji">📘</div><h2>${sec.id} 完了</h2>
          <p class="muted small">${esc(sec.title)}</p>
          ${next ? `<button class="btn primary wide" data-a="next">次の節 ${next.id} ${esc(next.title)}</button>` : ''}
          <button class="btn ghost wide" data-a="map">コース一覧に戻る</button></div>`;
      bindBack();
      el.querySelector('[data-a=map]').onclick = () => popLayer();
      el.querySelector('[data-a=next]')?.addEventListener('click', () => replace(() => sectionFlow(next)));
    }

    read();
  }

  // ---------- questions (section check, review, chapter test)
  function quiz(items, { title, header, onDone }) {
    let k = 0;
    let correct = 0;

    function card() {
      if (k >= items.length) {
        G.save();
        return onDone({ n: items.length, correct });
      }
      const q = items[k];
      const head = header ? header() : top(esc(title));
      const src = `<small class="muted">${q.section.id} ${esc(q.section.title)}</small>`;
      let body = '';
      if (q.t === 'choice') {
        q.shown = shuffle(q.o);
        body = `<div class="gm-q">${esc(q.q)}</div><div class="gm-opts">${q.shown.map((o, i) => `<button class="gm-opt" data-o="${i}">${esc(o)}</button>`).join('')}</div>`;
      } else if (q.t === 'fill') {
        body = `<div class="gm-q">${esc(q.q)}</div><form class="cp-type"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="答えを入力"><button class="btn ghost" type="submit">答え合わせ</button></form>`;
      } else {
        const words = q.a.replace(/[.,!?]+$/, '').split(' ');
        if (words[0] !== 'I' && words[0].slice(1) === words[0].slice(1).toLowerCase()) words[0] = words[0].toLowerCase();
        q.tiles = shuffle(words.map((w, i) => ({ w, i })));
        body = `<div class="cp-ja">${esc(q.ja)}</div><div class="rv-label">単語を順にタップして英文に</div>
          <div class="gm-built"></div><div class="gm-tiles">${q.tiles.map((x, i) => `<button class="chip" data-tile="${i}">${esc(x.w)}</button>`).join('')}</div>
          <div class="btn-row"><button class="btn ghost" data-a="undo">1つ戻す</button><button class="btn primary" data-a="check" disabled>答え合わせ</button></div>`;
      }
      el.innerHTML = `${head}<div class="tr-body"><div class="card gm-card"><div class="rv-label">${k + 1} / ${items.length}</div>${body}${src}
          <div class="gm-result" hidden></div></div></div>
        <div class="tr-actions"><button class="btn primary wide" data-a="next" hidden>次へ</button></div>`;
      bindBack();
      el.querySelector('[data-a=next]').onclick = () => {
        k++;
        card();
      };
      if (q.t === 'choice') {
        el.querySelectorAll('[data-o]').forEach((b) =>
          b.addEventListener('click', () => {
            const pick = q.shown[Number(b.dataset.o)];
            el.querySelectorAll('[data-o]').forEach((x) => {
              x.disabled = true;
              if (q.shown[Number(x.dataset.o)] === q.o[0]) x.classList.add('right');
            });
            if (pick !== q.o[0]) b.classList.add('wrong');
            result(pick === q.o[0], q.o[0]);
          }),
        );
      } else if (q.t === 'fill') {
        const form = el.querySelector('.cp-type');
        form.querySelector('input').focus();
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const v = form.querySelector('input').value;
          if (!v.trim()) return;
          form.querySelectorAll('input,button').forEach((x) => (x.disabled = true));
          result(q.a.map(G.normAnswer).includes(G.normAnswer(v)), q.a[0]);
        });
      } else {
        const built = [];
        const out = el.querySelector('.gm-built');
        const check = el.querySelector('[data-a=check]');
        const draw = () => {
          out.textContent = built.map((i) => q.tiles[i].w).join(' ');
          el.querySelectorAll('[data-tile]').forEach((b) => (b.disabled = built.includes(Number(b.dataset.tile))));
          check.disabled = built.length !== q.tiles.length;
        };
        el.querySelectorAll('[data-tile]').forEach((b) =>
          b.addEventListener('click', () => {
            built.push(Number(b.dataset.tile));
            draw();
          }),
        );
        el.querySelector('[data-a=undo]').onclick = () => {
          built.pop();
          draw();
        };
        check.onclick = () => {
          el.querySelectorAll('[data-tile],[data-a=undo],[data-a=check]').forEach((x) => (x.disabled = true));
          const mine = built.map((i) => q.tiles[i].w).join(' ');
          result(G.normAnswer(mine) === G.normAnswer(q.a), q.a);
        };
      }

      function result(ok, answer) {
        if (ok) correct++;
        G.answer(q.id, ok);
        const box = el.querySelector('.gm-result');
        box.hidden = false;
        box.innerHTML = `<div class="gm-verdict ${ok ? 'ok' : 'ng'}">${ok ? '○ 正解' : '× 不正解'}</div>
          ${q.t === 'choice' ? '' : `<div class="cp-model">${esc(answer)} <button class="icon-btn speak" data-a="speak" aria-label="読み上げ">${icons.speaker}</button></div>`}
          <p class="gm-expl">${esc(q.e)}</p>`;
        box.querySelector('[data-a=speak]')?.addEventListener('click', () => say(answer, host.settings));
        el.querySelector('[data-a=next]').hidden = false;
        el.querySelector('[data-a=next]').textContent = k + 1 < items.length ? '次へ' : '結果へ';
      }
    }
    card();
  }

  function review() {
    const due = G.dueCards().slice(0, 15).map((e) => G.question(e.id));
    if (!due.length) {
      el.innerHTML = `${top('復習')}<div class="rv-done"><div class="big-emoji">🎉</div><h2>今日の復習はありません</h2></div>`;
      return bindBack();
    }
    quiz(shuffle(due), {
      title: '復習',
      onDone: (r) => {
        host.recordPractice({ type: 'grammar', kind: 'review', n: r.n, correct: r.correct, score: Math.round((r.correct / r.n) * 100) });
        el.innerHTML = `${top('')}<div class="rv-done"><div class="big-emoji">🔁</div><h2>復習完了</h2>
            <div class="tr-stat"><small>正解</small><b>${r.correct} / ${r.n}</b></div>
            <p class="muted small">あやしかった問題は、その節の本のページを読み直すと定着します。</p>
            <button class="btn primary wide" data-a="map">コース一覧に戻る</button></div>`;
        bindBack();
        el.querySelector('[data-a=map]').onclick = () => popLayer();
      },
    });
  }

  function chapterTest(n) {
    const c = G.chapter(n);
    const all = c.sections.flatMap((s) => s.questions.map((q, k) => ({ ...q, id: G.qid(s, k), section: { ...s, chapter: n } })));
    const items = shuffle(all).slice(0, 20);
    quiz(items, {
      title: `第${n}章 章末テスト`,
      onDone: async (r) => {
        const score = Math.round((r.correct / r.n) * 100);
        await G.addTest(n, score, r.n);
        host.recordPractice({ type: 'grammar', kind: 'test', chapter: n, n: r.n, correct: r.correct, score });
        const pass = score >= PASS * 100;
        el.innerHTML = `${top('')}<div class="rv-done"><div class="big-emoji">${pass ? '🏅' : '📖'}</div><h2>第${n}章 章末テスト</h2>
            <div class="tr-stat"><small>正答率</small><b>${score}%</b><small>${r.correct} / ${r.n}（目標 ${PASS * 100}%）</small></div>
            <p class="muted small">${pass ? '合格です。次の章へ進みましょう。' : '間違えた問題の節を本で読み直してから、もう一度挑戦しましょう。'}</p>
            <button class="btn primary wide" data-a="map">コース一覧に戻る</button></div>`;
        bindBack();
        el.querySelector('[data-a=map]').onclick = () => popLayer();
      },
    });
  }

  // ---------- full-text search
  function searchScreen() {
    el.innerHTML = `${top('全文検索')}
      <div class="tr-body">
        <form class="cp-type gm-search"><input type="search" placeholder="例: 時制の一致 / in case / 同格" enterkeyhint="search"><button class="btn primary" type="submit">${icons.search}</button></form>
        <p class="small muted">本の文字（スキャンから読み取ったもの）を探します。読み取りの誤りがあるため、短い語句で探すと見つかりやすくなります。英文はスペースを無視して探します。</p>
        <div class="gm-results"></div></div>`;
    bindBack();
    const form = el.querySelector('.gm-search');
    const out = el.querySelector('.gm-results');
    const input = form.querySelector('input');
    input.value = searchScreen.last || '';
    const run = () => {
      const q = input.value.trim();
      searchScreen.last = q;
      if (!q) return (out.innerHTML = '');
      const nq = G.normalize(q);
      const secs = G.SECTIONS.filter((s) => G.normalize(`${s.id}${s.title}${s.points.join('')}`).includes(nq));
      const hits = G.search(book, q);
      out.innerHTML = `${secs.length ? `<div class="rv-label">コースの節</div>${secs.map((s) => `<button class="gm-row" data-sec="${s.id}"><span class="gm-id">${s.id}</span><span class="gm-t">${esc(s.title)}</span><small>p.${s.book}</small></button>`).join('')}` : ''}
        <div class="rv-label">本のページ（${hits.length}${hits.length >= 200 ? '+' : ''}件）</div>
        ${hits.map((h) => {
          const w = G.whereIs(book, h.i);
          return `<button class="gm-hit" data-page="${h.i}"><div class="gm-hit-top"><b>${G.pageLabel(book, h.i)}</b><small>${w ? `${w.section ? `${w.section.id} ${esc(w.section.title)}` : `第${w.chapter.n}章 ${esc(w.chapter.title)}`}` : ''}</small></div>
            <div class="gm-snip">…${esc(h.snippet[0])}<mark>${esc(h.snippet[1])}</mark>${esc(h.snippet[2])}…</div></button>`;
        }).join('') || '<p class="muted small">見つかりませんでした。</p>'}`;
      out.querySelectorAll('[data-page]').forEach((b) => b.addEventListener('click', () => openViewer(Number(b.dataset.page), {})));
      out.querySelectorAll('[data-sec]').forEach((b) => b.addEventListener('click', () => go(() => sectionFlow(G.section(b.dataset.sec)))));
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      input.blur();
      run();
    });
    if (input.value) run();
  }

  // ---------- the scanned-book viewer
  function openViewer(start, { title = '', range = null }) {
    return new Promise((resolve) => {
      let v = $('#gbook');
      if (!v) {
        v = document.createElement('section');
        v.id = 'gbook';
        document.body.append(v);
      }
      let i = start;
      let zoom = 1;
      let url = null;
      v.hidden = false;
      v.innerHTML = `<header class="gb-top"><button class="icon-btn" data-a="back" aria-label="閉じる">${icons.back}</button>
          <div class="gb-title"><b></b><small></small></div><button class="btn ghost gb-zoom" data-a="zoom">100%</button></header>
        <div class="gb-scroll"><img class="gb-page" alt=""></div>
        <footer class="gb-nav"><button class="btn ghost" data-a="prev">‹ 前</button>
          <form class="gb-go"><input type="number" inputmode="numeric" aria-label="ページ番号"><button class="btn ghost" type="submit">移動</button></form>
          <button class="btn ghost" data-a="next">次 ›</button></footer>`;
      const img = v.querySelector('.gb-page');
      const scroller = v.querySelector('.gb-scroll');
      const show = () => {
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(G.pageBlob(book, i));
        img.src = url;
        scroller.scrollTo(0, 0);
        const w = G.whereIs(book, i);
        v.querySelector('.gb-title b').textContent = `${G.pageLabel(book, i)}${range && i >= range[0] && i <= range[1] ? `（${i - range[0] + 1}/${range[1] - range[0] + 1}）` : ''}`;
        v.querySelector('.gb-title small').textContent = title || (w ? (w.section ? `${w.section.id} ${w.section.title}` : `第${w.chapter.n}章 ${w.chapter.title}`) : '');
        v.querySelector('.gb-go input').value = G.bookPage(book, i);
        v.querySelector('[data-a=prev]').disabled = i <= 0;
        v.querySelector('[data-a=next]').disabled = i >= book.pages.length - 1;
        v.querySelector('[data-a=next]').textContent = range && i === range[1] ? '次 ›（節の外）' : '次 ›';
      };
      const move = (d) => {
        i = Math.max(0, Math.min(book.pages.length - 1, i + d));
        show();
      };
      v.querySelector('[data-a=back]').onclick = () => popLayer();
      v.querySelector('[data-a=prev]').onclick = () => move(-1);
      v.querySelector('[data-a=next]').onclick = () => move(1);
      v.querySelector('[data-a=zoom]').onclick = (e) => {
        zoom = zoom === 1 ? 1.6 : zoom === 1.6 ? 2.2 : 1;
        img.style.width = `${zoom * 100}%`;
        e.currentTarget.textContent = `${Math.round(zoom * 100)}%`;
      };
      v.querySelector('.gb-go').addEventListener('submit', (e) => {
        e.preventDefault();
        const p = Number(e.target.querySelector('input').value);
        if (p) {
          i = G.pdfIndexOfBookPage(book, p);
          show();
        }
      });
      // Swipe to turn pages (only when not zoomed, so zoomed pages can be panned).
      let x0 = null;
      scroller.addEventListener('touchstart', (e) => (x0 = e.touches.length === 1 && zoom === 1 ? e.touches[0].clientX : null), { passive: true });
      scroller.addEventListener('touchend', (e) => {
        if (x0 == null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 60) move(dx < 0 ? 1 : -1);
        x0 = null;
      });
      pushLayer(() => {
        v.hidden = true;
        if (url) URL.revokeObjectURL(url);
        resolve(i);
      });
      show();
    });
  }

  map();
  if (sectionId && G.section(sectionId)) go(() => sectionFlow(G.section(sectionId)));
}

// ---------- real examples from the bundled books
const exampleCursor = { n: Math.floor(Math.random() * 1000) };

async function findExamples(host, pattern, max = 5) {
  const re = new RegExp(pattern, 'i');
  const pool = host.library.filter((b) => b.source === 'voa' || (b.source === 'gutenberg' && b.level <= 3));
  const out = [];
  for (let tries = 0; tries < 16 && out.length < max && pool.length; tries++) {
    const b = pool[exampleCursor.n++ % pool.length];
    let text;
    try {
      text = await host.loadText(b);
    } catch {
      continue;
    }
    const sentences = text.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').match(/[A-Z][^.!?]*[.!?]+["”’]?/g) || [];
    const hits = sentences.filter((s) => s.length >= 25 && s.length <= 200 && re.test(s));
    for (const s of shuffle(hits).slice(0, 2)) {
      if (out.length >= max) break;
      const m = s.match(re);
      const html = m ? `${esc(s.slice(0, m.index))}<mark>${esc(m[0])}</mark>${esc(s.slice(m.index + m[0].length))}` : esc(s);
      out.push({ text: s, html, book: b.title });
    }
  }
  return out;
}
