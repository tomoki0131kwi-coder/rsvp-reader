// Dictionary bottom sheet for a tapped word (used by the reader and the passage trainer).
import { F_HEADING, sentenceStart, nextSentence } from './text.js';
import { lookupJa, lookupEn, lookupPron, cleanWord } from './dict.js';
import { speak, NO_VOICE_HELP } from './speech.js';
import * as vocab from './vocab.js';
import { esc, icons, openSheet, toast } from './ui.js';

/**
 * @param o {doc, i, book, settings, saveSettings(partial),
 *           actions: [{label, primary?, icon?, onClick}]}  buttons at the bottom of the sheet
 */
export function openDictSheet(o) {
  const token = o.doc.words[o.i];
  const word = cleanWord(token);
  if (!word) return;
  const mode = o.settings.dictMode;
  const panel = openSheet(`
    <div class="dict">
      <div class="dict-head"><div class="dict-title"><h2>${esc(word)}</h2>
        <button class="icon-btn speak" data-a="speak" aria-label="発音を聞く">${icons.speaker}</button></div>
        <div class="seg small" role="tablist">
          <button data-m="ja" class="${mode === 'ja' ? 'on' : ''}">英和</button>
          <button data-m="en" class="${mode === 'en' ? 'on' : ''}">英英</button>
        </div></div>
      <div class="dict-pron"></div>
      <div class="dict-body"><div class="loading">検索中…</div></div>
      <div class="vocab-status"></div>
      <div class="sheet-actions">${o.actions
        .map((a, k) => `<button class="btn ${a.primary ? 'primary' : 'ghost'}" data-act="${k}">${a.icon ? icons[a.icon] : ''}${esc(a.label)}</button>`)
        .join('')}</div>
    </div>`);
  const body = panel.querySelector('.dict-body');
  lookupPron(word).then((pr) => {
    if (pr.length) panel.querySelector('.dict-pron').textContent = pr.map((x) => `/${x}/`).join('  ');
  });
  panel.querySelector('[data-a=speak]').onclick = async () => {
    const r = await speak(word, o.settings.voice);
    if (r === 'unsupported') toast('この端末は音声読み上げに対応していません');
    else if (r === 'no-voice') toast(NO_VOICE_HELP, 6000);
  };
  const render = async (m) => {
    panel.querySelectorAll('[data-m]').forEach((b) => b.classList.toggle('on', b.dataset.m === m));
    body.innerHTML = '<div class="loading">検索中…</div>';
    try {
      body.innerHTML = m === 'ja' ? renderJa(await lookupJa(token)) : renderEn(await lookupEn(token));
    } catch {
      body.innerHTML = `<p class="muted">${m === 'en' ? '英英辞書に接続できませんでした（オフライン？）' : '辞書を読み込めませんでした'}</p>`;
    }
  };
  panel.querySelectorAll('[data-m]').forEach((b) =>
    b.addEventListener('click', () => {
      o.saveSettings({ dictMode: b.dataset.m });
      render(b.dataset.m);
    }),
  );
  panel.querySelectorAll('[data-act]').forEach((b) => (b.onclick = () => o.actions[Number(b.dataset.act)].onClick()));
  render(mode);
  if (o.settings.autoSaveWords) saveToVocab(o, panel.querySelector('.vocab-status'));
}

/** Put the looked-up word into the word book with the sentence it appeared in. */
async function saveToVocab({ doc, i, book }, statusEl) {
  const token = doc.words[i];
  const form = cleanWord(token);
  let results = [];
  try {
    results = await lookupJa(token);
  } catch {
    /* dictionary unavailable: still save the word itself */
  }
  // "went" -> EJDict says "goの過去": file it under the base form "go".
  let hit = results[0];
  if (results[1] && /の(過去|複数|現在分詞|過去分詞|比較級|最上級|三人称)|^=/.test(hit.meanings.join(' '))) hit = results[1];
  const word = hit ? hit.word : form;
  const start = Math.max(sentenceStart(doc, i), i - 25);
  let end = Math.min(nextSentence(doc, i), i + 25);
  if (end <= i) end = doc.words.length;
  const ctx = [];
  let at = -1;
  for (let k = start; k < end; k++) {
    if (doc.flags[k] & F_HEADING) continue;
    if (k === i) at = ctx.length;
    ctx.push(doc.words[k]);
  }
  const { entry, isNew } = await vocab.addLookup({
    word, form, meaning: hit ? hit.meanings.join(' / ') : '', pron: hit?.pron?.[0] || '',
    ctx, at, bookId: book.id, bookTitle: book.title,
  });
  if (!statusEl.isConnected) return;
  statusEl.innerHTML = isNew
    ? `<span>★ 単語帳に保存しました${word !== form ? `（${esc(word)}）` : ''}</span><button class="link-btn" data-a="unsave">取り消す</button>`
    : `<span>★ 単語帳にあります（${entry.seen}回目）。復習に戻しました</span>`;
  statusEl.querySelector('[data-a=unsave]')?.addEventListener('click', async () => {
    await vocab.remove(word);
    statusEl.innerHTML = '<span class="muted">保存を取り消しました</span>';
  });
}

function renderJa(results) {
  if (!results.length) return '<p class="muted">英和辞書に見つかりませんでした。英英も試してください。</p>';
  return results
    .map((r) => {
      const senses = r.meanings
        .join(' / ')
        .split(' / ')
        .slice(0, 12)
        .map((m) => `<li>${esc(m).replace(/『(.+?)』/g, '<b>$1</b>')}</li>`)
        .join('');
      const pron = r.pron && r.pron.length ? ` <span class="pron">/${esc(r.pron[0])}/</span>` : '';
      return `<div class="dict-entry"><div class="dict-word">${esc(r.word)}${pron}</div><ol>${senses}</ol></div>`;
    })
    .join('');
}

function renderEn(res) {
  if (!res) return '<p class="muted">英英辞書に見つかりませんでした。</p>';
  return `<div class="dict-entry"><div class="dict-word">${esc(res.word)}</div>${res.entries
    .map((e) => `<div class="pos">${esc(e.pos)}</div><ol>${e.defs.map((d) => `<li>${esc(d)}</li>`).join('')}</ol>`)
    .join('')}</div>`;
}
