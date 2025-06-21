<template>
    <div v-if="selectedTrip && currentDay">
      <h2 class="text-xl font-bold mb-4">{{ currentDay.date }}</h2>

      <!-- 已加入景點 -->
      <div v-if="currentDay.spots.length > 0">
        <ul class="space-y-2">
          <li 
            v-for="(spot, index) in currentDay.spots" 
            :key="spot.id" 
            class="border p-3 rounded bg-white flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-700 font-semibold">{{ spot.time }}</p>
              <p class="text-base font-bold text-gray-900">{{ spot.name }}</p>
            </div>
            <button
              @click="removeSpot(index)"
              class="text-red-500 text-sm hover:underline"
            >移除
            </button>
          </li>
        </ul>
       </div>
       <div v-else class="text-gray-400 mb-2">尚未加入任何景點</div>

      <!-- 加入景點-->
       <button
       @click="addSpot"
       class="lock mb-2 font-semibold text-gray-700 w-full bg-white border border-gray-800 rounded-md"
       >加入景點卡片
      </button>
    </div>

    <div v-else class="text-center text-gray-500 py-10">
      <p>請從右側邊欄選擇一個旅程和日期來查看每日計畫。</p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    selectedTrip: Object,
    dayIndex: Number,
  });
  
  
  const currentDay = computed(() => {
    return props.selectedTrip?.days?.[props.dayIndex] || null;
  });


  // ➕ 加入一筆景點資料（測試用）
const addSpot = () => {
  if (!currentDay.value.spots) currentDay.value.spots = [];

  currentDay.value.spots.push({
    id: Date.now(),
    name: "新的景點",
    time: "09:00"
  });
};

const removeSpot = (index) => {
  currentDay.value.spots.splice(index, 1);
}
  </script>