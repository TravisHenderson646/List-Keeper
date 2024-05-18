const VERSION = 'v0.0.11';

const CACHE_NAME = `List-Keeper-${VERSION}`;

var STATIC_RESOURCES = [
  '/List-Keeper/',
  '/List-Keeper/index.html',
  '/List-Keeper/main.js',
  '/List-Keeper/icons/icon.png',
  '/List-Keeper/manifest.json'
];

// On install, cache the static resources
self.addEventListener('install', (event) => {
    console.log('eventlistener install fired event', event.request)
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_RESOURCES);
        }).then(() => self.skipWaiting()) // This line ensures the service worker activates immediately
    );
});

// self.addEventListener("install", (event) => {
//     console.log('eventlistener activate fired event', event.request)
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(STATIC_RESOURCES);
//         }).then(() => {
//             console.log('Cached assets during install');
//         })
//     );
// });

// delete old caches on activate
self.addEventListener("activate", (event) => {
    console.log('eventlistener activate: fired event', event.request)
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log(`activate: Deleting old cache: ${name}`);
                        return caches.delete(name);
                    }
                }),
            );
            console.log('activate: Claiming clients');
            await clients.claim();
        })(),
    );
});

// On fetch, try network and cache it, if not try cache
self.addEventListener('fetch', (event) => {
    console.log('eventlistener fetch fired event', event.request)
    event.respondWith((async () => {
        try {
            // Try to get the response from the network
            const networkResponse = await fetch(event.request);
            // Open the cache and put a copy of the response in it
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
            // Return the network response
            return networkResponse;
        } catch (error) {
            // If the network request fails, try to serve the resource from the cache
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            // If the resource is not in the cache, return a fallback response
            return new Response('Resource not found', {
                status: 404,
                statusText: 'Not Found'
            });
        }
    })());
});


// self.addEventListener('fetch', (event) => {
//     console.log('Fetch event for ', event.request.url);
//     event.respondWith(
//         fetch(event.request)
//             .then((networkResponse) => {
//                 // Update the cache with the fresh response
//                 return caches.open(CACHE_NAME).then((cache) => {
//                     cache.put(event.request, networkResponse.clone());
//                     return networkResponse;
//                 });
//             })
//             .catch(() => {
//                 // When the network is unavailable, try to serve from the cache
//                 return caches.match(event.request);
//             })
//     );
// });


// self.addEventListener('fetch', (event) => {
//     console.log('Fetch event for ', event.request.url);
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             if (response) {
//                 console.log('Found ', event.request.url, ' in cache');
//                 return response;
//             }
//             console.log('Network request for ', event.request.url);
//             return fetch(event.request).then((networkResponse) => {
//                 // Update the cache with the network response
//                 return caches.open(CACHE_NAME).then((cache) => {
//                     cache.put(event.request, networkResponse.clone());
//                     return networkResponse;
//                 });
//             });
//         }).catch((error) => {
//             // Handle exceptions that occur from match() or fetch()
//             console.error('Fetching failed:', error);
//             throw error;
//         })
//     );
// });



// self.addEventListener("fetch", (event) => {
//     console.log('eventlistener fetch event', event)
//     if (event.request.mode === "navigate") {
//         event.respondWith(caches.match("/List-Keeper/"));
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