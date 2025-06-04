<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>

<div class="w-full h-screen flex flex-col relative">

  <div>
      <template v-if="$route.path === '/'">
        <RouterLink to="/map">景點地圖</RouterLink>
        <RouterLink to="/signup">註冊</RouterLink>
        <RouterLink to="/emailSettings">Email 通知</RouterLink>
        <RouterLink to="/profile">會員資料</RouterLink>
      </template>

    <div class="flex-1 relative">
      <RouterView />
    </div>
  </div>
  </div>
  
</template>

<style></style>
