import { initializeApp } from "firebase/app";
import { getFirestore,doc, getDoc, setDoc, updateDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBgova_wd0NJXULIm4MQ6j3LW2Do0lI_pY",
    authDomain: "patient-medication-track-c8e73.firebaseapp.com",
    projectId: "patient-medication-track-c8e73",
    storageBucket: "patient-medication-track-c8e73.firebasestorage.app",
    messagingSenderId: "544246991928",
    appId: "1:544246991928:web:c12de36463683d54bf2acd",
    measurementId: "G-DSBQZYBHES"
  };
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc, updateDoc };
