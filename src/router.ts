import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// base pages
import HomePage from './pages/HomePage.vue'
import HealthHub from './pages/HealthHub.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import Profile from './pages/Profile.vue'
import AdminPage from './views/AdminPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/health', name: 'health', component: HealthHub },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile, alias: ['/my-space/profile', '/settings'] },
  { path: '/my-space/saved', name: 'Saved', component: () => import('./pages/Saved.vue') },
  { path: '/admin', name: 'admin', component: AdminPage, meta: { requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('fit_user')
  const user = userStr ? JSON.parse(userStr) : null

  // 访问 /admin 时校验权限
  if (to.meta.requiresAdmin) {
    if (!user || user.role !== 'admin') {
      alert('Access denied: admin only')
      return next('/') // 回到主页
    }
  }
  next()
})

export default createRouter({
  history: createWebHistory(),
  routes,
})
