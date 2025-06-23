<template>
    <div v-if="selectedTrip && currentDay">
      <h2 class="text-xl font-bold mb-4">{{ currentDay.date }}</h2>

      <Itinerary
        ref="itineraryRef"
        :trip-id="selectedTrip.id"
        :selected-date="currentDay.date"
        class="hidden"
      />

      <draggable
        :list="itinerarySpots"
        item-key="id"
        ghost-class="bg-yellow-100"
        animation="200"
        @end="updateOrder"
      >

        <template #item="{ element: p, index }">
          <li class="mb-4 border-b bg-gray-500 list-none flex justify-between rounded-2xl w-full relative items-stretch">
            <div class="w-1/2 p-3">
              <p class="number bg-red-600 w-6 text-center rounded-2xl text-amber-50">
                {{ index + 1 }}
              </p>
              <h3 class="block text-white text-l mb-1.5">{{ p.name }}</h3>
              <div class="flex flex-col items-start text-white text-xs">
                <p
                  v-if="!p.editingTime"
                  class="cursor-pointer pb-2"
                  @click="startEditing(p)"
                >
                  {{ formatTime(p.arrivalHour, p.arrivalMinute) }}抵達
                </p>
                <div v-else class="flex flex-col gap-1">
                  <div class="flex gap-1 items-center">
                    <select v-model="p.arrivalHourTemp" class="appearance-none outline-0">
                      <option v-for="h in 24" :key="h" :value="h - 1">
                        {{ (h - 1).toString().padStart(2, '0') }}
                      </option>
                    </select>
                    :
                    <select v-model="p.arrivalMinuteTemp" class="appearance-none outline-0">
                      <option v-for="m in [0, 15, 30, 45]" :key="m" :value="m">
                        {{ m.toString().padStart(2, '0') }}
                      </option>
                    </select>
                    抵達
                  </div>

                  <div class="flex gap-2 mt-1">
                    <button @click="confirmTime(p)" class="text-green-300">更改</button>
                    <button @click="cancelEditing(p)" class="text-red-300">✘ 取消</button>
                  </div>
                </div>
              </div>
            </div>

            <img :src="p.photo" class="w-1/2 rounded-tr-lg rounded-br-lg object-cover" />

            <div class="relative">
              <button @click.stop="toggleMenu(index)" class="button-list absolute right-0">
                <font-awesome-icon
                  icon="ellipsis-h"
                  class="p-1 text-white bg-cyan-800 rounded-full cursor-pointer absolute right-2 top-2"
                />
              </button>
              <ul v-if="openMenuIndex === index" class="absolute right-0 mt-12 bg-white shadow rounded">
                <li>
                  <button @click="removePlace(p)" class="w-full text-left px-4 py-2 hover:bg-gray-100">
                    🗑️ remove
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </template>   
      </draggable>

      <div v-if="itinerarySpots.length === 0" class="text-gray-400 mb-2">
        尚未加入任何景點
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-10">
      <p>請從右側邊欄選擇一個旅程和日期來查看每日計畫。</p>
    </div>
  </template>
  
  <script setup>
import { ref, computed, toRefs} from 'vue';
import draggable from 'vuedraggable';
import Itinerary from './Itinerary.vue';

const itineraryRef = ref(null);

const props = defineProps({
  selectedTrip: Object,
  dayIndex: Number,
});
const { selectedTrip, dayIndex } = toRefs(props);

const openMenuIndex = ref(null);


const refreshKey = ref(0)

const currentDay = computed(() => {
  return selectedTrip.value?.days?.[dayIndex.value] || null;
});

const itinerarySpots = computed(() => {
  const date = currentDay.value?.date || '';
  return itineraryRef.value?.itineraryPlaces?.filter(p => p.date === date) || [];
});


function toggleMenu(index) {
  openMenuIndex.value = openMenuIndex.value === index ? null : index;
}

function formatTime(hour, minute) {
  return `${String(hour ?? 0).padStart(2, '0')}:${String(minute ?? 0).padStart(2, '0')}`;
}

function startEditing(p) {
  itineraryRef.value?.startEditing(p);
}

function cancelEditing(p) {
  itineraryRef.value?.cancelEditing(p);
}

function confirmTime(p) {
  itineraryRef.value?.confirmTime(p);
}

function removePlace(p) {
  itineraryRef.value?.removePlace(p);
}

function updateOrder() {
  itineraryRef.value?.updateOrder();
}

function refresh() {
  refreshKey.value++;
}

defineExpose({ refresh });

  </script>