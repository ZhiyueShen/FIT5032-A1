<template>
    <div class="container py-4" style="max-width:560px">
        <h2 class="h4 mb-3">Register</h2>

        <form @submit.prevent="onSubmit" novalidate>
        <div class="row g-3">
            <!-- Name -->
            <div class="col-12 col-md-6">
            <label class="form-label" for="name">Name</label>
            <input id="name"
                    v-model.trim="name"
                    class="form-control"
                    @blur="validateName(true)"
                    @input="validateName(false)" />
            <div v-if="errors.name" class="text-danger small">{{ errors.name }}</div>
            </div>

            <!-- Email -->
            <div class="col-12 col-md-6">
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
            <div class="col-12 col-md-6">
            <label class="form-label" for="password">Password</label>
            <input id="password"
                    v-model="password"
                    type="password"
                    class="form-control"
                    @blur="validatePassword(true)"
                    @input="validatePassword(false)" />
            <div v-if="errors.password" class="text-danger small">{{ errors.password }}</div>
            </div>

            <!-- Pronoun (optional) -->
            <div class="col-12 col-md-6">
            <label class="form-label" for="pronoun">Pronoun (optional)</label>
            <select id="pronoun" v-model="pronoun" class="form-select">
                <option value="">Prefer not to say</option>
                <option value="he/him">He / Him</option>
                <option value="she/her">She / Her</option>
                <option value="they/them">They / Them</option>
            </select>
            </div>

            <!-- Form-level error -->
            <div class="col-12">
            <div v-if="formError" class="text-danger small">{{ formError }}</div>
            </div>

            <!-- Submit -->
            <div class="col-12">
            <button class="btn btn-primary w-100">Create Account</button>
            </div>

            <!-- User list -->
            <div v-if="users.length" class="mt-4">
            <h5>Registered Users</h5>
            <DataTable :value="users" tableStyle="min-width: 20rem">
                <Column field="name" header="Name" />
                <Column field="email" header="Email" />
                <Column field="pronoun" header="Pronoun" />
            </DataTable>
            </div>
        </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// form state
const name = ref('')
const email = ref('')
const password = ref('')
const pronoun = ref<string>('')

// error states
const formError = ref('')
const errors = ref<{ name: string|null; email: string|null; password: string|null }>({
    name: null,
    email: null,
    password: null,
})

// helpers
const required = (v: any) => (v ?? '').toString().trim().length > 0
const isEmail  = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const minLen   = (v: string, n: number) => (v ?? '').length >= n

const users = ref<any[]>(getUsers())

function getUsers(): any[] {
    return JSON.parse(localStorage.getItem('fit_users') || '[]')
}
function saveUsers(arr: any[]) {
    localStorage.setItem('fit_users', JSON.stringify(arr))
}
function setLoggedInUser(userSummary: any) {
    localStorage.setItem('fit_user', JSON.stringify(userSummary))
}

// XSS guard for name only
function sanitise(str = '') {
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

// validators
const validateName = (blur: boolean) => {
    if (!required(name.value) || name.value.length < 3) { // Check if the name is >= 3 characters
        if (blur) errors.value.name = 'Name must be at least 3 characters'
    } else {
        errors.value.name = null
    }
}
const validateEmail = (blur: boolean) => { // The email format must be correct
    if (!isEmail(email.value)) {
        if (blur) errors.value.email = 'Invalid email format'
    } else {
        errors.value.email = null
    }
}
const validatePassword = (blur: boolean) => { // Password conditions: 8 characters + uppercase and lowercase + special characters
  const minLength = 8
  const value = password.value

  if (!minLen(value, minLength)) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!/[A-Z]/.test(value)) {
    if (blur) errors.value.password = 'Password must include at least one uppercase letter.'
  } else if (!/[a-z]/.test(value)) {
    if (blur) errors.value.password = 'Password must include at least one lowercase letter.'
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    if (blur) errors.value.password = 'Password must include at least one special character.'
  } else {
    errors.value.password = null
  }
}

//Submit
function onSubmit() {
    validateName(true)
    validateEmail(true)
    validatePassword(true)

    if (errors.value.name || errors.value.email || errors.value.password) return

    const exists = users.value.find(u => u.email === email.value)
    if (exists) {
        formError.value = 'Email already exists'
        return
    }

    // Prevent people from writing <script> or something like that in the name
    const user = {
        id: Date.now(),
        name: sanitise(name.value),
        email: email.value.trim(),
        password: password.value,
        pronoun: pronoun.value,
    }

    users.value.push(user)
    saveUsers(users.value)

    setLoggedInUser({ id: user.id, name: user.name, email: user.email, pronoun: user.pronoun })

    name.value = ''
    email.value = ''
    password.value = ''
    pronoun.value = ''
}
</script>
