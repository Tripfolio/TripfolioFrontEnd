<template>
	<div class="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg max-w-sm">
		<label class="flex flex-col">
			<span class="text-sm font-semibold text-gray-700">起始日期：</span>
			<input type="date" v-model="startDate" class="border border-gray-300 p-2 rounded" />
		</label>

		<label class="flex flex-col">
			<span class="text-sm font-semibold text-gray-700">結束日期：</span>
			<input type="date" v-model="endDate" class="border border-gray-300 p-2 rounded" />
		</label>

		<button @click="emitDates" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded">
			產生行程天數
		</button>
	</div>
</template>


<script setup>
import { ref } from 'vue'

const startDate = ref('')
const endDate = ref('')

const emit = defineEmits(['dates-selected'])

function emitDates() {
	if (!startDate.value || !endDate.value) {
		alert('請選擇起始與結束日期')
		return
	}
	if (startDate.value > endDate.value) {
		alert('結束日期不能比起始日期早')
		return
	}
	emit('dates-selected', { startDate: startDate.value, endDate: endDate.value })
}
</script>

<style scoped></style>
