<template>
  <header class="navbar-style flex items-center rounded-full px-6 py-4">
    <div class="flex-none font-bold w-7 h-7">
      <router-link to="/" class="cursor-pointer block">
        <img :src="logo" alt="Logo" />
      </router-link>
    </div>

    <nav class="flex-1 flex justify-center space-x-6 items-center">
      <button class="flex items-center space-x-1 pr-5">
        <RouterLink to="/schedule" class="">
          <font-awesome-icon :icon="['fas', 'compass']" />
          <span class="pl-2 no-underline">探索</span>
        </RouterLink>
      </button>

      <button class="flex items-center space-x-1">
        <RouterLink to="/community" class="">
          <font-awesome-icon :icon="['fas', 'globe']" />
          <span class="pl-2 no-underline">社群</span>
        </RouterLink>
      </button>

      <slot name="mapSearch"> </slot>
    </nav>

    <div class="flex-none">
      <RouterLink to="/signup" class="underline">註冊</RouterLink>
      |
      <RouterLink to="/login" class="underline">登入</RouterLink>
    </div>
  </header>
</template>

<script setup>
import logo from "../assets/icons/Logo/logo.svg";
</script>

<style scoped></style>
