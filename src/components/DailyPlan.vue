<template>
    <div v-if="selectedTrip && currentDay">
        <h2 class="text-xl font-bold mb-4">第 {{ dayNumber }} 天 ({{ currentDay.date }})</h2>
        <label for="day-remark" class="block mb-2 font-semibold text-gray-700">今日筆記</label>
        <input
            id="day-remark"
            type="text"
            v-model="dayNote"
            rows="4"
            class="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-gray-500 focus:border-gray-500 mb-4 text-gray-800 bg-white"
            placeholder="輸入今日行程備註">
        </input>
        <div class="block mb-2 font-semibold text-gray-700 w-full bg-white border border-gray-800 rounded-md" >
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
    dayNumber: Number,
});

const tripStore = useTripStore();

const currentDay = computed(() => {
    return props.selectedTrip?.days[props.dayIndex] || null;
});

const dayNote = computed({
    get() {
        return currentDay.value?.note || '';
    },
    set(value) {
        if (props.selectedTrip && currentDay.value) {
            tripStore.updateDailyNote(props.selectedTrip.id, currentDay.value.date, value);
        }
    },
});
</script>