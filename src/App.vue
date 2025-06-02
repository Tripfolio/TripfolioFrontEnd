<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div v-if="$route.path !== '/map'">
    <RouterLink to="/map">景點地圖</RouterLink>

    <RouterLink to="/calendar">連結 Google Calendar</RouterLink>
  </div>
  <RouterView />
</template>

<style></style>
