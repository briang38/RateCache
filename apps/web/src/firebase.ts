import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REMOVED",
  authDomain: "ratecache-34a84.firebaseapp.com",
  projectId: "ratecache-34a84",
  storageBucket: "ratecache-34a84.firebasestorage.app",
  messagingSenderId: "56464029138",
  appId: "1:56464029138:web:f02f7b117a30dc2536840b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);




