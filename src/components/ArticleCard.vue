<template>
  <div class="card h-100 shadow-sm article-card">
    <img v-if="item.image" :src="item.image" class="card-img-top" :alt="item.title" />
    <div class="card-body">
      <h5 class="card-title">{{ item.title }}</h5>
      <p class="card-text text-muted">{{ item.summary }}</p>
    </div>

    <div class="card-footer bg-white d-flex justify-content-between align-items-center">
      <a v-if="item.link" class="btn btn-sm btn-outline-secondary" :href="item.link" target="_blank" rel="noopener">
        Learn more →
      </a>
      <span v-else class="text-muted small">Demo content</span>

      <button
        class="btn btn-sm"
        :class="isSaved ? 'btn-danger' : 'btn-outline-danger'"
        :disabled="toggling"
        @click="toggleSave"
        :title="isSaved ? 'Unsave' : 'Save'"
      >
        <span v-if="isSaved">♥</span>
        <span v-else>♡</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/app'

type Article = {
  id: string
  title: string
  summary: string
  image?: string
  link?: string
}

const props = defineProps<{ item: Article }>()
const isSaved = ref(false)
const toggling = ref(false)

function savedDocRef(uid: string) {
  return doc(db, 'users', uid, 'saved', props.item.id)
}

async function checkSaved() {
  const uid = getAuth().currentUser?.uid
  if (!uid) { isSaved.value = false; return }
  const snap = await getDoc(savedDocRef(uid))
  isSaved.value = snap.exists()
}

async function toggleSave() {
  const user = getAuth().currentUser
  if (!user) {
    alert('Please login to save.')
    return
  }
  try {
    toggling.value = true
    const ref = savedDocRef(user.uid)
    if (isSaved.value) {
      await deleteDoc(ref)
      isSaved.value = false
    } else {
      await setDoc(ref, {
        title: props.item.title,
        summary: props.item.summary,
        link: props.item.link ?? null,
        image: props.item.image ?? null,
        createdAt: serverTimestamp(),
      }, { merge: true })
      isSaved.value = true
    }
  } finally {
    toggling.value = false
  }
}

onMounted(checkSaved)
// 当登录状态变化时（你的 navbar 会触发 fit-auth-changed），同步刷新收藏状态
window.addEventListener('fit-auth-changed', checkSaved)
</script>

<style scoped>
.article-card img { object-fit: cover; height: 180px; }
</style>