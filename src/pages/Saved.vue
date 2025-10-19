<template>
  <main class="container py-4" style="max-width: 900px" role="main" aria-labelledby="page-title">
    <h1 id="page-title" class="h4 mb-3">Saved</h1>
    <div
      v-if="!uid"
      class="alert alert-warning"
      role="alert"
      aria-live="assertive"
    >
      Please login to view your saved content.
    </div>
    <div v-else>
      <div
        v-if="loading"
        class="text-muted"
        role="status"
        aria-live="polite"
      >
        Loading...
      </div>
      <div
        v-else-if="items.length === 0"
        class="text-muted"
        role="status"
        aria-live="polite"
      >
        No saved items yet.
      </div>
      <!-- card area -->
      <div v-else class="row g-3" role="list" aria-label="Saved items list">
        <div
          class="col-12 col-md-6 col-lg-4"
          v-for="it in items"
          :key="it.id"
          role="listitem"
        >
          <div class="card h-100 shadow-sm">
            <img
              v-if="it.image"
              :src="it.image"
              class="card-img-top"
              :alt="it.title || 'Saved item image'"
            />
            <div class="card-body">
              <h2 class="card-title h6">{{ it.title }}</h2>
              <p class="card-text text-muted">{{ it.summary }}</p>
            </div>
            <div class="card-footer bg-white d-flex justify-content-between">
              <a
                v-if="it.link"
                class="btn btn-sm btn-outline-secondary"
                :href="it.link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open {{ it.title }}"
              >
                Open
              </a>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="remove(it.id)"
                :disabled="removingId === it.id"
                aria-label="Remove {{ it.title }} from saved list"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/app'

// What a saved item looks like in the UI
type SavedItem = {
  id: string;
  title: string;
  summary?: string;
  image?: string | null;
  link?: string | null;
  author?: string;
  category?: string;
}

const uid = ref<string | null>(null)
const loading = ref(true)
const items = ref<SavedItem[]>([])
const removingId = ref<string>('')

//Helper
function savedColRef(u: string) {
  return collection(db, 'users', u, 'saved')
}

async function load() {
  if (!uid.value) return;
  loading.value = true;
  items.value = [];
  const q = query(savedColRef(uid.value), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  snap.forEach((d) => {
    const data = d.data() as any;
    if (data.source === "articles" || !data.source) {
      items.value.push({
        id: d.id,
        title: data.title,
        summary: data.summary || "",
        image: data.image || "",
        link: data.link || "",
        author: data.author || "",
        category: data.category || "",
      });
    }
  });

  loading.value = false;
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
