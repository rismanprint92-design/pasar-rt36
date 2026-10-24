// sw.js - Final Pasar RT.36 - Fix Index Selalu Baru + Hemat Kuota
const CACHE_NAME = 'pasar-rt36-v4';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', function(e) {
  const url = e.request.url;

  // 1. JANGAN CACHE FIREBASE - Biar harga produk selalu baru bosku
  if (url.includes('firebase') || url.includes('firebasedatabase') || url.includes('firestore')) {
    return e.respondWith(fetch(e.request));
  }

  // 2. UNTUK index.html - SELALU AMBIL BARU DARI NETWORK BOSKU (FIX UTAMA)
  if (e.request.mode === 'navigate' || url.endsWith('/') || url.includes('index.html')) {
    return e.respondWith(
      fetch(e.request).then(networkRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, networkRes.clone());
          return networkRes;
        });
      }).catch(() => caches.match(e.request))
    );
  }

  // 3. UNTUK FILE STATIS LAIN (icon, dll) - Pakai cache biar hemat bosku (format kamu tetap)
  e.respondWith(
    caches.match(e.request).then(function(cacheRes){
      return cacheRes || fetch(e.request).then(function(networkRes){
        if(e.request.method === 'GET' && url.startsWith('http')){
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, networkRes.clone()));
        }
        return networkRes;
      });
    }).catch(() => fetch(e.request))
  );
});
