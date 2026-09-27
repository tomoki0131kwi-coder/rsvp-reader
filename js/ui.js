// Shared UI helpers: escaping, icons, toast, bottom sheet, and Android back-button layers.

export const $ = (sel, root = document) => root.querySelector(sel);

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export const fmt = (n) => Math.round(n).toLocaleString('ja-JP');

export function fmtDuration(ms) {
  const min = Math.round(ms / 60000);
  if (min < 1) return '1分未満';
  if (min < 60) return `${min}分`;
  return `${Math.floor(min / 60)}時間${min % 60 ? `${min % 60}分` : ''}`;
}

const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" ${extra}>${d}</svg>`;
export const icons = {
  play: svg('<path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"/>'),
  pause: svg('<rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/>'),
  prev: svg('<path d="M18 6v12l-8.5-6zM6 6h2v12H6z" fill="currentColor"/>'),
  next: svg('<path d="M6 6v12l8.5-6zM16 6h2v12h-2z" fill="currentColor"/>'),
  back: svg('<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  list: svg('<path d="M5 7h14M5 12h14M5 17h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  more: svg('<circle cx="5.5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="18.5" cy="12" r="1.8" fill="currentColor"/>'),
  shelf: svg('<path d="M5 4h3v16H5zM10 4h3v16h-3zM15.2 4.6l2.9-.8 3.6 15.4-2.9.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  chart: svg('<path d="M5 20V11M10 20V5M15 20v-7M20 20V9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),
  gear: svg('<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2L5.5 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  book: svg('<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
  speaker: svg('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  cards: svg('<rect x="3.5" y="7" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 4h11a2 2 0 0 1 2 2v11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 13.5h6M7 16.5h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'),
  headphones: svg('<path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><rect x="3" y="14" width="5" height="7" rx="1.8" fill="currentColor"/><rect x="16" y="14" width="5" height="7" rx="1.8" fill="currentColor"/>'),
  check: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M8 12.2l2.8 2.8L16.5 9" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>'),
  mic: svg('<rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>'),
  file: svg('<path d="M7 3h7l5 5v13H7z M14 3v5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
};

let toastTimer = null;
export function toast(msg, ms = 2600) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

// ---- Layers: each overlay pushes a history entry so Android's back button closes it.
const layers = [];
window.addEventListener('popstate', () => {
  const close = layers.pop();
  if (close) close();
});
export function pushLayer(close) {
  layers.push(close);
  history.pushState({ layer: layers.length }, '');
}
export function popLayer() {
  if (layers.length) history.back();
}

// ---- Bottom sheet
let sheetOpen = false;
let sheetOnClose = null;

function hideSheet() {
  sheetOpen = false;
  const s = $('#sheet');
  s.classList.remove('open');
  setTimeout(() => {
    if (!sheetOpen) s.hidden = true;
  }, 220);
  const cb = sheetOnClose;
  sheetOnClose = null;
  if (cb) cb();
}

/** Show html in the bottom sheet; returns the panel element. Replaces content if already open. */
export function openSheet(html, { onClose } = {}) {
  const s = $('#sheet');
  const panel = $('.sheet-panel', s);
  panel.innerHTML = `<div class="sheet-grip"></div>${html}`;
  panel.scrollTop = 0;
  sheetOnClose = onClose || null;
  if (!sheetOpen) {
    sheetOpen = true;
    s.hidden = false;
    requestAnimationFrame(() => s.classList.add('open'));
    pushLayer(hideSheet);
  }
  return panel;
}

/** Close the sheet; `then` runs after the history entry is gone (safe to push a new layer). */
export function closeSheet(then) {
  if (!sheetOpen) {
    if (typeof then === 'function') then();
    return;
  }
  if (typeof then === 'function') {
    const prev = sheetOnClose;
    sheetOnClose = () => {
      if (prev) prev();
      then();
    };
  }
  popLayer();
}

export function isSheetOpen() {
  return sheetOpen;
}

export function initSheet() {
  $('#sheet .sheet-backdrop').addEventListener('click', closeSheet);
}

export function confirmSheet(message, okLabel = 'OK', danger = false) {
  return new Promise((resolve) => {
    let result = false;
    const panel = openSheet(
      `<p class="sheet-msg">${esc(message)}</p>
       <div class="sheet-actions"><button class="btn ghost" data-a="no">キャンセル</button>
       <button class="btn ${danger ? 'danger' : 'primary'}" data-a="yes">${esc(okLabel)}</button></div>`,
      { onClose: () => resolve(result) },
    );
    panel.querySelector('[data-a=yes]').onclick = () => {
      result = true;
      closeSheet();
    };
    panel.querySelector('[data-a=no]').onclick = closeSheet;
  });
}
