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

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(ASSETS)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})