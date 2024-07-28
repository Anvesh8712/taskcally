// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you need analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOVwk3oGDCtuu2Sx3kWnfkkBa_eB1kEY8",
  authDomain: "taskcally.firebaseapp.com",
  projectId: "taskcally",
  storageBucket: "taskcally.appspot.com",
  messagingSenderId: "330101023622",
  appId: "1:330101023622:web:23eaa32c8d3a02a8aec207",
  measurementId: "G-RCYE5E84VM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Uncomment if you need analytics

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, onAuthStateChanged };
