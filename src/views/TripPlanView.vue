<template>
	<section class="flex">

		<div class="w-1/5 p-4 border-r border-gray-300">
			<DateSelector @dates-selected="generateDays" />
		</div>

		<div class="flex-1 p-4 overflow-y-auto h-screen">
			<DailyPlan
				v-for="(date, index) in planStore.travelDates"
				:key="date"
				:dayNumber="index + 1"
				:date="date"
			/>
		</div>
	</section>
</template>

<script setup>
import { usePlanStore } from '@/stores/PlanStore'
import DateSelector from '@/components/DateSelector.vue'
import DailyPlan from '@/components/DailyPlan.vue'

const planStore = usePlanStore()

function generateDays({ startDate, endDate }) {
	const start = new Date(startDate)
	const end = new Date(endDate)

	const dates = []
	let current = new Date(start)

	while (current <= end) {
		dates.push(current.toISOString().split('T')[0])
		current.setDate(current.getDate() + 1)
	}

	planStore.setDates(dates)
}
</script>

