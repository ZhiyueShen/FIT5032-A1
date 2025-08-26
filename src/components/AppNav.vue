<!-- src/components/AppNav.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <!-- brand -->
      <a class="navbar-brand" href="#" @click.prevent="$router.push('/')">
        Men's Health
      </a>

      <!-- toggle button (mobile) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#nav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="nav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">About Us</RouterLink>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              Health Hub
            </a>
            <ul class="dropdown-menu">
              <li><RouterLink class="dropdown-item" to="/health/physical">Physical Health</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/health/mental">Mental Wellbeing</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/health/lgbtq">LGBTQ+ Topics</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/health/resources">Resources</RouterLink></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              Tools
            </a>
            <ul class="dropdown-menu">
              <li><RouterLink class="dropdown-item" to="/tools/self-checks">Self Checks</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/tools/forum">Forum & Stories</RouterLink></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              My Space
            </a>
            <ul class="dropdown-menu">
              <li><RouterLink class="dropdown-item" to="/my-space/tracker">Health Tracker</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/my-space/saved">Saved Content</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/my-space/settings">Settings</RouterLink></li>
            </ul>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login">Login</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/register">Register</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// no logic yet
</script>