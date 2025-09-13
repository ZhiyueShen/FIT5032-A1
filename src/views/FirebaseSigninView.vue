<template>
  <div class="container py-3">
    <h1>Sign in</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button class="btn btn-primary" @click="signin">Sign in via Firebase</button></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()

const signin = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(() => {
      console.log('Firebase Register Successful!')
      router.push('/')               // 登录后跳首页（与讲义一致）
      console.log(auth.currentUser)  // 在控制台查看当前用户对象
    })
    .catch((error) => {
      console.log(error.code)
    })
}
</script>