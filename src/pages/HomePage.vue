<script setup lang="ts">
import ArticleCard from '../components/ArticleCard.vue'

const demoArticles = [
  {
    id: 'about-movember',
    title: "What's Men's Health for?",
    summary: 'Men is the leading charity changing the face of men’s health...',
    image: 'https://picsum.photos/seed/pic1/640/360',
    link: '#'
  },
  {
    id: 'donate-now',
    title: 'Donate now and save lives',
    summary: 'Your donations have fuelled more than 1,320 men’s health projects...',
    image: 'https://picsum.photos/seed/pic2/640/360',
    link: '#'
  },
  {
    id: 'five-things',
    title: '5 things every man should know',
    summary: 'Five things that all guys can do to live happier, healthier, longer lives.',
    image: 'https://picsum.photos/seed/pic5/640/360',
    link: '#'
  },
  {
    id: 'changing-face',
    title: 'Changing the face of men’s health',
    summary: 'The institute brings together the world’s leading experts to translate findings...',
    image: 'https://picsum.photos/seed/pic4/640/360',
    link: '#'
  },
]
</script>

<template>
    <section class="container my-5">
      <h2 class="h4 mb-3">Ariticle</h2>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-3" v-for="a in demoArticles" :key="a.id">
          <ArticleCard :item="a" />
        </div>
      </div>
    </section>
</template>


