// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API,
  authDomain: "taskmanager-a.firebaseapp.com",
  projectId: "taskmanager-a",
  storageBucket: "taskmanager-a.appspot.com",
  messagingSenderId: "38984286367",
  appId: "1:38984286367:web:f836832ea104420f1622aa",
  measurementId: "G-126RV13WS7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);




//fhoJ4LpfpmPaXGvez5gqgI78QD2A