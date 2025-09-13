<template>
  <div class="container py-3">
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button class="btn btn-primary" @click="register">Save to Firebase</button></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Firebase Register Successful!')
      console.log('connected projectId =', getAuth().app.options.projectId)
      router.push('/FireLogin')   // 按课件：注册后跳到 FireLogin
    })
    .catch((e:any) => {
        console.error('❌ register error:', e.code, e.message)
        alert(`Register failed: ${e.code}\n${e.message}`)
    })
}
</script>
