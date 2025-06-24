<template>
    <div :class="['fixed right-0 top-0 h-full bg-gray-50 shadow-lg z-40 transition-all duration-300 ease-in-out flex flex-col', { 'w-full md:w-1/2 lg:w-1/3 xl:w-[500px]': isOpen, 'w-0': !isOpen }]">
      <button
        @click="toggleSidebar"
        :class="['absolute p-2 rounded-l-md text-white z-50 transition-all duration-300 ease-in-out', isOpen ? 'bg-gray-700 top-1/2 left-0 -translate-x-full -translate-y-1/2' : 'bg-gray-700 top-1/2 right-0 -translate-y-1/2 rounded-r-md']"
        style="width: 32px;"
        :aria-label="isOpen ? '收合側邊欄' : '展開側邊欄'">
        <font-awesome-icon :icon="isOpen ? ['fas', 'angle-right'] : ['fas', 'angle-left']" class="w-6 h-6" />
      </button>
  
      <div v-if="isOpen" class="flex flex-col h-full w-full">
        <div class="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-20">
          <h2 class="text-xl font-bold text-gray-800">行程管理</h2>
          <div class="flex space-x-3">
            <button @click="closeSidebar" class="text-gray-500 hover:text-gray-700" aria-label="關閉側邊欄">
              <font-awesome-icon :icon="['fas', 'xmark']" class="w-6 h-6" />
            </button>
          </div>
        </div>
  
        <div v-if="tripStore.selectedTrip" class="flex-shrink-0 flex items-center bg-gray-100 border-b border-gray-200 shadow-sm sticky top-[65px] z-10 px-4 py-2 overflow-x-auto whitespace-nowrap">
          <button
            @click="currentView = 'tripOverview'; currentDayIndex = null;"
            :class="['flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full mr-2', currentView === 'tripOverview' && currentDayIndex === null ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
            總覽
          </button>
          <button
            v-for="(day, index) in tripStore.selectedTrip?.days"
            :key="day" @click="selectDay(index)"
            :class="['flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full mr-2', currentView === 'dailyPlans' && currentDayIndex === index ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
            第 {{ index + 1 }} 天
          </button>
          <button
            @click="addDayAndSelect"
            class="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </button>
        </div>
        <div v-else class="flex-shrink-0 flex items-center bg-gray-100 border-b border-gray-200 shadow-sm sticky top-[65px] z-10 px-4 py-2">
          <span class="text-gray-500 text-sm">請從下方選擇行程來管理</span>
        </div>
  
        <div class="flex-grow p-4 overflow-y-auto">
          <TripList
            v-if="!tripStore.selectedTrip"
            :trips="tripStore.trips"
            @view-trip="viewTrip"
            @create-new-trip="closeSidebar" />
          <TripOverview
            v-if="currentView === 'tripOverview' && tripStore.selectedTrip"
            :trip="tripStore.selectedTrip"
            @back-to-list="backToTripList"
            @update-cover="handleCoverUpload"
            @update-title="handleUpdateTitle"
            @update-notes="handleUpdateNotes" />
  
          <DailyPlan
            v-if="currentView === 'dailyPlans' && tripStore.selectedTrip && currentDayIndex !== null"
            :selected-trip="tripStore.selectedTrip"
            :day-index="currentDayIndex"
            :day-number="currentDayIndex + 1"/>
  
          <div v-if="!tripStore.selectedTrip && currentView === 'tripOverview' && tripStore.trips.length > 0" class="text-center text-gray-500 py-10 text-base">
            請從「我的行程」中選擇一個行程來編輯。
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useTripStore } from '@/stores/tripStore';
import DailyPlan from '@/components/DailyPlan.vue';
import TripList from '@/components/TripList.vue';
import TripOverview from '@/components/TripOverview.vue';

const tripStore = useTripStore();

const isOpen = ref(false);
const currentView = ref('tripOverview');
const currentDayIndex = ref(null);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const closeSidebar = () => {
  isOpen.value = false;
  tripStore.selectedTrip = null;
  tripStore.selectedTripId = null;
  currentView.value = 'tripOverview';
  currentDayIndex.value = null;
};

const viewTrip = (id) => {
  tripStore.selectTrip(id);
  currentView.value = 'tripOverview';
  currentDayIndex.value = null;
};

const backToTripList = () => {
  tripStore.selectedTrip = null;
  tripStore.selectedTripId = null;
  currentView.value = 'tripOverview';
  currentDayIndex.value = null;
};

const selectDay = (index) => {
  currentDayIndex.value = index;
  currentView.value = 'dailyPlans';
};

const addDayAndSelect = async () => {
  if (tripStore.selectedTrip) {
    const currentTripId = tripStore.selectedTrip.id;
    await tripStore.addDay(currentTripId);
    currentDayIndex.value = tripStore.selectedTrip.days.length - 1;
    currentView.value = 'dailyPlans';
  }
};

const handleCoverUpload = (file) => {
  if (tripStore.selectedTrip) {
    tripStore.updateTrip(tripStore.selectedTrip.id, { cover: file });
  }
};

const handleUpdateTitle = (newTitle) => {
  if (tripStore.selectedTrip) {
    tripStore.updateTrip(tripStore.selectedTrip.id, { title: newTitle });
  }
};

const handleUpdateNotes = (newNotes) => {
    if (tripStore.selectedTrip) {
      tripStore.updateTrip(tripStore.selectedTrip.id, { description: newNotes });
    }
};

watch(() => tripStore.selectedTrip, (newTrip) => {
  if (newTrip) {
    if (currentView.value !== 'dailyPlans' && currentDayIndex.value === null) {
      currentView.value = 'tripOverview';
    }
  } else {
    currentView.value = 'tripOverview';
    currentDayIndex.value = null;
  }
}, { immediate: true });

onMounted(() => {
  if (tripStore.selectedTripId) {
      tripStore.selectTrip(tripStore.selectedTripId);
  } else {
    tripStore.fetchTrips();
  }
});
</script>

<style scoped>
.xl\:w-\[500px\] {
  width: min(33.33vw, 500px);
}
</style>