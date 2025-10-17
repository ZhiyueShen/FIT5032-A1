<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ArticleCard from "../components/ArticleCard.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/app";

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

type FrontArticle = Article & { image?: string };

const showTable = ref(false);
// Front article need image
const visibleArticles = ref<FrontArticle[]>([]);

async function loadArticles() {
  const snap = await getDocs(collection(db, "articles"));
  visibleArticles.value = snap.docs
    .map((d, index) => {
      const data = d.data() as Article;
      return {
        ...data,            // Keep the field in Firestore
        id: d.id,   
        image: index < 4 ? `https://picsum.photos/seed/${d.id}/640/360` : undefined,
      } satisfies FrontArticle;  
    })
    .filter(a => a.visible === true); 
}

const searchQuery = ref(""); // ✅ 新增搜索输入内容

// ✅ 计算过滤后的文章
const filteredArticles = computed(() => {
  if (!searchQuery.value) return visibleArticles.value;
  const q = searchQuery.value.toLowerCase();
  return visibleArticles.value.filter(
    (a) =>
      a.title?.toLowerCase().includes(q) ||
      a.author?.toLowerCase().includes(q)
  );
});


onMounted(loadArticles);
</script>

<template>
  <section class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4 mb-0">Article</h2>
      <button
        class="btn btn-outline-primary btn-sm"
        @click="showTable = !showTable"
      >
        {{ showTable ? 'Hide Table' : 'More Articles →' }}
      </button>
    </div>

    <!-- Article Card -->
    <div v-if="!showTable">
      <div class="row g-3">
        <div
          class="col-12 col-md-6 col-lg-3"
          v-for="a in visibleArticles.slice(0, 4)"
          :key="a.id"
        >
          <ArticleCard :item="a" />
        </div>
      </div>
    </div>

    <!-- Article Table -->
    <div v-else class="mt-4">
      <div class="flex justify-center mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title or author..."
          class="w-full max-w-[400px] px-3 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        />
      </div>
      <DataTable
        :value="filteredArticles"
        paginator
        :rows="10"
        showGridlines
        stripedRows
        class="w-100"
      >
        <Column field="title" header="Title" />
        <Column field="category" header="Category" />
        <Column field="author" header="Author" />
        <Column field="publish_date" header="Publish Date" />
        <Column field="views" header="Views" />
      </DataTable>
    </div>
  </section>
</template>

