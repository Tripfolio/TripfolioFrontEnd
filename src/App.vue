<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div v-if="$route.path !== '/map'">
    <RouterLink to="/map">景點地圖</RouterLink>

    <RouterLink to="/calendar">連結 Google Calendar</RouterLink>
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
  <div v-if="$route.path !== '/GetInvite'">
    <RouterLink to="/GetInvite">加入共編</RouterLink>
  </div>
  <RouterView />
</template>

<style></style>
