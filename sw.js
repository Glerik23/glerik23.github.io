/**
 * Service Worker for offline support
 * @version 1.0.0
 */

const CACHE_NAME = 'glerik-portfolio-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/variables.css',
    '/css/base.css',
    '/css/layout.css',
    '/css/components.css',
    '/css/toast.css',
    '/css/tooltip.css',
    '/css/animations.css',
    '/css/preloader.css',
    '/css/filter.css',
    '/css/stats.css',
    '/css/modal.css',
    '/css/scroll.css',
    '/css/particles.css',
    '/css/timeline.css',
    '/js/main.js',
    '/ProfileImage/avatar.jpg',
    '/ProfileImage/banner.jpg',
    '/LinkCard/valorant.svg',
    '/manifest.json'
];

// External resources to cache
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Cache static assets
                return Promise.all([
                    cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' }))),
                    // Try to cache external assets, but don't fail if they're unavailable
                    ...EXTERNAL_ASSETS.map(url =>
                        cache.add(url).catch(() => console.log(`Could not cache: ${url}`))
                    )
                ]);
            })
            .then(() => self.skipWaiting())
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API requests (let them go to network)
    if (url.hostname === 'decapi.me' ||
        url.hostname === 't.me' ||
        url.hostname.includes('allorigins') ||
        url.hostname.includes('codetabs')) {
        return;
    }

    // Stale-while-revalidate strategy for most requests
    event.respondWith(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.match(request)
                    .then((cachedResponse) => {
                        const fetchPromise = fetch(request)
                            .then((networkResponse) => {
                                // Update cache with fresh response
                                if (networkResponse.ok) {
                                    cache.put(request, networkResponse.clone());
                                }
                                return networkResponse;
                            })
                            .catch(() => {
                                // Return offline page if no cache and network fails
                                if (request.destination === 'document') {
                                    return cache.match('/');
                                }
                                return null;
                            });

                        // Return cached response immediately, or wait for network
                        return cachedResponse || fetchPromise;
                    });
            })
    );
});

/**
 * Message event - handle cache updates
 */
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
