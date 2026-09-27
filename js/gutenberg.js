// Project Gutenberg: bundled curated library, catalog search, and downloading via CORS proxies.

let catalogPromise = null;

export async function loadLibrary() {
  const r = await fetch('data/library.json');
  return r.json();
}

export function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch('data/catalog.tsv')
      .then((r) => {
        if (!r.ok) throw new Error(`catalog ${r.status}`);
        return r.text();
      })
      .then((txt) =>
        txt
          .split('\n')
          .filter(Boolean)
          .map((line) => {
            const [id, title, author, flag] = line.split('\t');
            return { id: Number(id), title, author, kids: flag === 'c', key: `${title} ${author}`.toLowerCase() };
          }),
      );
    catalogPromise.catch(() => (catalogPromise = null));
  }
  return catalogPromise;
}

export async function search(query, limit = 60) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const cat = await loadCatalog();
  const q = terms.join(' ');
  const hits = [];
  for (const b of cat) if (terms.every((t) => b.key.includes(t))) hits.push(b);
  const rank = (b) => {
    const t = b.title.toLowerCase();
    return (t === q ? 0 : t.startsWith(q) ? 1 : t.includes(q) ? 2 : 3) * 1e6 + b.id;
  };
  hits.sort((a, b) => rank(a) - rank(b));
  return hits.slice(0, limit);
}

export function textUrl(id) {
  return `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`;
}

export function pageUrl(id) {
  return `https://www.gutenberg.org/ebooks/${id}`;
}

function proxied(url, customProxy) {
  const list = [];
  if (customProxy) {
    const p = customProxy.trim();
    list.push(p.includes('{url}') ? p.replace('{url}', encodeURIComponent(url)) : p + url);
  }
  list.push(`https://cors.eu.org/${url}`);
  list.push(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
  list.push(url); // works only if Gutenberg ever enables CORS
  return list;
}

/** Download the plain text of a Gutenberg book. Tries each proxy in turn. */
export async function download(id, customProxy, onAttempt = () => {}) {
  const urls = proxied(textUrl(id), customProxy);
  let lastErr = null;
  for (let i = 0; i < urls.length; i++) {
    onAttempt(i + 1, urls.length);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const r = await fetch(urls[i], { signal: ctrl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const text = await r.text();
      if (text.length < 500 || !/project gutenberg/i.test(text.slice(0, 5000))) throw new Error('unexpected content');
      return text;
    } catch (e) {
      lastErr = e;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr || new Error('download failed');
}

/** Pull "Title:" and "Author:" out of a Gutenberg header, if present. */
export function headerInfo(raw) {
  const field = (name) => {
    const m = raw.slice(0, 8000).match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim() : '';
  };
  return { title: field('Title'), author: field('Author') };
}
