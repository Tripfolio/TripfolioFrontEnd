<template>

  <div class="relative ">
    <div class="px-4 sm:px-8 py-4">
      <NavBar />
    </div>

    <RouterView />
  </div>
</template>

<script setup>
  import NavBar from '@/components/NavBar.vue';
</script>