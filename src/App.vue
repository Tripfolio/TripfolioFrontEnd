<template>
  <div class="relative">
    <NavBar class="fixed top-5 left-1/2 w-[65%] -translate-x-1/2 z-50 " />
    <RouterView />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
</script>

<style></style>
