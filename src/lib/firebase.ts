import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Production Firebase configuration for healing-4e915
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBaKzr7dY3R8CBS6X-GdRkqEwfRYZu3sX8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "healing-4e915.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "healing-4e915",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "healing-4e915.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "467674554992",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:467674554992:web:d4957d5eb54192bc25cab5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-8SDYD1CEW2",
};

let app: FirebaseApp;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);

  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    try {
      analytics = getAnalytics(app);
    } catch {
      // Analytics might not initialize in non-supported environments
    }
  }
} catch (error) {
  console.warn("Firebase initialization notice:", error);
  db = null;
}

export { app, db, analytics };
