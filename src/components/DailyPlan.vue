<template>
	<aside class="border rounded-lg p-4 mb-4 bg-white shadow">
		<h2 class="text-lg font-bold mb-2">
			第 {{ dayNumber }} 天
		</h2>
		<p class="text-sm text-gray-500 mb-2">
			{{ date }}
		</p>
		<textarea 
			rows="4"
			class="w-full border p-2 text-sm"
			placeholder="輸入旅遊筆記..."
			:defaultValue="planStore.dailyNotes[date]"
			@input="update($event.target.value)">
		</textarea>
	</aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePlanStore } from '@/stores/usePlanStore'

const props = defineProps({
	dayNumber: Number,
	date: String
})

const note = ref('')

</script>
