<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container">
      <!-- Brand -->
      <a class="navbar-brand" href="#" @click.prevent="$router.push('/')">
        Men's Health
      </a>

      <!-- right side login/signup or avatar -->
      <div class="d-flex align-items-center ms-auto gap-2 order-lg-3">
        <!-- not logged in -->
        <template v-if="!currentUser">
          <RouterLink class="nav-link px-2 text-uppercase small fw-semibold" to="/login">
            Log in
          </RouterLink>
          <RouterLink class="btn btn-outline-secondary rounded-pill px-3" to="/register">
            Sign up
          </RouterLink>
        </template>

        <!-- logged in -->
        <template v-else>
          <div class="dropdown">
            <button class="avatar-btn" data-bs-toggle="dropdown" aria-expanded="false" :title="currentUser.name">
              {{ initials(currentUser.name) }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li class="dropdown-item-text small text-muted">Hi, {{ currentUser.name }}</li>
              <li><hr class="dropdown-divider" /></li>
              <li><button class="dropdown-item" @click="logout">Logout</button></li>
            </ul>
          </div>
        </template>

        <!-- burger always at far right -->
        <button
          class="navbar-toggler ms-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- Collapsible content -->
      <div id="mainNav" class="collapse navbar-collapse order-lg-2">
        <ul class="navbar-nav mx-lg-auto mb-2 mb-lg-0">
          <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/about">About Us</RouterLink></li>
          <li class="nav-item">
            <router-link to="/FireLogin" class="nav-link" active-class="active">Firebase Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/FireRegister" class="nav-link" active-class="active">Firebase Register</router-link>
          </li>
          <!-- Health Hub -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Health Hub</a>
            <ul class="dropdown-menu">
              <li><RouterLink class="dropdown-item" to="/health/physical">Physical Health</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/health/mental">Mental Wellbeing</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/health/lgbtq">LGBTQ+ Topics</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/health/resources">Resources</RouterLink></li>
            </ul>
          </li>

          <!-- Tools -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Tools</a>
            <ul class="dropdown-menu">
              <li><RouterLink class="dropdown-item" to="/tools/self-checks">Self Checks</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/tools/forum">Forum & Stories</RouterLink></li>
            </ul>
          </li>

          <!-- only show my space if logged in -->
          <li class="nav-item dropdown" v-if="currentUser">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">My Space</a>
            <ul class="dropdown-menu">
              <li><RouterLink class="dropdown-item" to="/my-space/tracker">Health Tracker</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/my-space/saved">Saved Content</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/my-space/settings">Settings</RouterLink></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

type User = { id: number; name: string; email: string; pronoun?: string } | null
const currentUser = ref<User>(loadUser())

function loadUser(): User {
  const raw = localStorage.getItem('fit_user')
  return raw ? JSON.parse(raw) : null
}
function handleAuthChanged() {
  currentUser.value = loadUser()
}
function logout() {
  localStorage.removeItem('fit_user')
  window.dispatchEvent(new Event('fit-auth-changed'))
  router.push('/')
}
function initials(name?: string) {
  const n = (name || '').trim()
  if (!n) return 'U'
  const parts = n.split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase()).join('')
}

onMounted(() => {
  window.addEventListener('storage', handleAuthChanged)
  window.addEventListener('fit-auth-changed', handleAuthChanged)
})
onBeforeUnmount(() => {
  window.removeEventListener('storage', handleAuthChanged)
  window.removeEventListener('fit-auth-changed', handleAuthChanged)
})
</script>

<style scoped>
.nav-link { padding-left: 1rem; padding-right: 1rem; }

/* circular avatar placeholder */
.avatar-btn{
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 0;
  background: #e9ecef;
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 700; letter-spacing: .5px;
}
</style>
