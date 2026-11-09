// Cache-first for the app shell so the whole thing works on a plane or on the
// subway. Bump CACHE when files change; the old cache is dropped on activate.

const CACHE = 'atelier-tef-v1';

const SHELL = [
  './',
  'index.html',
  'css/app.css',
  'manifest.webmanifest',
  'icons/icon.svg',
  'js/app.js',
  'js/store.js',
  'js/srs.js',
  'js/scoring.js',
  'js/speech.js',
  'js/ui.js',
  'js/data/cards.js',
  'js/data/reading.js',
  'js/data/listening.js',
  'js/data/dictee.js',
  'js/data/prompts.js',
  'js/views/_runner.js',
  'js/views/home.js',
  'js/views/reviser.js',
  'js/views/atelier.js',
  'js/views/lire.js',
  'js/views/ecouter.js',
  'js/views/dictee.js',
  'js/views/parler.js',
  'js/views/ecrire.js',
  'js/views/progres.js',
  'js/views/reglages.js',
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

  // Fonts: serve from cache when present, otherwise fetch and keep a copy.
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);

  if (url.origin === location.origin || isFont) {
    e.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(request, copy));
        }
        return res;
      }).catch(() => caches.match('index.html')))
    );
  }
});
