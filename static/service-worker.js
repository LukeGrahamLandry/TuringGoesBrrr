/*
 Description: service worker that caches files for offline use
 Source: https://web.dev/offline-fallback-page
 License: Apache 2.0, Google LLC. 
*/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
// This variable is intentionally declared and unused.
// Add a comment for your linter if you want:
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";

const DYNAMIC_RESOURCES = ["circuit", "main.js"]
const STATIC_RESOURCES = ["lib/save_monger.min.js", "lib/snappyjs.min.js", "lib/tc_components.js", "img/icon-192.png", "img/icon-512.png", "app.webmanifest"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Setting {cache: 'reload'} in the new request ensures that the
      // response isn't fulfilled from the HTTP cache; i.e., it will be
      // from the network.

      for (let path of DYNAMIC_RESOURCES){
        await cache.add(new Request(path, { cache: "reload" }));
      }

      for (let path of STATIC_RESOURCES){
        await cache.add(new Request(path));
      }
    })()
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
        try {
            // First, try to use the navigation preload response if it's
            // supported.
            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
                return preloadResponse;
            }

            // Always try the network first.
            const networkResponse = await fetch(event.request);
            return networkResponse;
        } catch (error) {
            // catch is only triggered if an exception is thrown, which is
            // likely due to a network error.
            // If fetch() returns a valid HTTP response with a response code in
            // the 4xx or 5xx range, the catch() will NOT be called.
            console.log("Fetch failed; returning offline page instead.", error, event.request.url);

            const cache = await caches.open(CACHE_NAME);
            let cachedResponse = await cache.match(event.request);
            return cachedResponse;
        }
        })()
    );
});
