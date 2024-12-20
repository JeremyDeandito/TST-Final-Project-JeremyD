import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAmS9SFsPrdyM1iytaY4pTSmaa-Pj29_zg",
    authDomain: "tst-final-project.firebaseapp.com",
    projectId: "tst-final-project",
    storageBucket: "tst-final-project.firebasestorage.app",
    messagingSenderId: "803693130067",
    appId: "1:803693130067:web:8bce5018ac2493202af1a6"
};
  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);