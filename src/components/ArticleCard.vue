<template>
  <article class="card h-100 shadow-sm article-card" role="article" aria-labelledby="card-title">
    <figure class="m-0">
      <img
        v-if="item.image"
        :src="item.image"
        class="card-img-top"
        :alt="`Thumbnail image for ${item.title}`"
        :aria-describedby="`desc-${item.id}`"
      />
    </figure>

    <!-- article -->
    <div class="card-body">
      <h2 :id="`card-title-${item.id}`" class="card-title h5">
        {{ item.title }}
      </h2>
      <p :id="`desc-${item.id}`" class="card-text text-muted">
        {{ item.summary }}
      </p>
    </div>

    <!-- rating -->
    <footer
      class="card-footer bg-white py-2 rating-footer"
      aria-label="Article rating section"
    >
      <div class="d-flex justify-content-between align-items-center">
        <p class="text-muted small mb-0" aria-hidden="true">Rate</p>
        <RatingStars :item-id="item.id" aria-label="Star rating control" />
      </div>
    </footer>

    <!-- button area -->
    <footer
      class="card-footer bg-white d-flex justify-content-between align-items-center action-footer"
      aria-label="Article actions"
    >
      <a
        v-if="item.link"
        class="btn btn-sm btn-outline-secondary"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Learn more about this article (opens in new tab)"
      >
        Learn more →
      </a>
      <span
        v-else
        class="text-muted small"
        aria-label="Placeholder content not linked"
      >
        Demo content
      </span>

      <!-- saving -->
      <button
        class="btn btn-sm"
        :class="isSaved ? 'btn-danger' : 'btn-outline-danger'"
        :disabled="toggling"
        @click="toggleSave"
        :aria-pressed="isSaved"
        :aria-label="isSaved ? 'Remove from saved articles' : 'Save this article'"
      >
        <span v-if="isSaved" aria-hidden="true">♥</span>
        <span v-else aria-hidden="true">♡</span>
      </button>
    </footer>
  </article>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/app'
import RatingStars from './RatingStars.vue'

interface Article {
  id: string;
  title: string;
  summary?: string;
  image?: string;
  link?: string;
  category?: string;
  author?: string;
  publish_date?: string;
  views?: number;
  visible?: boolean;
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
        title: props.item.title || "",
        summary: props.item.summary ?? "",
        link: props.item.link || "",
        image: props.item.image || "",
        author: props.item.author || "",
        category: props.item.category || "",
        createdAt: serverTimestamp(),
        source: "articles",
      }, { merge: true })
      isSaved.value = true
    }
  } finally {
    toggling.value = false
  }
}

onMounted(checkSaved)
// Refresh your saving situation
window.addEventListener('fit-auth-changed', checkSaved)
</script>

<style scoped>
.article-card img { object-fit: cover; height: 180px; }
.rating-footer { border-top: 1px solid #eee; }
.action-footer { border-top: 0; padding-top: .25rem; }
.rating-footer :deep(.rating-stars) { flex-wrap: nowrap; } /* Minimum width */ 
</style>