<script setup>
import { RouterLink, RouterView } from "vue-router";
import Travel from "./views/Travel.vue";
</script>

<template>

  <div v-if="$route.path !== '/map'">
    <RouterLink to="/map">景點地圖</RouterLink>
  </div>
  <div v-if="$route.path !== '/emailSettings'">
    <RouterLink to="/emailSettings">Email通知設定</RouterLink>
  </div>
  <div v-if="$route.path !== '/profile'">
  <RouterLink to="/profile">會員資料修改</RouterLink>
  </div>
  <div v-if="$route.path !== '/schedule'">
  <RouterLink to="/schedule">個人行程</RouterLink>
  </div>
  <RouterView />
  
</template>

<style></style>
