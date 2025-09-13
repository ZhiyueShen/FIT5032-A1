<template>
  <div class="container py-4" style="max-width: 900px">
    <h2 class="h4 mb-3">Saved</h2>

    <div v-if="!uid" class="alert alert-warning">
      Please login to view your saved content.
    </div>

    <div v-else>
      <div v-if="loading" class="text-muted">Loading...</div>

      <div v-else-if="items.length === 0" class="text-muted">No saved items yet.</div>

      <div v-else class="row g-3">
        <div class="col-12 col-md-6 col-lg-4" v-for="it in items" :key="it.id">
          <div class="card h-100 shadow-sm">
            <img v-if="it.image" :src="it.image" class="card-img-top" :alt="it.title" />
            <div class="card-body">
              <h5 class="card-title">{{ it.title }}</h5>
              <p class="card-text text-muted">{{ it.summary }}</p>
            </div>
            <div class="card-footer bg-white d-flex justify-content-between">
              <a v-if="it.link" class="btn btn-sm btn-outline-secondary" :href="it.link" target="_blank">Open</a>
              <button class="btn btn-sm btn-outline-danger" @click="remove(it.id)" :disabled="removingId===it.id">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/app'

type SavedItem = {
  id: string
  title: string
  summary?: string
  image?: string|null
  link?: string|null
}

const uid = ref<string | null>(null)
const loading = ref(true)
const items = ref<SavedItem[]>([])
const removingId = ref<string>('')

function savedColRef(u: string) {
  return collection(db, 'users', u, 'saved')
}

async function load() {
  if (!uid.value) return
  loading.value = true
  items.value = []
  const q = query(savedColRef(uid.value), orderBy('createdAt','desc'))
  const snap = await getDocs(q)
  snap.forEach(d => items.value.push({ id: d.id, ...(d.data() as any) }))
  loading.value = false
}

async function remove(id: string) {
  if (!uid.value) return
  removingId.value = id
  await deleteDoc(doc(db, 'users', uid.value, 'saved', id))
  items.value = items.value.filter(x => x.id !== id)
  removingId.value = ''
}

onMounted(() => {
  onAuthStateChanged(getAuth(), (u) => {
    uid.value = u?.uid ?? null
    load()
  })
})
</script>
