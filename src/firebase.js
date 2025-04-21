import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCUy8ANKUAKjesPf3ckzLH9oRnX8vdF9Sg",
    authDomain: "country-app-frontend.firebaseapp.com",
    projectId: "country-app-frontend",
    storageBucket: "country-app-frontend.firebasestorage.app",
    messagingSenderId: "230841497155",
    appId: "1:230841497155:web:efd71becc3ced61bb346f6"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
