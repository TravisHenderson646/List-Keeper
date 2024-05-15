const VERSION = 'v0.0.1';

const CACHE_NAME = `List-Keeper-${VERSION}`;

var STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/main.js',
  '/icon.png'
];
console.log('sw.js test random 112233')
// On install, cache the static resources

// self.addEventListener("install", (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(STATIC_RESOURCES);
//         }).then(() => {
//             console.log('Cached assets during install');
//         })
//     );
// });
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            const cachePromises = STATIC_RESOURCES.map(urlToCache => {
                return cache.add(urlToCache).catch(err => {
                    console.error(`Caching failed for ${urlToCache}: ${err}`);
                    throw err; // Rethrow to ensure the promise chain rejects
                });
            });
            return Promise.all(cachePromises);
        })
    );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
    console.log('eventlistener ACTIVATE event !!!!>!D')
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