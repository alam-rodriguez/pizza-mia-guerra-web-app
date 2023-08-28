importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey: "AIzaSyBT8qzZZQmmh0e6cgneR-c0dPNag_jI6_Y",
  authDomain: "tutorial-push-web-25a39.firebaseapp.com",
  projectId: "tutorial-push-web-25a39",
  storageBucket: "tutorial-push-web-25a39.appspot.com",
  messagingSenderId: "947571596751",
  appId: "1:947571596751:web:afbf2e599a7276c60586ba",
  measurementId: "G-YM4BKFR0RL"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(payload => {
  console.log('Recibiste mensaje mientras estabas ausente');

  // previo a mostrar notificacion
  const notificationTitle = payload.notification.title;
  const notificatioOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  }

  return self.registration.showNotification(
    notificationTitle,
    notificatioOptions
  )
});




































// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyDikFvbB7WtjJWq0C02tT9QzvFXfZsgmM0",
//   authDomain: "pideya-f502d.firebaseapp.com",
//   projectId: "pideya-f502d",
//   storageBucket: "pideya-f502d.appspot.com",
//   messagingSenderId: "288720639525",
//   appId: "1:288720639525:web:f0bc44382d075aad9791cc",
//   measurementId: "G-EZWFWG1MKH"
// };

// export const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);


// function requestPermission() {
//   console.log('Requesting permission...');
//   Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
//       console.log('Notification permission granted.');
//       // const messaging = getMessaging();
//       getToken(messaging, { vapidKey: 'BHcm5BFwgxOQ6nj2L-HuNsXLSQh1qVspsflueKVlE4INPULAkbY6yTmHuFWc' }).then((currentToken) => {
//         if (currentToken) {
//           console.log(currentToken)
//           // Send the token to your server and update the UI if necessary
//           // ...
//         } else {
//           // Show permission request UI
//           console.log('No registration token available. Request permission to generate one.');
//           // ...
//         }
//       }).catch((err) => {
//         console.log('An error occurred while retrieving token. ', err);
//         // ...
//       });
//     }
//   })
// }

// requestPermission();








// importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');



// const firebaseConfig = {
//   apiKey: "AIzaSyDikFvbB7WtjJWq0C02tT9QzvFXfZsgmM0",
//   authDomain: "pideya-f502d.firebaseapp.com",
//   projectId: "pideya-f502d",
//   storageBucket: "pideya-f502d.appspot.com",
//   messagingSenderId: "288720639525",
//   appId: "1:288720639525:web:f0bc44382d075aad9791cc",
//   measurementId: "G-EZWFWG1MKH"
// };

// const app = firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging(app);

// messaging.onBackgroundMessage(payload => {
//   console.log('Recibiste mensaje mientras estabas ausente');

//   // Previo a mostrar notificacion
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/logo192.png',
//   }

//   return self.ServiceWorkerRegistration.showNotification(
//     notificationTitle, 
//     notificationOptions,
//   );
// });




// importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging-compat.js');

// const firebaseConfig = {
//   apiKey: "AIzaSyDikFvbB7WtjJWq0C02tT9QzvFXfZsgmM0",
//   authDomain: "pideya-f502d.firebaseapp.com",
//   projectId: "pideya-f502d",
//   storageBucket: "pideya-f502d.appspot.com",
//   messagingSenderId: "288720639525",
//   appId: "1:288720639525:web:f0bc44382d075aad9791cc"
// };

// // Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging(app);


// messaging.onBackgroundMessage(payload => {
//   console.log('Recibiste mensage mientras estabas ausente');

//   // previo a mostrar notificaccion
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/logo192.png'
//   }

//   return self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   )
// })