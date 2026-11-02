importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAJTAM4MdsOzcy2i3NOJySDTZ5XV384vvY",
  authDomain: "pasar-rt36.firebaseapp.com",
  databaseURL: "https://pasar-rt36-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pasar-rt36",
  storageBucket: "pasar-rt36.firebasestorage.app",
  messagingSenderId: "217440554731",
  appId: "1:217440554731:web:876717f8204cf40deeb8ae",
  measurementId: "G-G5HXM56NWX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[Pasar RT36] Notif background masuk:', payload);
  const title = payload.notification?.title || 'Pasar RT 36';
  const options = {
    body: payload.notification?.body || 'Ikan segar baru masuk bosku!',
    icon: '/logo_rt36_bulat.png',
    badge: '/icon-192.png'
  };
  self.registration.showNotification(title, options);
});
