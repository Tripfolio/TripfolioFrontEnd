<template>
<div class="flex items-center justify-between w-50 gap-1  mb-3">
  <select
    v-model="selectedMode"
    @change="getTravelInfo"
    class="w-36 px-3 py-1 border-2 border-gray-500 rounded-full text-base"
  >
    <option value="NONE">—{{ $t('traffic.selectTransport') }}—</option>
    <option value="DRIVING">{{ $t('traffic.driving') }}</option>
    <option value="WALKING">{{ $t('traffic.walking') }}</option>
    <option value="TRANSIT">{{ $t('traffic.transit') }}</option>
  </select>

  <div class="flex items-center gap-1 text-base whitespace-nowrap">
    <span>{{ durationText }}</span>
    <span>{{ distanceText }}</span>
  </div>
</div>
</template>


<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const API_URL = import.meta.env.VITE_API_URL

const props = defineProps({
  itineraryId: Number,
  fromPlaceId: Number,
  toPlaceId:   Number,
  origin:      Object,
  destination: Object,
  trafficData: Object,
})

const selectedMode = ref('NONE') 
const durationText = ref('')         
const distanceText = ref('')        
const rawDuration  = ref(0)             
const rawDistance  = ref(0)   

watch(
  () => props.trafficData,
  (val) => {
    if (val && val.transportMode) {
      selectedMode.value = val.transportMode
      if (val.duration && val.distance) {
        rawDuration.value = val.duration
        rawDistance.value = val.distance
        durationText.value = Math.round(val.duration / 60) + ' 分'
        distanceText.value = (val.distance / 1000).toFixed(1) + ' km'
      } else {
        durationText.value = ''
        distanceText.value = ''
      }
    } else {
      selectedMode.value = 'NONE'
      durationText.value = ''
      distanceText.value = ''
    }
  },
  { immediate: true }
)            

watch(
  () => [props.fromPlaceId, props.toPlaceId],
  () => {
    selectedMode.value = 'NONE'
    durationText.value = ''
    distanceText.value = ''
  }
)

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
    alert(t('traffic.alertFail'))
  }
}
</script> 