<template>
  <div class="container py-4" style="max-width:640px">
    <h2 class="h4 mb-3">My Profile</h2>

    <!-- 加载中 -->
    <div v-if="loading" class="text-muted">Loading...</div>

    <!-- 表单 -->
    <form v-if="uid && !loading" @submit.prevent="save" novalidate>
      <div class="row g-3">
        <!-- Name -->
        <div class="col-12">
          <label class="form-label" for="name">Name</label>
          <input
            id="name"
            v-model.trim="name"
            class="form-control"
            type="text"
            placeholder="Your display name"
            @blur="validateName(true)"
            @input="validateName(false)"
          />
          <div v-if="errors.name" class="text-danger small">{{ errors.name }}</div>
        </div>

        <!-- Email（只读，来自 Auth） -->
        <div class="col-12">
          <label class="form-label" for="email">Email</label>
          <input id="email" v-model="email" class="form-control" type="email" readonly />
          <div class="form-text">Email comes from Firebase Auth and is read-only.</div>
        </div>

        <!-- Pronoun（下拉选项） -->
        <div class="col-12">
          <label class="form-label" for="pronoun">Pronoun</label>
          <select id="pronoun" v-model="pronoun" class="form-select">
            <option v-for="opt in pronounOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <div class="form-text">Please choose one option.</div>
        </div>

        <div class="col-12">
          <div v-if="formError" class="text-danger small mb-2">{{ formError }}</div>
          <div v-if="formOk" class="text-success small mb-2">{{ formOk }}</div>

          <button class="btn btn-primary" :disabled="saving">Save changes</button>
          <button
            class="btn btn-outline-secondary ms-2"
            type="button"
            :disabled="saving"
            @click="resetForm"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/app' // 用你项目里导出的实例

// UI 状态
const loading   = ref(true)
const saving    = ref(false)
const formOk    = ref('')
const formError = ref('')

// 表单状态
const uid     = ref<string | null>(null)
const name    = ref('')
const email   = ref('')
const pronoun = ref('prefer not to say')

// 校验
const errors   = ref<{ name: string | null }>({ name: null })
const validateName = (blur: boolean) => {
  if (name.value.trim().length < 3) {
    if (blur) errors.value.name = 'Name must be at least 3 characters'
  } else {
    errors.value.name = null
  }
}

// 代词白名单 + 规范化
const pronounOptions = ['he/him', 'she/her', 'they/them', 'prefer not to say']
function normalizePronoun(v?: string | null) {
  const x = (v ?? '').toString().toLowerCase().trim()
  const found = pronounOptions.find(p => p.toLowerCase() === x)
  return found ?? 'prefer not to say'
}

// 用用户 / Firestore 数据填表
function fillForm(data: any) {
  name.value    = (data?.name  ?? auth.currentUser?.displayName ?? '')
  email.value   = (data?.email ?? auth.currentUser?.email ?? '')
  pronoun.value = normalizePronoun(data?.pronoun)
}

// 重置（重新取 Firestore）
async function resetForm() {
  formOk.value = ''
  formError.value = ''
  if (!uid.value) return
  const snap = await getDoc(doc(db, 'users', uid.value))
  fillForm(snap.exists() ? snap.data() : null)
}

// 保存
async function save() {
  validateName(true)
  formOk.value = ''
  formError.value = ''
  if (errors.value.name) return
  if (!uid.value) {
    formError.value = 'Not signed in.'
    return
  }

  try {
    saving.value = true

    // 如有变化，顺带更新 Auth.displayName
    const newName = name.value.trim()
    if (auth.currentUser && newName && newName !== (auth.currentUser.displayName ?? '')) {
      await updateProfile(auth.currentUser, { displayName: newName })
    }

    // 合并写入 Firestore
    const payload = {
      name: newName,
      email: auth.currentUser?.email ?? email.value ?? null,
      pronoun: normalizePronoun(pronoun.value),
      updatedAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'users', uid.value), payload, { merge: true })

    // 同步本地 navbar 用信息
    localStorage.setItem('fit_user', JSON.stringify({
      id: uid.value, name: payload.name, email: payload.email, pronoun: payload.pronoun,
    }))
    window.dispatchEvent(new Event('fit-auth-changed'))

    formOk.value = 'Profile saved.'
  } catch (e: any) {
    formError.value = 'Save failed: ' + (e?.code || e?.message || 'unknown')
  } finally {
    saving.value = false
  }
}

// 监听登录状态并拉取 Firestore
onMounted(() => {
  const unsub = auth.onAuthStateChanged(async (u) => {
    loading.value = true
    formOk.value = ''
    formError.value = ''

    if (!u) {
      uid.value = null
      name.value = ''
      email.value = ''
      pronoun.value = 'prefer not to say'
      loading.value = false
      return
    }

    uid.value = u.uid
    fillForm(null) // 先用 Auth 预填

    try {
      const snap = await getDoc(doc(db, 'users', u.uid))
      if (snap.exists()) fillForm(snap.data())
    } catch (e) {
      console.warn('Fetch profile failed', e)
    } finally {
      loading.value = false
    }
  })
})
</script>
