import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCtsA0YWhXDjT9PR8mM8GCsZey5scdgL7M",
  authDomain: "fit5032-a1-dd6a2.firebaseapp.com",
  projectId: "fit5032-a1-dd6a2",
  storageBucket: "fit5032-a1-dd6a2.appspot.com",
  messagingSenderId: "207455869828",
  appId: "1:207455869828:web:86b18584b7d6cc33c71bd1",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)