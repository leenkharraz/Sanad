// SANAD service worker — Phase 1 scope: static app-shell caching only.
// This intentionally does not cache feature data (mic/camera/GPS/AI results
// are never available offline; do not extend this to imply otherwise).
const CACHE_NAME = "sanad-shell-v1";
const SHELL_URLS = ["/", "/manifest.json", "/icons/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
