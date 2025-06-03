<template>
  <div
    class="fixed bottom-4 right-4 w-72 bg-white shadow-lg rounded-lg p-4 z-50 max-h-[90vh] overflow-y-auto"
  >
    <h3 class="text-lg font-bold mb-4">已加入的景點</h3>
    <ul>
      <li
        v-for="(p, index) in itineraryPlaces"
        :key="index"
        class="mb-4 border-b last:border-none"
      >
        <strong class="block">{{ p.name }}</strong>
        <strong class="block text-yellow-600">{{ p.rating }}</strong>
        <img :src="p.photo" class="aspect-[4/3]"></img>
        <span class="text-sm text-gray-600">{{ p.address }}</span>
        <br />
        <button @click="removePlace(p)">🗑️ remove</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { onMounted } from 'vue'

  onMounted(() => {
    loadItinerary()
  })

  async function loadItinerary() {
    try {
      const res = await axios.get(
        'http://localhost:3000/api/itinerary/places',
        {
          params: {
            itineraryId: 1
          }
        }
      )
      itineraryPlaces.value = res.data.places
    } catch (error) {
      console.error('載入行程失敗:', error)
    }
  }

  const props = defineProps({
    selectedPlace: Object,
    defaultImage: String
  })
  const itineraryPlaces = ref([])

  // 加入行程
  async function addPlace() {
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
      const rep = await axios.post(
        'http://localhost:3000/api/itinerary/add-place',
        {
          itineraryId: 1,
          name: props.selectedPlace.name,
          address: props.selectedPlace.formatted_address || '',
          photo: props.selectedPlace.photos && props.selectedPlace.photos.length
        ? props.selectedPlace.photos[0].getUrl({ maxWidth: 1000 })
        : props.defaultImage
        }
      )

      if (rep.data.success) {
        itineraryPlaces.value.push({
          name: props.selectedPlace.name,
          address: props.selectedPlace.formatted_address,
          rating: props.selectedPlace.rating || 'N/A',
          photo: props.selectedPlace.photos && props.selectedPlace.photos.length ? props.selectedPlace.photos[0].getUrl({ maxWidth: 1000 }) : props.defaultImage
        })
        alert('✅ 成功加入行程！')
      } else {
        alert('❌ 加入失敗：' + rep.data.message)
      }
    } catch (error) {
      console.error('加入失敗:', error)
      alert('🚨 發生錯誤：' + error.message)
    }
  }
  // 刪除行程
  async function removePlace(place) {
    console.log('刪除景點資料', place)

    try {
      const url = `http://localhost:3000/api/itinerary/place?itineraryId=1&name=${encodeURIComponent(
        place.name
      )}`
      const response = await axios.delete(url)

      if (response.data.success) {
        itineraryPlaces.value = itineraryPlaces.value.filter(
          (p) => p.name !== place.name
        )
        alert('✅ 成功刪除景點')
      } else {
        alert('❌ 刪除失敗：' + response.data.message)
      }
    } catch (error) {
      console.error('刪除錯誤:', error)
      alert('🚨 發生錯誤：' + error.message)
    }
  }
  defineExpose({ addPlace })
</script>
