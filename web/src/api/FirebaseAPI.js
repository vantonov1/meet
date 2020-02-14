import * as firebaseui from "firebaseui";
import firebase from 'firebase/app';
import 'firebase/auth';
import AuthAPI from "./AuthAPI";

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

let roles = [];

export function getRoles() {
    return roles;
}

export async function initFirebase() {
    if(getAuthToken() != null) {
        roles = await AuthAPI.getAuthorities()
    }
}

export function getAuthToken() {
    return localStorage.getItem("firebaseToken");
}

function setAuthToken(token) {
    localStorage.setItem("firebaseToken", token);
}

export function showAuth() {
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    firebase.auth().languageCode = 'ru';
    setTimeout(() => {
        ui.start('#firebaseui-auth-container', {
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                    firebase.auth().currentUser.getIdToken(false).then(idToken => {
                        setAuthToken(idToken);
                    });
                    return true;
                },
            },
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
