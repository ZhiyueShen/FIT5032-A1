<template>
    <AppNavbar />
    <RouterView />
</template>

<script setup lang="ts">
import AppNavbar from './components/AppNav.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

let unsub: (() => void) | undefined

onMounted(() => {
  const auth = getAuth()
  unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      const summary = {
        id: user.uid,
        name: user.displayName || (user.email?.split('@')[0] ?? 'User'),
        email: user.email,
        pronoun: JSON.parse(localStorage.getItem('fit_user') || 'null')?.pronoun ?? null, // 若你在别处收集了 pronoun，这里合并一下
      }
      localStorage.setItem('fit_user', JSON.stringify(summary))
    } else {
      localStorage.removeItem('fit_user')
    }
    window.dispatchEvent(new Event('fit-auth-changed'))
  })
})

onBeforeUnmount(() => {
  unsub && unsub()
})
</script>


<style>

</style>