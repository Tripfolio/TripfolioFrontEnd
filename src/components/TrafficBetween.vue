<template>
  <div class="flex flex-col items-center my-2">
    <select v-model="selectedMode" @change="getTravelInfo" class="mb-1 px-2 py-1 rounded border">
      <option value="DRIVING">🚗 開車</option>
      <option value="WALKING">🚶‍♂️ 步行</option>
      <option value="TRANSIT">🚇 大眾運輸</option>
    </select>
    <div>
      <span class="text-xs text-gray-700">
        {{ duration || "預估中..." }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  origin: Object,        // { lat, lng }
  destination: Object,   // { lat, lng }
});

const selectedMode = ref("DRIVING");
const duration = ref("預估中...");
let directionsService;

function getTravelInfo() {
  if (!props.origin || !props.destination) {
    duration.value = "資料錯誤";
    return;
  }

  directionsService ??= new window.google.maps.DirectionsService();

  directionsService.route(
    {
      origin: props.origin,
      destination: props.destination,
      travelMode: selectedMode.value,
    },
    (response, status) => {
      if (status === "OK") {
        duration.value = response.routes[0].legs[0].duration.text;
      } else {
        duration.value = "查詢失敗";
      }
    }
  );
}

watch(selectedMode, getTravelInfo, { immediate: true });

</script>
