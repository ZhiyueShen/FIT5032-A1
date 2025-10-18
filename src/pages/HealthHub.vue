<template>
  <div class="container py-4">
    <h2 class="h4 mb-3 text-primary">Health Hub</h2>
    <p class="text-muted mb-4">
      Welcome to the <b>Health Hub</b> — your go-to space for men’s wellbeing and self-care insights.  
  Stay on top of your health with fitness and nutrition tips, mental wellness resources, and lifestyle guidance.  
  Check the latest <b>weather and fitness suggestions</b> before your next workout — so you can train smarter, stay motivated, and live stronger.
    </p>

    <section class="row g-4 mb-5">
      <div class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">Fitness & Activity</h5>
            <p class="card-text">
              Explore personalized fitness guides and tips tailored for men’s health.
              Plan safe outdoor training based on today’s conditions.
            </p>
            <router-link to="/articles" class="btn btn-outline-primary btn-sm">
              Explore Articles
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">Nutrition & Lifestyle</h5>
            <p class="card-text">
              Learn how to eat better, sleep better, and maintain mental balance with practical guides.
            </p>
            <router-link to="/articles" class="btn btn-outline-primary btn-sm">
              Read More
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-5">
      <h4 class="mb-3">Check Today’s Weather & Exercise Tip</h4>
      <div class="card p-4 shadow-sm">
        <div class="d-flex gap-2 mb-3">
          <input
            v-model="city"
            type="text"
            class="form-control"
            placeholder="Enter your city (e.g. Melbourne)"
          />
          <button @click="getWeather" class="btn btn-primary">Search</button>
        </div>

        <div v-if="weatherData" class="mt-3">
          <h5>{{ weatherData.name }}, {{ weatherData.sys.country }}</h5>
          <div class="d-flex align-items-center gap-3">
            <img :src="iconUrl" alt="Weather icon" width="60" height="60" />
            <div>
              <p class="m-0"><strong>{{ temperature }}°C</strong> — {{ weatherData.weather[0].description }}</p>
              <p class="text-muted small m-0">{{ advice }}</p>
            </div>
          </div>
        </div>

        <div v-else class="text-muted small mt-2">
          Enter a city name to check current weather and get exercise advice.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";

const city = ref("");
const weatherData = ref<any | null>(null);
const apikey = "3018d2a0da0004fd0beb9f392ec08d70"; 

async function getWeather() {
  if (!city.value) return;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apikey}&units=metric`;
    const res = await axios.get(url);
    weatherData.value = res.data;
  } catch (err) {
    console.error("Failed to fetch weather:", err);
    weatherData.value = null;
  }
}

// Temperature counting
const temperature = computed(() =>
  weatherData.value ? Math.round(weatherData.value.main.temp) : null
);

// Wheather icon URL
const iconUrl = computed(() =>
  weatherData.value
    ? `http://openweathermap.org/img/w/${weatherData.value.weather[0].icon}.png`
    : ""
);

// Health Advice
const advice = computed(() => {
  if (!temperature.value) return "";
  if (temperature.value > 32)
    return "It's quite hot — stay hydrated and consider light indoor exercise.";
  if (temperature.value < 10)
    return "Cold weather — warm up properly before going out.";
  return "Great weather for an outdoor run or a brisk walk!";
});
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
