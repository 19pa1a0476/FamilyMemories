import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCM_Q_rfnJHekGWXYGHcTKWm29VYChpxSg",
    authDomain: "family-album-50277.firebaseapp.com",
    projectId: "family-album-50277",
    storageBucket: "family-album-50277.firebasestorage.app",
    messagingSenderId: "42635602220",
    appId: "1:42635602220:web:986c952752e3ea2e5de489",
    measurementId: "G-6WNS02QYYR"
};

// Gemini Key
export const GEMINI_API_KEY = "AIzaSyBHYw_v94xd5OkTn2sUn95qUrabA3VwtL4";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = 'family-moments-web';