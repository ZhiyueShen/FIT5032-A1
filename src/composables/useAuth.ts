import { ref, onMounted } from 'vue'
import { auth, db } from '../firebase/app'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const currentUser = ref<any>(null)
export const userRole = ref<'user' | 'admin' | null>(null)

async function fetchRole(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid))
  userRole.value = snap.exists() ? (snap.data().role ?? 'user') : 'user'
}

export function useAuth() {
  onMounted(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        currentUser.value = { uid: u.uid, email: u.email, displayName: u.displayName }
        await fetchRole(u.uid)
      } else {
        currentUser.value = null
        userRole.value = null
      }
    })
  })

  const register = async (email: string, password: string, displayName?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) await updateProfile(cred.user, { displayName })
    await setDoc(doc(db, 'users', cred.user.uid), {
      email,
      displayName: displayName ?? '',
      role: 'user',
      createdAt: Date.now()
    })
  }

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  return { currentUser, userRole, register, login, logout }
}