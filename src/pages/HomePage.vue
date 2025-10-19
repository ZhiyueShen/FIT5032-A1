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



//Search function
const searchQuery = ref(""); 

// Filtered Articles
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
  <main class="container my-5" role="main" aria-labelledby="article-heading">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 id="article-heading" class="h4 mb-0">Articles</h1>
      <button
        class="btn btn-outline-primary btn-sm"
        @click="showTable = !showTable"
        aria-label="Toggle between card view and article table view"
      >
        {{ showTable ? 'Hide Table' : 'More Articles →' }}
      </button>
    </div>

    <!-- Article Card -->
    <section v-if="!showTable" aria-label="Featured Articles">
      <div class="row g-3">
        <div
          class="col-12 col-md-6 col-lg-3"
          v-for="a in visibleArticles.slice(0, 4)"
          :key="a.id"
        >
          <ArticleCard :item="a" />
        </div>
      </div>
    </section>

    <!-- Article Table -->
    <section v-else class="mt-4" aria-label="All Articles Table">
      <div class="flex justify-center mb-4">
        <label for="article-search" class="visually-hidden">
          Search articles
        </label>
        <input
          id="article-search"
          v-model="searchQuery"
          type="text"
          placeholder="Search by title or author..."
          class="w-full max-w-[400px] px-3 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary transition"
          aria-describedby="search-help"
        />
        <small id="search-help" class="text-muted visually-hidden">
          Type keywords to filter the articles table by title or author
        </small>
      </div>
      <DataTable
        :value="filteredArticles"
        paginator
        :rows="10"
        showGridlines
        stripedRows
        class="w-100"
        aria-label="Article data table"
      >
        <Column field="title" header="Title" sortable />
        <Column field="category" header="Category" sortable />
        <Column field="author" header="Author" sortable />
        <Column field="publish_date" header="Publish Date" sortable />
        <Column field="views" header="Views" sortable />
      </DataTable>
    </section>
  </main>
</template>

<style scoped>
#article-heading {
  font-weight: 800;       
  color: #222;   
  letter-spacing: 0.5px;   
}

.btn-outline-primary.btn-sm {
  border: 2px solid #000; 
  color: #000;      
  font-weight: 600;      
  transition: all 0.25s ease-in-out;
}

.btn-outline-primary.btn-sm:hover {
  background-color: #ffcc00; 
  color: #000;      
  border-color: #ffcc00;   
  transform: translateY(-2px); 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

</style>
