<script setup>
  import { RouterView } from "vue-router";
</script>

<template>
  <div class="w-full h-screen flex flex-col relative">
    <div v-if="$route.path === '/'">
      <RouterLink to="/map">景點地圖</RouterLink>
      <RouterLink to="/signup">註冊</RouterLink>
      <RouterLink to="/emailSettings">Email 通知</RouterLink>
      <RouterLink to="/profile">會員資料修改</RouterLink>
      <RouterLink to="/calendar">連結 Google Calendar</RouterLink>
      <RouterLink to="/schedule">個人行程</RouterLink>
      <RouterLink to="/login">登入頁面</RouterLink>
      <RouterLink to="/community">社群貼文</RouterLink>
      <RouterLink to="/trips">行程建立</RouterLink>
    </div>
    <div class="relative">
      <RouterView />
    </div>
  </div>
</template>
