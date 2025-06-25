<template>
  <header
    class="flex items-center bg-gray-300 rounded-full px-6 py-4 shadow-md"
  >
    <div class="flex-none font-bold w-7 h-7">
      <router-link to="/" class="cursor-pointer block">
        <img :src="logo" alt="Logo" />
      </router-link>
    </div>

    <nav
      class="flex-1 flex justify-center space-x-6 items-center text-gray-700"
    >
      <button class="flex items-center space-x-1 pr-5">
        <RouterLink to="/map" class="">
          <font-awesome-icon :icon="['fas', 'compass']" />
          <span class="pl-2 no-underline">探索</span>
        </RouterLink>
      </button>
      <RouterLink to="/community" class="">
        <button class="flex items-center space-x-1">
          <font-awesome-icon :icon="['fas', 'globe']" />
          <span class="pl-2 no-underline">社群</span>
        </button>
      </RouterLink>

      <slot name="mapSearch"> </slot>
    </nav>

    <div class="flex-none text-gray-700">
      <RouterLink to="/signup" class="underline">註冊</RouterLink>
      |
      <RouterLink to="/login" class="underline">登入</RouterLink>
    </div>
  </header>
</template>

<script setup>
import logo from "../assets/icons/logoIcon/logo.svg";
</script>
