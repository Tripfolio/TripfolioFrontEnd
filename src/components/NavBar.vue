<template>
  <header
    class="navbar-style flex flex-wrap md:flex-nowrap items-center justify-between rounded-full px-4 py-3 md:px-6 md:py-4"
  >
    <!-- Logo -->
    <div class="flex items-center w-full md:w-auto justify-between">
      <router-link to="/" class="cursor-pointer block w-7 h-7">
        <img :src="logo" alt="Logo" />
      </router-link>

      <!-- 手機版：選單按鈕 -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden text-xl"
        aria-label="Toggle menu"
      >
        <font-awesome-icon :icon="['fas', 'bars']" />
      </button>
    </div>

    <!-- nav 主選單 -->
    <nav
      class="w-full md:w-auto mt-4 md:mt-0"
      :class="{ block: isMenuOpen, hidden: !isMenuOpen, 'md:flex': true }"
    >
      <div
        class="flex flex-col md:flex-row md:space-x-6 items-start md:items-center"
      >
        <RouterLink
          to="/schedule"
          class="flex items-center py-2 md:py-0 space-x-1 pr-0 md:pr-5"
        >
          <font-awesome-icon :icon="['fas', 'compass']" />
          <span class="pl-2 no-underline">探索</span>
        </RouterLink>

        <RouterLink
          to="/community"
          class="flex items-center py-2 md:py-0 space-x-1"
        >
          <font-awesome-icon :icon="['fas', 'globe']" />
          <span class="pl-2 no-underline">社群</span>
        </RouterLink>

        <!-- 地圖 slot -->
        <slot name="mapSearch" />
      </div>
    </nav>

    <!-- 登入註冊 -->
    <div
      class="w-full md:w-auto mt-2 md:mt-0 text-sm md:text-base flex justify-start md:justify-end space-x-2"
      :class="{ block: isMenuOpen, hidden: !isMenuOpen, 'md:flex': true }"
    >
      <RouterLink to="/signup" class="underline">註冊</RouterLink>
      <span>|</span>
      <RouterLink to="/login" class="underline">登入</RouterLink>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import logo from "../assets/icons/Logo/logo.svg";

const isMenuOpen = ref(false);
</script>
