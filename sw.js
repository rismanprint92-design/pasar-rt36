// sw.js - Final Pasar RT.36 - v5 Gabungan Hemat + Notif
const CACHE_NAME = 'pasar-rt36-v5';

// IMPORT FIREBASE UNTUK NOTIF BACKGROUND (HARUS DI ATAS BOSKU)
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyAJTAM4MdsOzcy2i3NOJySDTZ5XV384vvY",
  projectId: "pasar-rt36",
  messagingSenderId: "217440554731",
  appId: "1:217440554731:web:876717f8204cf40deeb8ae"
});

const messaging = firebase.messaging();

// NOTIF SAAT WEBSITE DI-TUTUP / BACKGROUND
messaging.onBackgroundMessage(payload => {
  console.log('Notif background masuk:', payload);
  const title = payload.notification?.title || 'Pasar RT36';
  const options = {
    body: payload.notification?.body || 'Ada info baru di Pasar RT36 bosku!',
    icon: '/icon-512.png',
    badge: '/icon-192.png',
    data: { url: payload.data?.link || '/' }
  };
  self.registration.showNotification(title, options);
});

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
  // Skip non-GET & chrome-extension
  if (e.request.method !== 'GET' || e.request.url.startsWith('chrome-extension://')) return;

  const url = e.request.url;

  // 1. JANGAN CACHE FIREBASE - Biar harga & chat selalu baru
  if (url.includes('firebase') || url.includes('firebasedatabase') || url.includes('firestore') || url.includes('googleapis')) {
    return e.respondWith(fetch(e.request));
  }

  // 2. UNTUK index.html - SELALU AMBIL BARU DARI NETWORK (FIX UTAMA BOSKU)
  if (e.request.mode === 'navigate' || url.endsWith('/') || url.includes('index.html')) {
    return e.respondWith(
      fetch(e.request)
        .then(networkRes => {
          // FIX CLONE ERROR: clone dulu baru simpan
          const cloneRes = networkRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, cloneRes));
          return networkRes;
        })
        .catch(() => caches.match(e.request))
    );
  }

  // 3. UNTUK FILE STATIS (icon, logo) - Pakai cache biar hemat kuota
  e.respondWith(
    caches.match(e.request).then(function(cacheRes){
      return cacheRes || fetch(e.request).then(function(networkRes){
        // FIX CLONE ERROR: clone dulu
        if (url.startsWith('http')) {
          const cloneRes = networkRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, cloneRes));
        }
        return networkRes;
      });
    }).catch(() => fetch(e.request))
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      for (let client of windowClients) {
        if (client.url.includes('pasar-rt36') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
