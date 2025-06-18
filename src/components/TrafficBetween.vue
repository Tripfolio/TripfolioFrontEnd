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

/* ==== 1. 傳入必要資料 ==== */
const props = defineProps({
  itineraryId: { type: Number, required: true },
  fromPlaceId: { type: String, required: true },
  toPlaceId:   { type: String, required: true },
  origin:      { type: Object, required: true },   // { lat, lng }
  destination: { type: Object, required: true }    // { lat, lng }
})
const API_URL = import.meta.env.VITE_API_URL

/* ==== 2. 內部狀態 ==== */
const selectedMode = ref('NONE')      // NONE | DRIVING | WALKING | TRANSIT
const durationText = ref('尚未選擇')
const distanceText = ref('')
const trafficRecordId = ref(null)     // 對應資料庫那筆 traffic_data.id
let directionsService                  // 延遲初始化

/* ==== 3. 先把舊資料撈回來（頁面重載、前後移動也吃得到）==== */
async function fetchSavedTraffic () {
  if (!props.itineraryId) return

  const { data } = await axios.get(
    `${API_URL}/api/traffic/get-all-traffic`,
    { params: { itineraryId: props.itineraryId } }
  )

  const old = data.data?.find(
    t => t.fromPlaceId === props.fromPlaceId && t.toPlaceId === props.toPlaceId
  )
  if (old) {
    trafficRecordId.value = old.id
    selectedMode.value    = old.transportMode
    durationText.value    = Math.round(old.duration / 60) + ' 分'
    distanceText.value    = (old.distance / 1000).toFixed(1) + ' km'
  }
}

/* ==== 4. 取得 Google 路線資訊並存 DB ==== */
async function getTravelInfo () {
  // 使用者還沒選交通工具就不查
  if (selectedMode.value === 'NONE') {
    durationText.value = '尚未選擇'
    distanceText.value = ''
    // 若原本有存 DB，代表使用者「取消」：刪掉舊資料
    if (trafficRecordId.value) await removeTraffic()
    return
  }

  if (!props.origin || !props.destination) return
  directionsService ??= new window.google.maps.DirectionsService()

  directionsService.route(
    {
      origin: props.origin,
      destination: props.destination,
      travelMode: selectedMode.value
    },
    async (res, status) => {
      if (status !== 'OK') { durationText.value = '查詢失敗'; return }

      const leg = res.routes[0].legs[0]
      durationText.value = leg.duration.text
      distanceText.value = leg.distance.text
      await saveTraffic(leg.duration.value, leg.distance.value) // 秒 & 公尺
    }
  )
}

/* ==== 5. 寫入 (或覆蓋) traffic_data ==== */
async function saveTraffic (rawDuration, rawDistance) {
  // 先刪舊
  if (trafficRecordId.value) {
    await axios.delete(`${API_URL}/api/traffic/delete-traffic`, { params: { id: trafficRecordId.value } })
    trafficRecordId.value = null
  }

  const { data } = await axios.post(`${API_URL}/api/traffic/add-traffic`, {
    itineraryId:  props.itineraryId,
    fromPlaceId:  props.fromPlaceId,
    toPlaceId:    props.toPlaceId,
    transportMode: selectedMode.value,
    duration:      rawDuration,
    distance:      rawDistance
  })
  trafficRecordId.value = data.id
}

/* ==== 6. 刪除 helper（取消交通工具 或 拖拉時由外部呼叫） ==== */
async function removeTraffic () {
  if (!trafficRecordId.value) return
  await axios.delete(`${API_URL}/api/traffic/delete-traffic`, { params: { id: trafficRecordId.value } })
  trafficRecordId.value = null
}

/* ==== 7. 監聽 ==== */
watch(selectedMode, getTravelInfo)          // 換交通工具
watch([ () => props.origin, () => props.destination ], () => {
  // 位置變了 (拖拉) → 顯示預設並刪舊資料
  selectedMode.value = 'NONE'
  removeTraffic()
})

onMounted(fetchSavedTraffic)
</script>
