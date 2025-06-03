<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div v-if="$route.path !== '/travelSchedule'">
    <RouterLink to="/travelSchedule">行程總覽</RouterLink>
  </div>
  <RouterView />
</template>

<style></style>
