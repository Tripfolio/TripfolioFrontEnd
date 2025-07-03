<template>
  <div class="flex flex-wrap gap-3 mt-6">
    <button
      v-for="lang in languages"
      :key="lang.code"
      @click="changeLanguage(lang.code)"
      class="px-4 py-2 rounded-full border border-gray-300 hover:bg-blue-500 hover:text-white transition duration-200 text-sm font-medium"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
];
const changeLanguage = (lang) => {
  locale.value = lang;
};
</script>
