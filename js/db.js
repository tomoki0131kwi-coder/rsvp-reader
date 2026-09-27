// Minimal key-value store on IndexedDB (falls back to memory if unavailable).

const memory = new Map();
let dbPromise = null;

function open() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open('rsvp-reader', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('kv');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

async function run(mode, fn) {
  const db = await open();
  if (!db) return fn(null);
  return new Promise((resolve, reject) => {
    const tx = db.transaction('kv', mode);
    const req = fn(tx.objectStore('kv'));
    tx.oncomplete = () => resolve(req && req.result);
    tx.onerror = () => reject(tx.error);
  });
}

export async function get(key, fallback = undefined) {
  const v = await run('readonly', (s) => (s ? s.get(key) : { result: memory.get(key) }));
  return v === undefined ? fallback : v;
}

export function set(key, value) {
  return run('readwrite', (s) => (s ? s.put(value, key) : void memory.set(key, value)));
}

export function del(key) {
  return run('readwrite', (s) => (s ? s.delete(key) : void memory.delete(key)));
}

export function clearAll() {
  return run('readwrite', (s) => (s ? s.clear() : void memory.clear()));
}

// Ask the browser not to evict our data (books, progress, stats) under storage pressure.
export function requestPersistence() {
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}
