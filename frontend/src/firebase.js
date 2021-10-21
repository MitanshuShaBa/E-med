// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApfxpL_6w5_Ju68gt0WhOqcoHuvIxytN4",
  authDomain: "e-med-40e29.firebaseapp.com",
  projectId: "e-med-40e29",
  storageBucket: "e-med-40e29.appspot.com",
  messagingSenderId: "677473567737",
  appId: "1:677473567737:web:62facabbbd7a332063f328",
  measurementId: "G-HSLB9D0J8M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
