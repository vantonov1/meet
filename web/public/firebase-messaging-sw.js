// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.9.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.9.3/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyBhLc5GOWnVT60daI1UdNQt-ARUe0f6Mok",
    authDomain: "meetilka.firebaseapp.com",
    databaseURL: "https://meetilka.firebaseio.com",
    projectId: "meetilka",
    storageBucket: "meetilka.appspot.com",
    messagingSenderId: "534129874386",
    appId: "1:534129874386:web:09b5a763921aa39d9ea40b"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();