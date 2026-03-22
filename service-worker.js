const CACHE_NAME = 'sapienscamp-cache-v1';
const urlsToCache = [
  './',
  './index.php',
  './theme.css',
  './favicon.png',
  './english.php',
  './english_exam.php',
  './english.json',
  // 可依需求加入更多靜態資源
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});
