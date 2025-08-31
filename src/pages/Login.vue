<template>
  <div class="container py-4" style="max-width:560px">
    <h2 class="h4 mb-3">Login</h2>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="row g-3">
        <!-- Email -->
        <div class="col-12">
          <label class="form-label" for="email">Email</label>
          <input id="email"
                 v-model.trim="email"
                 type="email"
                 class="form-control"
                 placeholder="name@example.com"
                 @blur="validateEmail(true)"
                 @input="validateEmail(false)" />
          <div v-if="errors.email" class="text-danger small">{{ errors.email }}</div>
        </div>

        <!-- Password -->
        <div class="col-12">
          <label class="form-label" for="password">Password</label>
          <input id="password"
                 v-model="password"
                 type="password"
                 class="form-control"
                 placeholder="Your password"
                 @blur="validatePassword(true)"
                 @input="validatePassword(false)" />
          <div v-if="errors.password" class="text-danger small">{{ errors.password }}</div>
        </div>

        <!-- Form-level error -->
        <div class="col-12">
          <div v-if="formError" class="text-danger small">{{ formError }}</div>
        </div>

        <div class="col-12">
          <button class="btn btn-primary w-100">Login</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

function getUsers(): any[] {
  return JSON.parse(localStorage.getItem('fit_users') || '[]')
}
function setLoggedInUser(userSummary: any) {
  localStorage.setItem('fit_user', JSON.stringify(userSummary))
  // notify navbar to refresh
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

function onSubmit() {
  validateEmail(true)
  validatePassword(true)
  if (errors.value.email || errors.value.password) return

  const users = getUsers()
  const user = users.find(u => u.email === email.value.trim())
  if (!user || user.password !== password.value) {
    formError.value = 'Invalid email or password'
    return
  }

  setLoggedInUser({ id: user.id, name: user.name, email: user.email, pronoun: user.pronoun })
  router.push('/') // go home
}
</script>