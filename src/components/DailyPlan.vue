<template>
    <div v-if="selectedTrip && currentDay">
      <h2 class="text-xl font-bold mb-4">{{ currentDay }}</h2>
      <div class="block mb-2 font-semibold text-gray-700 w-full bg-white border border-gray-800 rounded-md">
        加入景點卡片
      </div>
    </div>
    <div v-else class="text-center text-gray-500 py-10">
      <p>請從右側邊欄選擇一個旅程和日期來查看每日計畫。</p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useTripStore } from '@/stores/tripStore';
  
  const props = defineProps({
    selectedTrip: Object,
    dayIndex: Number,
  });
  
  const tripStore = useTripStore();
  
  const currentDay = computed(() => {
    return props.selectedTrip?.days[props.dayIndex] || null;
  });
  </script>