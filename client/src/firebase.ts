import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAmS9SFsPrdyM1iytaY4pTSmaa-Pj29_zg",
    authDomain: "tst-final-project.firebaseapp.com",
    projectId: "tst-final-project",
    storageBucket: "tst-final-project.appspot.com",
    messagingSenderId: "803693130067",
    appId: "1:803693130067:web:8bce5018ac2493202af1a6"
};
  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);