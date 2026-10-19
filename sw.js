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
    caches.open(CACHE_NAME).then(async (cache) => {

      for (const asset of ASSETS) {

        try {
          const response = await fetch(asset);

          console.log(
            asset,
            response.status,
            response.ok
          );

          await cache.put(asset, response);

        } catch (err) {
          console.error(
            "Erreur sur :",
            asset,
            err
          );
        }
      }
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})