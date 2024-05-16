const VERSION = '0.0.0';

const CACHE_NAME = `List-Keeper-${VERSION}`;

const GITHUB_PATH = '/List-Keeper';

var STATIC_RESOURCES = [
  `${GITHUB_PATH}/`,
  `${GITHUB_PATH}/index.html`,
  `${GITHUB_PATH}/main.js`,
  `${GITHUB_PATH}/icon.png`
]

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
self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(caches.match("/"));
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