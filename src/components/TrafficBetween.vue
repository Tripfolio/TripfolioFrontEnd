<template>
  <div class="flex items-center gap-2 my-2">
    <select v-model="selectedMode" @change="onModeChange" class="border rounded px-2 py-1">
      <option value="driving">🚗 開車</option>
      <option value="walking">🚶‍♂️ 步行</option>
      <option value="transit">🚌 大眾運輸</option>
      <option value="bicycling">🚴‍♀️ 腳踏車</option>
    </select>
    <span v-if="loading">載入中...</span>
    <span v-else>{{ durationText }}</span>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  fromPlaceId: [String, Number],
  toPlaceId: [String, Number],
  defaultMode: { type: String, default: 'driving' }
});

const selectedMode = ref(props.defaultMode);
const durationText = ref('');
const loading = ref(false);

async function fetchTraffic() {
  if (!props.fromPlaceId || !props.toPlaceId) return;
  loading.value = true;
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/traffic`, {
      params: {
        from: props.fromPlaceId,
        to: props.toPlaceId,
        mode: selectedMode.value
      }
    });
    durationText.value = res.data?.duration
      ? `${res.data.duration} 分`
      : '無資料';
  } catch (e) {
    durationText.value = '查詢失敗';
  }
  loading.value = false;
}

async function onModeChange() {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/itinerary/update-transport-mode`, {
      fromPlaceId: props.fromPlaceId,
      toPlaceId: props.toPlaceId,
      selectedTransportMode: selectedMode.value
    });
  } catch (e) {
    console.error('交通方式儲存失敗', e);
  }
}


watch([() => props.fromPlaceId, () => props.toPlaceId], fetchTraffic, { immediate: true });
watch(selectedMode, fetchTraffic);

onMounted(fetchTraffic);
</script>