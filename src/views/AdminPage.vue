<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-black bg-gray-50">
    
    <!-- Top up table -->
    <div class="flex justify-center w-full p-4 mt-4">
      <div class="bg-white p-4 rounded shadow-sm mx-auto w-full max-w-[1000px]">

        <!-- Title -->
        <h2 class="w-full text-center text-lg font-bold mb-4 flex items-center gap-2 justify-center">
          Admin Dashboard
        </h2>

        <!-- Buttons Group -->
        <div class="w-full flex justify-center gap-3">
          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'users' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'users'"
          >
            User List
          </button>

          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'articles' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'articles'"
          >
            Articles List
          </button>
          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'analytics' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'analytics'"
          >
            Analytics
          </button>

          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'messages' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'messages'"
          >
            Messages
          </button>

          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'settings' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'settings'"
          >
            Settings
          </button>

          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'notifications' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'notifications'"
          >
            Notifications
          </button>

          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'reports' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'reports'"
          >
            Reports
          </button>

          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'support' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'support'"
          >
            Support
          </button>
          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'tasks' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'tasks'"
          >
            Tasks
          </button>

          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'files' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'files'"
          >
            Files
          </button>

          <button
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all font-medium border border-gray-300
                  hover:bg-gray-200 hover:shadow active:scale-95"
            :class="activeSection === 'logs' ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'"
            @click="activeSection = 'logs'"
          >
            Logs
          </button>
        </div>
      </div>
    </div>

    <!-- List Area -->
    <div class="flex-1 flex flex-col justify-center items-center p-8 overflow-auto w-full">
      <div class="container bg-white p-4 rounded shadow-sm" style="max-width: 1000px;">
        <h2 class="text-2xl font-bold mb-6 text-center">
          {{ activeSection === 'users' ? 'User Management' : 'Articles Management' }}
        </h2>

        <!-- User Table -->
        <section v-if="activeSection === 'users'">
          <DataTable
            :value="users"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            showGridlines
            stripedRows
            class="w-100"
          >
            <Column field="id" header="ID" sortable/>
            <Column field="name" header="Name" sortable/>
            <Column field="email" header="Email" sortable/>
            <Column field="role" header="Role" sortable/>
            <Column field="pronoun" header="Pronoun" sortable/>
          </DataTable>
        </section>

        <!-- Article Table -->
        <section v-else>
          <DataTable
            :value="articles"
            paginator
            :rows="10"
            showGridlines
            stripedRows
            class="w-100"
          >
            <Column field="id" header="ID" sortable/>
            <Column field="title" header="Title" sortable/>
            <Column field="category" header="Category" sortable/>
            <Column field="author" header="Author" sortable/>
            <Column field="publish_date" header="Publish Date" sortable/>
            <Column field="views" header="Views" sortable/>
            <Column header="Visible">
              <template #body="slotProps">
                <button
                  @click="toggleVisibility(slotProps.data)"
                  class="px-3 py-1 rounded-md text-sm font-medium transition-all"
                  :class="slotProps.data.visible ? 'bg-green-200 hover:bg-green-300 text-green-800' : 'bg-red-200 hover:bg-red-300 text-red-800'"
                >
                  {{ slotProps.data.visible ? 'Visible' : 'Hidden' }}
                </button>
              </template>
            </Column>
                      </DataTable>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/app";

// Activate part
const activeSection = ref("articles");

// === Users List ===
const users = ref<any[]>([]);
async function loadUsers() {
  const snap = await getDocs(collection(db, "users"));
  users.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// === Articles List ===
const articles = ref<any[]>([]);
async function loadArticles() {
  const snap = await getDocs(collection(db, "articles"));
  articles.value = snap.docs.map((d) => {
    const data = d.data();
    return { ...data, firestoreId: d.id }; // Use a new column to store Firestore ID
  });
}

// === Switch Visulizaiton ===
async function toggleVisibility(article: any) {
  try {
    if (!article.firestoreId) {
      throw new Error("Missing Firestore ID for article");
    }

    const ref = doc(db, "articles", article.firestoreId);
    await updateDoc(ref, { visible: !article.visible });
    article.visible = !article.visible;
  } catch (err) {
  }
}

onMounted(async () => {
  await Promise.all([loadUsers(), loadArticles()]);
});
</script>

<style scoped>
html, body {
  color: #000;
}

aside {
  min-height: 100vh;
  position: sticky;
  top: 0;
}
</style>

