// Offline support. App shell: stale-while-revalidate. Books, dictionary, catalog: cache-first.
const SHELL_CACHE = 'shell-v13';
const DATA_CACHE = 'data-v1'; // bump only when bundled books/dictionary change
const SHELL = [
  './', 'index.html', 'app.css', 'manifest.webmanifest',
  'js/app.js', 'js/reader.js', 'js/rsvp.js', 'js/text.js', 'js/dict.js', 'js/gutenberg.js', 'js/stats.js', 'js/db.js', 'js/ui.js', 'js/translate.js', 'js/speech.js', 'js/vocab.js', 'js/vocabView.js', 'js/listen.js', 'js/coach.js', 'js/chunk.js', 'js/dictSheet.js', 'js/training.js', 'js/goals.js', 'js/daily.js', 'js/practice.js', 'js/shadowing.js', 'js/composition.js', 'js/speaking.js', 'js/stt.js', 'js/recorder.js', 'js/textdiff.js', 'js/grammar.js', 'js/grammarCourse.js', 'js/grammarView.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'data/library.json', 'data/credits.json', 'data/wordlists.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL_CACHE && k !== DATA_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  if (/\/data\/(books|dict|pron|vocab)\/|\/data\/(catalog\.tsv|composition\.json)$/.test(url.pathname)) {
    e.respondWith(
      caches.open(DATA_CACHE).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) c.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  e.respondWith(
    caches.open(SHELL_CACHE).then(async (c) => {
      const hit = await c.match(req, { ignoreSearch: true });
      const net = fetch(req)
        .then((res) => {
          if (res.ok) c.put(req, res.clone());
          return res;
        })
        .catch(() => hit || (req.mode === 'navigate' ? c.match('index.html') : Response.error()));
      return hit || net;
    }),
  );
});
