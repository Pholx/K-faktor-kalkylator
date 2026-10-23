const CACHE_NAME = 'kfaktor-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/materials.js',
  './js/calculations.js',
  './js/svg.js',
  './js/ui.js',
  './js/main.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png' /* <-- Lade till denna */
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});