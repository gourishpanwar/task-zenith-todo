// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual config values from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyB_3pVh-7gW09DqelV-kCMYG7ceJMCFX3Y",
  authDomain: "task-app-179de.firebaseapp.com",
  projectId: "task-app-179de",
  storageBucket: "task-app-179de.firebasestorage.app",
  messagingSenderId: "380724500322",
  appId: "1:380724500322:web:07079547a4a97c9c78fe3b",
  measurementId: "G-9R6EB3E477"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };