<template>
  <div class="relative">
    <NavBar class="absolute top-5 left-1/2 w-[65%] -translate-x-1/2" />
    <RouterView />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
</script>
