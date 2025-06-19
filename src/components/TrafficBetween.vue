<template>
  <div class="flex flex-col items-center my-2">
    <select v-model="selectedMode" @change="getTravelInfo" class="mb-1 px-2 py-1 rounded border">
      <option value="NONE">— 選交通方式 —</option>
      <option value="DRIVING">🚗 開車</option>
      <option value="WALKING">🚶‍♂️ 步行</option>
      <option value="TRANSIT">🚇 大眾運輸</option>
    </select>
    <div>
    <span v-if="selectedMode !== 'NONE'">
      {{ durationText }}（{{ distanceText }}）</span>
      <span v-else></span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const props = defineProps({
  itineraryId: Number,
  fromPlaceId: Number,
  toPlaceId:   Number,
  origin:      Object,
  destination: Object,
  trafficData: Object,
})
const currentTraffic = ref(props.trafficData ?? null);

watch(() => props.trafficData, (val) => {
  if (val) currentTraffic.value = val;
});

console.log('TrafficBetween props:', props.trafficData)

const selectedMode = ref('NONE') // 預設選擇開車   
const durationText = ref('')         
const distanceText = ref('')        
const rawDuration  = ref(0)             
const rawDistance  = ref(0)               

async function getTravelInfo () {
  if (selectedMode.value === 'NONE') {   
    durationText.value = ''
    distanceText.value = ''
    return
  }

  try {
    const dirSvc = new google.maps.DirectionsService()
    const { routes } = await dirSvc.route({
      origin:       props.origin,
      destination:  props.destination,
      travelMode:   google.maps.TravelMode[selectedMode.value]
    })

    const leg = routes[0].legs[0] 
    rawDuration.value = leg.duration.value    
    rawDistance.value = leg.distance.value    
    
    durationText.value = Math.round(rawDuration.value / 60) + ' 分'
    distanceText.value = (rawDistance.value / 1000).toFixed(1) + ' km'

    await axios.delete(`${API_URL}/api/traffic/delete-traffic`, {
      params: {
        itineraryId : props.itineraryId,
        fromPlaceId : props.fromPlaceId,
        toPlaceId   : props.toPlaceId,
      }
    })

    await axios.post(`${API_URL}/api/traffic/add-traffic`, {
      itineraryId : props.itineraryId,
      fromPlaceId : props.fromPlaceId,
      toPlaceId   : props.toPlaceId,
      transportMode : selectedMode.value,
      duration    : rawDuration.value,
      distance    : rawDistance.value,
    })

  } catch (err) {
    console.error('取得/儲存交通資料失敗：', err)
    alert('讀取交通資訊失敗，請稍後再試')
  }
}
</script> 
