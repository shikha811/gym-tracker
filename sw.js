/* Gym Tracker service worker — offline-first.
   Bump CACHE when you change any file so phones pick up the new version. */
const CACHE = "gym-tracker-v1";

const LOCAL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png"
];

const CDN = "https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.js";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Local files must all cache; a single failure would abort install, so add them individually.
    await Promise.all(LOCAL.map((url) => cache.add(url).catch(() => {})));
    // Chart.js is nice-to-have offline — never let it block installation.
    try { await cache.add(new Request(CDN, { mode: "cors" })); } catch (e) {}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navigations: network first so a deploy is picked up quickly, cache as the offline fallback.
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put("./index.html", fresh.clone());
        return fresh;
      } catch (e) {
        const cache = await caches.open(CACHE);
        return (await cache.match("./index.html")) || Response.error();
      }
    })());
    return;
  }

  // Everything else: cache first, then network, refreshing the cache in the background.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreVary: true });
    if (hit) {
      fetch(req).then((r) => { if (r && r.ok) cache.put(req, r.clone()); }).catch(() => {});
      return hit;
    }
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    } catch (e) {
      return Response.error();
    }
  })());
});
