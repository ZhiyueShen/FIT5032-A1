import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// base pages
import HomePage from './pages/HomePage.vue'
import HealthHub from './pages/HealthHub.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/health', name: 'health', component: HealthHub },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
