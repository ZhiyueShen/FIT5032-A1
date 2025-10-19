<template>
  <main class="container py-4" style="max-width:560px" role="main" aria-labelledby="page-title">
    <h1 id="page-title" class="h4 mb-3">Login</h1>

    <form @submit.prevent="onSubmit" novalidate aria-label="Login form">
      <div class="row g-3">
        <!-- Email -->
        <div class="col-12">
          <label class="form-label" for="email">Email</label>
          <input
            id="email"
            v-model.trim="email"
            type="email"
            class="form-control"
            placeholder="name@example.com"
            @blur="validateEmail(true)"
            @input="validateEmail(false)"
            aria-describedby="emailHelp"
            required
          />
          <small id="emailHelp" class="visually-hidden">Enter your registered email address</small>
          <div v-if="errors.email" class="text-danger small" role="alert">
            {{ errors.email }}
          </div>
        </div>

        <!-- Password -->
        <div class="col-12">
          <label class="form-label" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Your password"
            @blur="validatePassword(true)"
            @input="validatePassword(false)"
            aria-describedby="passwordHelp"
            required
          />
          <small id="passwordHelp" class="visually-hidden">Enter your account password</small>
          <div v-if="errors.password" class="text-danger small" role="alert">
            {{ errors.password }}
          </div>
        </div>

        <!-- Form-level error -->
        <div class="col-12">
          <div v-if="formError" class="text-danger small" role="alert">
            {{ formError }}
          </div>
        </div>

        <div class="col-12">
          <button
            class="btn btn-primary w-100"
            type="submit"
            aria-label="Login to your account"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  </main>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/app' 

const router = useRouter()
const auth = getAuth()

// state
const email = ref('')
const password = ref('')

// error state
const formError = ref('')
const errors = ref<{ email: string|null; password: string|null }>({
  email: null,
  password: null,
})

// helpers
const isEmail  = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const minLen   = (v: string, n: number) => (v ?? '').length >= n

function setLoggedInUser(userSummary: any) {
  localStorage.setItem('fit_user', JSON.stringify(userSummary))
  // wait
  window.dispatchEvent(new Event('fit-auth-changed'))
}

// validators
const validateEmail = (blur: boolean) => {
  if (!isEmail(email.value)) {
    if (blur) errors.value.email = 'Invalid email format'
  } else {
    errors.value.email = null
  }
}
const validatePassword = (blur: boolean) => {
  const ok = minLen(password.value, 1)
  if (!ok) {
    if (blur) errors.value.password = 'Password is required'
  } else {
    errors.value.password = null
  }
}

async function onSubmit() {
  validateEmail(true)
  validatePassword(true)
  formError.value = ''
  if (errors.value.email || errors.value.password) return

  try {
    const { user } = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )

    // From Firestore read profile（users/{uid}）
    let profile: any = null
    try {
      const snap = await getDoc(doc(db, 'users', user.uid))
      profile = snap.exists() ? snap.data() : null
      console.log("🔥 Firestore profile:", profile)
    } catch (err) {
      // Use auth 
      console.warn('Fetch profile failed:', err)
    }

    const summary = {
      id: user.uid,
      name: profile?.name ?? user.displayName ?? (user.email?.split('@')[0] ?? 'User'),
      email: profile?.email ?? user.email,
      pronoun: profile?.pronoun ?? null,
      role: profile?.role ?? 'user', 
    }
    setLoggedInUser(summary)

    router.push('/') // Back to homepage
  } catch (e: any) {
    const code = e?.code || ''
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      formError.value = 'Invalid email or password'
    } else {
      formError.value = `Sign in failed: ${code}`
    }
  }
}
</script>