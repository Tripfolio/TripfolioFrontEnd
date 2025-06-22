<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">我的行程</h2>
            </div>
        <div v-if="trips.length === 0" class="text-center text-gray-500 py-10 text-base">
            <p class="mb-4">還沒有任何行程資料！</p>
        </div>
        <ul class="space-y-4">
            <li
                v-for="trip in trips"
                :key="trip.id"
                class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                @click="$emit('view-trip', trip.id)">
                <img v-if="trip.cover" :src="trip.cover" alt="行程封面" class="w-full h-40 object-cover object-center" />
                <div v-else class="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">無封面圖片</div>
                <div class="p-4">
                    <h3 class="font-bold text-lg text-gray-800 mb-1">{{ trip.title }}</h3>
                    <p class="text-gray-600 text-sm">{{ trip.startDate }} ~ {{ trip.endDate }} (共 {{ trip.days.length }} 天)</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    trips: {
        type: Array,
        required: true,
    },
});

defineEmits(['view-trip', 'create-new-trip']);
</script>