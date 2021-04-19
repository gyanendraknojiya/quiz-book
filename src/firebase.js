// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyCEf_WGVsUwmJq2ZEDxwORd85jyFl_TlMY",
  authDomain: "quiz-app-da004.firebaseapp.com",
  projectId: "quiz-app-da004",
  storageBucket: "quiz-app-da004.appspot.com",
  messagingSenderId: "446859754282",
  appId: "1:446859754282:web:bbe38dafac63964a157c53",
  measurementId: "G-MG8JZS50BR",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;
