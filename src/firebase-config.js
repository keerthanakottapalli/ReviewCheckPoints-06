import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDD6YZm2vcDGYrPoMJGN6WPWTluyzKahSk",
    authDomain: "clouddemo-2e42b.firebaseapp.com",
    projectId: "clouddemo-2e42b",
    storageBucket: "clouddemo-2e42b.appspot.com",
    messagingSenderId: "644022241974",
    appId: "1:644022241974:web:7ed1bf6cf3ca496763b417",
    measurementId: "G-25998DYZT5"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
