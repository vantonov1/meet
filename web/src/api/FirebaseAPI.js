import * as firebaseui from "firebaseui";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import {MessagingAPI} from "./MessagingAPI";

const firebaseConfig = {
    apiKey: "AIzaSyBhLc5GOWnVT60daI1UdNQt-ARUe0f6Mok",
    authDomain: "meetilka.firebaseapp.com",
    databaseURL: "https://meetilka.firebaseio.com",
    projectId: "meetilka",
    storageBucket: "meetilka.appspot.com",
    messagingSenderId: "534129874386",
    appId: "1:534129874386:web:61ff135fda1f14199ea40b"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.usePublicVapidKey("BHPJqTIEee5wJejOzxUjjyBHcPgCfjl0jg1fNVDnFHqA6N-iqJDX9lx9SyTJM7LW1kfmtdk-duFDQ7X3eNEClEE");

function registerToken() {
    messaging.getToken().then((refreshedToken) => {
       if (agentId) {
            MessagingAPI.registerToken(agentId, refreshedToken)
                .catch(e => console.log("Unable to send token to server", e));
        }
        const customerId = localStorage.getItem("customerId");
        if (customerId) {
            MessagingAPI.registerToken(customerId, refreshedToken)
                .catch(e => console.log("Unable to send token to server", e));
        }
    }).catch(e => console.log('Unable to retrieve refreshed token ', e));
}

export function onMessageReceived(callback) {
    messaging.onMessage((message => callback(message)))
}

export function initFirebase() {
    if (localStorage.getItem("signedToFirebase")) {
        return new Promise(function (resolve, reject) {
            const unsubscribe = firebaseApp.auth().onAuthStateChanged(function (user) {
                unsubscribe();
                user.getIdTokenResult().then((result) => {
                    let admin = result.claims["admin"];
                    let agent = result.claims["agent"];
                    roles = [];
                    if (admin) roles.push('ROLE_ADMIN');
                    if (agent) roles.push('ROLE_AGENT');
                    agentId = agent;

                    registerToken();
                    messaging.onTokenRefresh(() => {
                        registerToken();
                    });

                    resolve(user.uid)
                })
            });
        });
    } else {
        firebase.auth().onAuthStateChanged(() => {
            localStorage.setItem("signedToFirebase", "true");
        });
    }
}

let roles = null;
let agentId = null;

export function getRoles() {
    return roles;
}

export function getAgentId() {
    return agentId;
}

export async function getAuthToken() {
    if (localStorage.getItem("signedToFirebase")) {
        let currentUser = firebase.auth().currentUser;
        return await currentUser?.getIdToken(false)
    } else
        return null;
}

export function showAuth() {
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    firebase.auth().languageCode = 'ru';
    setTimeout(() => {
        ui.start('#firebaseui-auth-container', {
            signInSuccessUrl: window.location.href,
            signInFlow: 'redirect',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
        })
    }, 100);
};
