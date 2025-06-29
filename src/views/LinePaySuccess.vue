<template>
  <div class="max-w-md mx-auto mt-24 text-center font-sans px-4">
    <h1>{{ $t('linePay.successTitle') }}</h1>
    <p>{{ $t('linePay.successDescription') }}</p>
    <router-link
      to="/schedule"
      class="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
    >
      {{ $t('linePay.successBackButton') }}
    </router-link>
  </div>
</template>

<script setup>

import { useI18n } from "vue-i18n";
const { t } = useI18n();

</script>