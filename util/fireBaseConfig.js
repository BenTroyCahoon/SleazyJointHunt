// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9zzuUb051FzoqyeD8NGvAx91HnqY_dN8",
  authDomain: "sleazyjointhunt.firebaseapp.com",
  databaseURL:
    "https://sleazyjointhunt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sleazyjointhunt",
  storageBucket: "sleazyjointhunt.appspot.com",
  messagingSenderId: "519709651416",
  appId: "1:519709651416:web:d0c7679f65ae85f2f9c2ad",
  measurementId: "G-7XW5Q23S4H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
