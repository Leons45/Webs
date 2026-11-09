// Cache-first app shell, so the whole programme works offline.
const CACHE = 'atelier-v2-1';

const SHELL = [
  "./",
  "index.html",
  "css/app.css",
  "manifest.webmanifest",
  "icons/icon.svg",
  "js/app.js",
  "js/i18n.js",
  "js/level.js",
  "js/plan.js",
  "js/speech.js",
  "js/srs.js",
  "js/store.js",
  "js/ui.js",
  "js/views/ecrire.js",
  "js/views/grammaire.js",
  "js/views/home.js",
  "js/views/parler.js",
  "js/views/phrases.js",
  "js/views/progres.js",
  "js/views/reglages.js",
  "js/views/vocab.js",
  "js/data/grammar.js",
  "js/data/phrases.js",
  "js/data/speaking.js",
  "js/data/vocab.js",
  "js/data/writing.js"
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(new Request(u, { cache: 'reload' })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin === location.origin || isFont) {
    e.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(request, copy)); }
        return res;
      }).catch(() => caches.match('index.html')))
    );
  }
});
