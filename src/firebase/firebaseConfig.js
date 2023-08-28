// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDikFvbB7WtjJWq0C02tT9QzvFXfZsgmM0",
  authDomain: "pideya-f502d.firebaseapp.com",
  projectId: "pideya-f502d",
  storageBucket: "pideya-f502d.appspot.com",
  messagingSenderId: "288720639525",
  appId: "1:288720639525:web:f0bc44382d075aad9791cc",
  measurementId: "G-EZWFWG1MKH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);


// export const suscribirToAdmin = () => {
  
//   const registrationTokens = [
//     'cnuHf2SI_-9hNF5yS_e7f7:APA91bF_DT501yiLakxFrRK4qYp0r-9n1qldvUVsxpbHqqDAad0ORBmhudXVlmyC5pFXmGJRTbkJZHDnGiBvcb-JgswXP9BKRWKOt1ROSjXAvmAUj37h_uF59PRxjKfc3oIVpkoiNcD4',
//     'cnuHf2SI_-9hNF5yS_e7f7:APA91bF_DT501yiLakxFrRK4qYp0r-9n1qldvUVsxpbHqqDAad0ORBmhudXVlmyC5pFXmGJRTbkJZHDnGiBvcb-JgswXP9BKRWKOt1ROSjXAvmAUj37h_uF59PRxjKfc3oIVpkoiNcD4',
//   ];
  
//   const message = {
//     data: {score: '850', time: '2:45'},
//     tokens: registrationTokens,
//   };
  
//   getMessaging().sendMulticast(message)
//     .then((response) => {
//       console.log(response.successCount + ' messages were sent successfully');
//     });

// }


























// export function requestPermission() {
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
//         console.log(err);
//         // ...
//       });
//     }
//   })
// }

// requestPermission();




// export function requestPermission() {
//   console.log('Requesting permission...');
//   Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
//       console.log('Notification permission granted.');
//       // getToken(messaging, {vapidKey: "BHcm5BFwgxOQ6nj2L-HuNsXLSQh1qVspsflueKVlE4INPULAkbY6yTmHuFWcp"});
//       getToken(messaging, { vapidKey: 'BHcm5BFwgxOQ6nj2L-HuNsXLSQh1qVspsflueKVlE4INPULAkbY6yTmHuFWcp' }).then((currentToken) => {
//         if (currentToken) {
//           console.error(currentToken)
//           // Send the token to your server and update the UI if necessary
//           // ...
//         } else {
//           // Show permission request UI
//           console.log('No registration token available. Request permission to generate one.');
//           // ...
//         }
//       }).catch((err) => {
//         console.log('An error occurred while retrieving token1. ', err);
//         // ...
//       });
//     }else {
//       console.log('no tienes permiso')
      
//     }
//   });
// }
// requestPermission();



  
