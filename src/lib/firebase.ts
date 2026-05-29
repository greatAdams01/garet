import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiIn3y-R-xDrDHhuXWXUVzrC2UPlaM3Sc",
  authDomain: "garet-2cc7a.firebaseapp.com",
  projectId: "garet-2cc7a",
  storageBucket: "garet-2cc7a.firebasestorage.app",
  messagingSenderId: "965906073525",
  appId: "1:965906073525:web:9e37a79de08a7b1ee63bfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
