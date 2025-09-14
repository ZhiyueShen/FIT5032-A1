import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// base pages
import HomePage from './pages/HomePage.vue'
import HealthHub from './pages/HealthHub.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import Profile from './pages/Profile.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/health', name: 'health', component: HealthHub },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile, alias: ['/my-space/profile', '/settings'] },
  { path: '/my-space/saved', name: 'Saved', component: () => import('./pages/Saved.vue') },

]

export default createRouter({
  history: createWebHistory(),
  routes,
})
