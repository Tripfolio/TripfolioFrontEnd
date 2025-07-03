<template>
    <button @click="changeLanguage('en')">English</button>
    <button @click="changeLanguage('zh')">中文</button>
    <button @click="changeLanguage('ja')">日本語</button>
    <button @click="changeLanguage('ko')">한국어</button>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const changeLanguage = (lang) => {
  locale.value = lang;
};
</script>
