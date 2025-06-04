<script setup>
  import { RouterLink, RouterView } from "vue-router";
</script>

<template>

  <div v-if="$route.path !== '/map'">
    <RouterLink to="/map">景點地圖</RouterLink>
  </div>
  

  <div v-if="$route.path !== '/login'">
    <RouterLink to="/login">登入頁面</RouterLink>
  </div>

  <div v-if="$route.path !== '/signup'">
    <RouterLink to="/signup">註冊頁面</RouterLink>
  </div>

  <div v-if="$route.path !== '/emailSettings'">
    <RouterLink to="/emailSettings">Email通知設定</RouterLink>
  </div>
  
  <div v-if="$route.path !== '/profile'">
    <RouterLink to="/profile">會員資料修改</RouterLink>
  </div>
  <RouterView />
  
</template>

<style></style>
