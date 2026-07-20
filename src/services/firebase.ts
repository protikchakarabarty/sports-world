import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getOptionalEnv } from '@/config/env';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (app) return app;

  const env = getOptionalEnv();
  const apiKey = env.firebaseApiKey;
  if (!apiKey) return null;

  app = getApps().length === 0
    ? initializeApp({
        apiKey,
        authDomain: env.firebaseAuthDomain || undefined,
        projectId: env.firebaseProjectId || undefined,
        storageBucket: env.firebaseStorageBucket || undefined,
        messagingSenderId: env.firebaseMessagingSenderId || undefined,
        appId: env.firebaseAppId || undefined,
      })
    : getApps()[0];

  return app;
}

export function getFirestoreDb(): Firestore | null {
  if (db) return db;
  const fb = getFirebaseApp();
  if (!fb) return null;
  db = getFirestore(fb);
  return db;
}
