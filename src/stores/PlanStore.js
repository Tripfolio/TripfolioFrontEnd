import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const usePlanStore = defineStore('plan', () => {
	const travelDates = ref([])
	const dailyNotes = ref({})

	watch(dailyNotes, (newNotes) => {
		localStorage.setItem('dailyNotes', JSON.stringify(newNotes))
	}, { deep: true })

	function setDates(dates) {
		travelDates.value = dates
		dates.forEach(date => {
			if (!dailyNotes.value[date]) {
				dailyNotes.value[date] = ''
			}
		})
	}

	function clearNote(date) {
		if (dailyNotes.value[date]) {
			dailyNotes.value[date] = ''
		}
	}

	function clearAllNotes() {
		dailyNotes.value = {}
		localStorage.removeItem('dailyNotes')
	}

	return {
		travelDates,
		dailyNotes,
		setDates,
		clearNote,
		clearAllNotes
	}
})
