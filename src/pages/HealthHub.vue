<template>
  <main class="container py-4" role="main" aria-labelledby="page-title">
    <h1 id="page-title" class="h4 mb-3 text-primary">Health Hub</h1>

    <p class="text-body-secondary mb-4">
      Welcome to the <b>Health Hub</b> — your go-to space for men’s wellbeing and self-care insights.  
      Stay on top of your health with fitness and nutrition tips, mental wellness resources, and lifestyle guidance.  
      Check the latest <b>weather and fitness suggestions</b> before your next workout — so you can train smarter, stay motivated, and live stronger.
    </p>

    <section class="row g-4 mb-5" aria-label="Health categories">
      <div class="col-md-6">
        <article class="card shadow-sm h-100" role="article" aria-labelledby="fitness-heading">
          <div class="card-body">
            <h2 id="fitness-heading" class="card-title h5">Fitness & Activity</h2>
            <p class="card-text">
              Explore personalized fitness guides and tips tailored for men’s health.
              Plan safe outdoor training based on today’s conditions.
            </p>
            <router-link
              to="/articles"
              class="btn btn-outline-primary btn-sm"
              aria-label="Explore articles about fitness and activity"
            >
              Explore Articles
            </router-link>
          </div>
        </article>
      </div>

      <div class="col-md-6">
        <article class="card shadow-sm h-100" role="article" aria-labelledby="nutrition-heading">
          <div class="card-body">
            <h2 id="nutrition-heading" class="card-title h5">Nutrition & Lifestyle</h2>
            <p class="card-text">
              Learn how to eat better, sleep better, and maintain mental balance with practical guides.
            </p>
            <router-link
              to="/articles"
              class="btn btn-outline-primary btn-sm"
              aria-label="Read more about nutrition and lifestyle"
            >
              Read More
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <!-- wheather research -->
    <section class="mt-5" aria-label="Weather and exercise tip">
      <h2 class="mb-3 h5">Check Today’s Weather & Exercise Tip</h2>

      <div class="card p-4 shadow-sm">
        <form @submit.prevent="getWeather" aria-label="Weather search form">
          <div class="d-flex gap-2 mb-3">
            <label for="city-input" class="visually-hidden">Enter your city name</label>
            <input
              id="city-input"
              v-model="city"
              type="text"
              class="form-control"
              placeholder="Enter your city (e.g. Melbourne)"
              aria-describedby="city-help"
            />
            <button
              type="submit"
              class="btn btn-primary"
              aria-label="Search weather for entered city"
            >
              Search
            </button>
          </div>
          <small id="city-help" class="visually-hidden">
            Type a city name and press Search to get weather details and workout tips.
          </small>
        </form>

        <div v-if="weatherData" class="mt-3">
          <h3 class="h6">{{ weatherData.name }}, {{ weatherData.sys.country }}</h3>
          <div class="d-flex align-items-center gap-3">
            <img
              :src="iconUrl"
              :alt="`Weather icon showing ${weatherData.weather[0].description}`"
              width="60"
              height="60"
            />
            <div>
              <p class="m-0">
                <strong>{{ temperature }}°C</strong> — {{ weatherData.weather[0].description }}
              </p>
              <p class="text-body-secondary small m-0">{{ advice }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-body-secondary small mt-2">
          Enter a city name to check current weather and get exercise advice.
        </div>
      </div>
    </section>
  </main>
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
  if (temperature.value > 32) // According to temperature
    return "It's quite hot: stay hydrated and consider light indoor exercise.";
  if (temperature.value < 10)
    return "Cold weather: warm up properly before going out.";
  return "Great weather for an outdoor run or a brisk walk!";
});
</script>

<style scoped>
#page-title {
  color: #000; 
  font-weight: 700;
}

.text-body-secondary {
  color: #555 !important;
  line-height: 1.6;
}

.card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* card title */
.card-title {
  color: #222;
  font-weight: 600;
}

.btn-outline-primary {
  color: #f4b400 !important;
  border-color: #f4b400 !important;
  font-weight: 600;
}

.btn-outline-primary:hover {
  background-color: #f4b400 !important;
  color: white !important;
  border-color: #f4b400 !important;
}

/* search button */
.btn-primary {
  background-color: #f4b400 !important;
  border-color: #f4b400 !important;
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #d9a300 !important;
  border-color: #d9a300 !important;
}

/* input */
.form-control {
  border-radius: 8px;
  border: 1px solid #ccc;
}

.form-control:focus {
  border-color: #f4b400;
  box-shadow: 0 0 0 0.15rem rgba(244, 180, 0, 0.25);
}

h3.h6 {
  color: #333;
  font-weight: 600;
}

.text-body-secondary.small {
  color: #777 !important;
}

/* Responsive fine-tuning */
@media (max-width: 768px) {
  main {
    padding: 1.5rem;
  }
  .card {
    margin-bottom: 1rem;
  }
}

</style>
