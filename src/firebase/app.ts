import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FB_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FB_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FB_APP_ID || "1:123456789:web:abcdef123456",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)