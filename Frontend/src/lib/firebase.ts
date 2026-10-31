// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyD7SBd0Xog1l3NazoGQ6Ff8oqD248f7Uoo",
  authDomain: "vlearn-7a504.firebaseapp.com",
  projectId: "vlearn-7a504",
  storageBucket: "vlearn-7a504.firebasestorage.app",
  messagingSenderId: "956190599828",
  appId: "1:956190599828:web:09e3caf68f21c496ede281",
  measurementId: "G-LJXNHPGR9F",
};

// Initialize Firebase singleton
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics (client-side only with window check)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch {
    // Analytics is non-critical during development/offline
  }
}

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export { app, analytics };
export default app;

