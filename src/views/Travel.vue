<script setup>
import { ref } from 'vue';
import TravelSchedule from '@/components/TravelSchedule.vue';

const showForm = ref(false)
</script>

<template>
  <div class="schedule">
    <!--控制開關-->
    <button @click="showForm = true" class="mb-3 bg-blue-400 hover:bg-blue-300 text-white px-2 py-2 rounded">建立行程</button>
    <!--用v-if 控制元件顯示，並監聽@close-->
    <TravelSchedule v-if="showForm" @close="showForm = false" />
  </div>
</template>