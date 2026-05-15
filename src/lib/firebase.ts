import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Prevent duplicate app initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Use default Firestore database — custom DB IDs can fail on Android
let database;
try {
  database = getFirestore(app);
} catch (e) {
  console.warn("Firestore init failed:", e);
  database = getFirestore(app);
}

export const db = database;
export const auth = getAuth(app);

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    console.warn("Firebase connection test:", error);
  }
}
