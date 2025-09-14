<!-- src/components/RatingStars.vue -->
<template>
  <div class="d-flex align-items-center gap-2">
    <!-- rating button -->
    <div class="stars">
      <button
        v-for="n in 5"
        :key="n"
        class="btn star-btn"
        :class="(myRating >= n) ? 'btn-warning' : 'btn-outline-secondary'"
        @click="rate(n)"
        :disabled="saving"
      >
        ★
      </button>
    </div>

    <!-- Average -->
    <small class="text-muted" v-if="count >= 0">
      <span v-if="count > 0">Avg {{ avg.toFixed(1) }} / 5 ({{ count }})</span>
      <span v-else>No ratings</span>
    </small>
  </div>
</template>

<style scoped>
/* Horizontally centered, no line breaks */
.rating-wrap{
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.stars{
  display: inline-flex;
  gap: 6px;
  flex-wrap: nowrap;
  white-space: nowrap;
}

/* circle button */
.star-btn{
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 0;
  line-height: 24px;               /* Vertical center */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
}

/* Smaller star button when zoom out the screen */
@media (max-width: 420px){
  .star-btn{
    width: 28px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/app'

const props = defineProps<{ itemId: string }>()

const myRating = ref<number>(0)
const avg = ref(0)
const count = ref(-1) // -1 is still loading
const saving = ref(false)

function ratingDoc(uid: string) {// items
  return doc(db, 'items', props.itemId, 'ratings', uid)
}

async function loadMy() {
  const uid = getAuth().currentUser?.uid
  if (!uid) { myRating.value = 0; return }
  const snap = await getDoc(ratingDoc(uid))
  myRating.value = snap.exists() ? ((snap.data() as any).value ?? 0) : 0
}

async function loadAvg() {
  const col = collection(db, 'items', props.itemId, 'ratings')
  const snap = await getDocs(col)
  let sum = 0, c = 0
  snap.forEach(d => {
    const v = (d.data() as any).value
    if (typeof v === 'number') { sum += v; c += 1 }
  })
  count.value = c
  avg.value = c > 0 ? sum / c : 0
}

async function rate(n: number) {
  const user = getAuth().currentUser
  if (!user) { alert('Please login to rate.'); return }
  saving.value = true
  try {
    await setDoc(ratingDoc(user.uid), { value: n, updatedAt: serverTimestamp() }, { merge: true })
    await Promise.all([loadMy(), loadAvg()])
  } finally {
    saving.value = false
  }
}

const onAuthChanged = async () => { await Promise.all([loadMy(), loadAvg()]) }

onMounted(async () => {
  await Promise.all([loadMy(), loadAvg()])
  window.addEventListener('fit-auth-changed', onAuthChanged)
})

onBeforeUnmount(() => {
  window.removeEventListener('fit-auth-changed', onAuthChanged)
})

watch(() => props.itemId, async () => {
  count.value = -1
  await Promise.all([loadMy(), loadAvg()])
})
</script>
