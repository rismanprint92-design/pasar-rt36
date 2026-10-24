// sw.js - Final Pasar RT.36 - Hemat Kuota + Anti Boros Blaze
const CACHE_NAME = 'pasar-rt36-v3';

self.addEventListener('install', function(e) {
  self.skipWaiting(); // Punya kamu, tetap saya pakai bosku, biar update langsung
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim()) // Punya kamu, tetap saya pakai bosku
  );
});

self.addEventListener('fetch', function(e) {
  const url = e.request.url;

  // 1. JANGAN CACHE FIREBASE - Biar harga produk selalu baru bosku
  if (url.includes('firebase') || url.includes('firebasedatabase') || url.includes('firestore')) {
    return e.respondWith(fetch(e.request));
  }

  // 2. UNTUK FILE STATIS (icon, css, html) - Pakai cache biar hemat bosku
  e.respondWith(
    caches.match(e.request).then(function(cacheRes){
      return cacheRes || fetch(e.request).then(function(networkRes){
        // Simpan ke cache buat next time biar hemat
        if(e.request.method === 'GET' && url.startsWith('http')){
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, networkRes.clone()));
        }
        return networkRes;
      });
    }).catch(() => fetch(e.request)) // Kalau cache gagal, tetap fetch bosku
  );
});
