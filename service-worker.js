const VERSION = 'v0.0.4';

const CACHE_NAME = `List-Keeper-${VERSION}`;

var STATIC_RESOURCES = [
  '/List-Keeper/',
  '/List-Keeper/index.html',
  '/List-Keeper/main.js',
  '/List-Keeper/icons/icon.png',
  '/List-Keeper/manifest.json'
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_RESOURCES);
        }).then(() => {
            console.log('Cached assets during install');
        })
    );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
    console.log('eventlistener ACTIVATE event !!!!>!D', event)
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
self.addEventListener("fetch", (event) => {
    console.log('eventlistener fetch event', event)
    if (event.request.mode === "navigate") {
        event.respondWith(caches.match("/List-Keeper/"));
        return;
    }
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request.url);
            if (cachedResponse) {
                return cachedResponse;
            }
            return new Response(null, { status: 404 });
        })(),
    );
});