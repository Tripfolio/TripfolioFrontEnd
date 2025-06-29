<template>
  <div class="max-w-md mx-auto mt-24 text-center font-sans px-4">
    <h1>{{ $t('linePay.failTitle') }}</h1>
    <p>{{ $t('linePay.failDescription') }}</p>
    <router-link
      to="/payment"
      class="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
    >
      {{ $t('linePay.failBackButton') }}
    </router-link>
  </div>
</template>

<script setup>

import { useI18n } from "vue-i18n";
const { t } = useI18n();

</script>