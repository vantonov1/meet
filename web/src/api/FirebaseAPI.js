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

export function initFirebase() {
    if (localStorage.getItem("signedToFirebase")) {
        return new Promise(function (resolve, reject) {
            const unsubscribe = firebaseApp.auth().onAuthStateChanged(function (user) {
                unsubscribe();
                if (roles == null)
                    AuthAPI.getAuthorities().then((r) => {
                        roles = r;
                        resolve(user.uid);
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

export function getRoles() {
    return roles;
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
