const VERSION = 'v0.0.1';

const CACHE_NAME = `List-Keeper-${VERSION}`;

var STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/main.js',
  '/sw.js',
  '/icon.png'
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(STATIC_RESOURCES);
        })(),
    );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                }),
            );
            await clients.claim();
        })(),
    );
});

// On fetch, intercept server requests and respond with cached responses instead of going to network
// self.addEventListener("fetch", (event) => {
//     if (event.request.mode === "navigate") {
//         event.respondWith(caches.match("/"));
//         return;
//     }
//     event.respondWith(
//         (async () => {
//             const cache = await caches.open(CACHE_NAME);
//             const cachedResponse = await cache.match(event.request.url);
//             if (cachedResponse) {
//                 return cachedResponse;
//             }
//             return new Response(null, { status: 404 });
//         })(),
//     );
// });