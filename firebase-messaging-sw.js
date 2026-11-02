importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSy... (AMBIL DARI Project Settings)",
  authDomain: "pasar-rt36.firebaseapp.com",
  projectId: "pasar-rt36",
  storageBucket: "pasar-rt36.appspot.com",
  messagingSenderId: "217440554731",
  appId: "1:217440554731:web:xxxx"
});

const messaging = firebase.messaging();

// Kalau ada pesanan baru saat website tertutup, notif tetap bunyi
messaging.onBackgroundMessage((payload) => {
  console.log('Notifikasi Pasar RT36 masuk:', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo-pasar.png' // ganti dengan logo pasar-rt36
  });
});
