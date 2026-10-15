const CACHE_NAME = "pasar-rt36-v1";
self.addEventListener("install", e => {
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  e.respondWith(fetch(e.request));
});
