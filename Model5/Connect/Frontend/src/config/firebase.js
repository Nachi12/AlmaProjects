import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvExttOFQDbPnIqLsZXSuGbwLc1N6sMvY",
  authDomain: "connetct-834c8.firebaseapp.com",
  projectId: "connetct-834c8",
  storageBucket: "connetct-834c8.firebasestorage.app",
  messagingSenderId: "848812336374",
  appId: "1:848812336374:web:5d3ae82ab68ab73f2a78d7",
  measurementId: "G-8X7QWLEP6C"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();