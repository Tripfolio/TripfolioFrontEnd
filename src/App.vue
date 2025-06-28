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
      class="absolute top-5 left-[27%] w-[30%] -translate-x-1/2 z-50"
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

<style scoped>
.homepage-bg {
  background-image:
    radial-gradient(#999 1px, transparent 1px),
    linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size:
    40px 40px,
    40px 40px,
    40px 40px;
  background-position:
    20px 20px,
    0px 0px,
    0px 0px;
  background-color: white;
}
</style>
