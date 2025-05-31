<template>
  <h3 class="text-lg font-bold mt-4">已加入的景點</h3>
  <ul>
    <li v-for="(p, index) in itineraryPlaces" :key="index" class="mb-2">
      <strong>{{ p.name }}</strong
      ><br />
      <strong>{{ p.rating }}</strong
      ><br />
      <span class="text-sm text-gray-600">{{ p.address }}</span>
    </li>
  </ul>
</template>

<script setup>
  import { ref } from 'vue'
  import axios from 'axios'

  const props = defineProps({
    selectedPlace: Object
  })
  const itineraryPlaces = ref([])

  // 加入行程
  async function addToItinerary() {
    if (!props.selectedPlace) {
      alert('請先選擇一個地點')
      return
    }

    const exists = itineraryPlaces.value.some(
      (p) => p.name === props.selectedPlace.name
    )
    if (exists) {
      alert('⚠️ 這個景點已經加入行程！')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/itinerary/add-place',
        {
          itineraryId: 1,
          name: props.selectedPlace.name,
          address: props.selectedPlace.formatted_address || ''
        }
      )

      if (response.data.success) {
        itineraryPlaces.value.push({
          name: props.selectedPlace.name,
          address: props.selectedPlace.formatted_address,
          rating: props.selectedPlace.rating || 'N/A'
        })
        alert('✅ 成功加入行程！')
      } else {
        alert('❌ 加入失敗：' + response.data.message)
      }
    } catch (error) {
      console.error('加入失敗:', error)
      alert('🚨 發生錯誤：' + error.message)
    }
  }

  defineExpose({ addToItinerary })
</script>
