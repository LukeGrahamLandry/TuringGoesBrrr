/*
 Description: service worker that caches files for offline use
 About: https://web.dev/offline-fallback-page
*/

const CACHE_NAME = "turinggoesbrrr-resources";
const DYNAMIC_RESOURCES = ["circuit", "circuit.js"]
const STATIC_RESOURCES = ["lib/save_monger.min.js", "lib/snappyjs.min.js", "lib/tc_components.js", "img/icon-192.png", "img/icon-512.png", "app.webmanifest"]

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            console.log("Installing updated service worker...")
            const cache = await caches.open(CACHE_NAME);

            for (let path of DYNAMIC_RESOURCES){
                await cache.add(new Request(path, { cache: "reload" }));
            }

            for (let path of STATIC_RESOURCES){
                await cache.add(new Request(path));
            }
        })()
    );
  
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            if ("navigationPreload" in self.registration) {
                await self.registration.navigationPreload.enable();
            }
        })()
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
                return preloadResponse;
            }

            const cache = await caches.open(CACHE_NAME);
            let cachedResponse = await cache.match(event.request);
            if (cachedResponse != undefined){
                return cachedResponse;
            }

            const networkResponse = await fetch(event.request);
            return networkResponse;
        })()
    );
});
