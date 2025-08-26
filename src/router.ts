// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import HealthHub from './pages/HealthHub.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/health', name: 'health', component: HealthHub },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})