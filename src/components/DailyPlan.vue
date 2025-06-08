<template>
    <div v-if="selectedTrip && currentDay">
        <h2 class="text-xl font-bold mb-4">第 {{ dayNumber }} 天 ({{ currentDay.date }})</h2>

        <label class="block mb-2 font-semibold text-gray-700">今日筆記</label>
        <textarea
            v-model="dayNote"
            rows="4"
            class="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-gray-500 focus:border-gray-500 mb-4 text-gray-800 bg-white"
            placeholder="輸入今日行程備註">
        </textarea>
    </div>
    <div v-else class="text-center text-gray-500 py-10">
        <p>請從右側邊欄選擇一個旅程和日期來查看每日計畫。</p>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
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