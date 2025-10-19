<template>
  <nav class="navbar navbar-expand-lg bg-light" role="navigation" aria-label="Main navigation">
    <div class="container">
      <!-- Brand -->
      <a class="navbar-brand" href="/" @click.prevent="$router.push('/')" aria-label="Go to home page">
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
            <button
              class="avatar-btn"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              :title="currentUser.name"
              aria-haspopup="true"
              aria-controls="user-menu"
            >
              {{ initials(currentUser.name) }}
            </button>
            <ul id="user-menu" class="dropdown-menu dropdown-menu-end" role="menu">
              <li class="dropdown-item-text small text-muted">Hi, {{ currentUser.name }}</li>
              <li><hr class="dropdown-divider" /></li>
              <!--  Profile entry -->
              <li>
                <RouterLink class="dropdown-item" to="/profile">Profile</RouterLink>
              </li>
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
          <!-- Health Hub -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Health Hub</a>
            <ul class="dropdown-menu">
              <li><RouterLink class="dropdown-item" to="/health/physical">Physical Health</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/health/mental">Mental Wellbeing</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/health/lgbtq">LGBTQ+ Topics</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/health/resources">Resources</RouterLink></li>
              <li><router-link to="/FitnessTips" class="dropdown-item">Fitness Tips</router-link></li>
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
              <li><RouterLink class="dropdown-item" to="/profile">Profile</RouterLink></li>
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
import { getAuth, signOut } from 'firebase/auth'

const router = useRouter()
const auth = getAuth()

// Firebase's uid is a string, so changing the id type to string is more accurate.
type User = { id: string; name: string; email: string; pronoun?: string } | null
const currentUser = ref<User>(loadUser())

function loadUser(): User {
  const raw = localStorage.getItem('fit_user')
  return raw ? JSON.parse(raw) : null
}
function handleAuthChanged() {
  currentUser.value = loadUser()
}
async function logout() {
  try { await signOut(auth) } catch {}
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
.navbar {
  background-color: #000 !important;
  padding: 0.75rem 1rem;
}

.nav-link {
  color: #fff !important;
  font-weight: 600;
  margin-right: 1rem;
  transition: color 0.2s ease;
}

.nav-link:hover,
.navbar-brand:hover {
  color: #ffcc00 !important; /* when hover turn yellow */
}

/* brand */
.navbar-brand {
  color: #fff !important;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* login button */
.btn-outline-light {
  border: 1px solid #fff;
  color: #fff;
  font-weight: 600;
}
.btn-outline-light:hover {
  background-color: #fff;
  color: #000;
}

/* circle profile pic */
.avatar-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: #222;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* dropdown menu */
.dropdown-menu {
  background-color: #111 !important; 
  border: 1px solid #333;
}

.dropdown-item {
  color: #fff !important;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #222 !important;
  color: #ffcc00 !important; 
}

.dropdown-divider {
  border-color: #333 !important;
}
</style>
