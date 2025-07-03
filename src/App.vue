<template>
  <div class="relative">
    <!-- 上方 Navbar（非地圖頁） -->
    <NavBar
      v-if="!isMapPage"
      class="fixed top-5 left-1/2 w-[65%] -translate-x-1/2 z-50"
    />

    <!-- 這兩行是語言設定 -->
    <button @click="changeLanguage('en')">English</button>
    <button @click="changeLanguage('zh')">中文</button>
    <button @click="changeLanguage('ja')">日本語</button>
    <button @click="changeLanguage('ko')">한국어</button>


    <!-- 下方 Navbar（地圖頁） -->
    <NavBar
      v-if="isMapPage"
      class="absolute top-5 left-1/2 w-[80%] -translate-x-1/2 z-50 md:left-[10%] md:w-[30%] md:translate-x-0"
    />
    <RouterView />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const route = useRoute();
const isMapPage = computed(() => route.path === "/schedule");


const changeLanguage = (lang) => {
  locale.value = lang;  // 設定語言
};
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
