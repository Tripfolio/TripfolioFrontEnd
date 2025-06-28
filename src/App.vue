<template>
  <div class="relative">
    <!-- 上方 Navbar（非地圖頁） -->
    <NavBar
      v-if="!isMapPage"
      class="absolute top-5 left-1/2 w-[65%] -translate-x-1/2 z-50"
    />

    <!-- 下方 Navbar（地圖頁） -->
    <NavBar
      v-if="isMapPage"
      class="absolute top-5 left-1/5 w-[35%] -translate-x-1/2 z-50"
    />

    <RouterView />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const isMapPage = computed(() => route.path === "/schedule");
</script>

<style></style>
