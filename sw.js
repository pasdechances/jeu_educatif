const CACHE_NAME = "jeu-educatif-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./css/style-detente.css",
  "./js/quizz.js",
  "./js/detente-ui.js",
  "./js/app-core.js",
  "./data/detente.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});