<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div v-if="$route.path !== '/map'">
    <RouterLink to="/map">景點地圖</RouterLink>
  </div>
  <div v-if="$route.path !== '/emailSettings'">
    <RouterLink to="/emailSettings">Email通知設定</RouterLink>
  </div>
  <RouterView />
</template>

<style></style>
