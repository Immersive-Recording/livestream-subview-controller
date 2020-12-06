/// <reference lib="esNext" />
/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>
import { registerRoute } from 'https://cdn.skypack.dev/workbox-routing?dts';
import {
    NetworkFirst,
    StaleWhileRevalidate,
    CacheFirst,
} from 'https://cdn.skypack.dev/workbox-strategies?dts';

// Used for filtering matches based on status code, header, or both
import { CacheableResponsePlugin } from 'https://cdn.skypack.dev/workbox-cacheable-response?dts';
// Used to limit entries in cache, remove entries after a certain period of time
import { ExpirationPlugin } from 'https://cdn.skypack.dev/workbox-expiration?dts';

// Cache page navigations (html) with a Network First strategy
registerRoute(
    // Check to see if the request is a navigation to a new page
    ({ request }: Record<string, Record<string, string>>) => request.mode === 'navigate',
    // Use a Network First caching strategy
    new NetworkFirst({
        // Put all cached files in a cache named 'pages'
        cacheName: 'pages',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    }),
    undefined
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
    // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
    ({ request }: Record<string, Record<string, string>>) =>
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'worker',
    // Use a Stale While Revalidate caching strategy
    new StaleWhileRevalidate({
        // Put all cached files in a cache named 'assets'
        cacheName: 'assets',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    }),
    undefined
);

// Cache images with a Cache First strategy
registerRoute(
    // Check to see if the request's destination is style for an image
    ({ request }: Record<string, Record<string, string>>) => request.destination === 'image',
    // Use a Cache First caching strategy
    new CacheFirst({
        // Put all cached files in a cache named 'images'
        cacheName: 'images',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new CacheableResponsePlugin({
                statuses: [200],
            }),
            // Don't cache more than 50 items, and expire them after 30 days
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            }),
        ],
    }),
    undefined
);