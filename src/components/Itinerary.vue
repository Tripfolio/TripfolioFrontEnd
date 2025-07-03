<template>
  <div style="display: none"></div>
</template>

<script setup>
import {
  toRefs,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
  toRef,
} from "vue";
import axios from "axios";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const emit = defineEmits(["refresh"]);

const props = defineProps({
  tripId: [String, Number],
  selectedDate: String,
  defaultImage: {
    type: String,
    default: "https://placehold.co/600x400?text=No+Image",
  },
  selectedPlace: Object,
  role: {
    type: String, // 🔒 權限控制：接收 role
  },
});

const { defaultImage, tripId, selectedDate } = toRefs(props);
const itineraryPlaces = ref([]);
const API_URL = import.meta.env.VITE_API_URL;

const trafficMap = ref({});

// 🔒 權限控制：定義是否可編輯
const canEdit = computed(
  () => props.role === "owner" || props.role === "editor",
);

onMounted(() => {
  loadItinerary();
  window.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", onClickOutside);
});

//日期變了重新載入清單
watch(selectedDate, () => {
  loadItinerary();
});

//向後端請求景點資料
async function loadItinerary() {
  try {
    if (!tripId.value || !selectedDate.value) return;
    const res = await axios.get(`${API_URL}/api/itinerary/places`, {
      params: { itineraryId: tripId.value, date: selectedDate.value },
    });
    itineraryPlaces.value = res.data.places
      .filter((p) => p.date === selectedDate.value)
      .sort((a, b) => a.arrivalHour - b.arrivalHour);
    await fetchTrafficData(); //撈「交通資料」
    emit("refresh", itineraryPlaces.value); // ← 這行通知父層
  } catch (error) {
    alert($t('itinerary.loadItineraryFail'));
  }
}

//景點選單順序
const openMenuIndex = ref(null);

//控制景點選單開關
const toggleMenu = (index) => {
  openMenuIndex.value = openMenuIndex.value === index ? null : index;
};

// 全域點擊事件處理
function onClickOutside(e) {
  if (!e.target.closest(".button-list") && !e.target.closest(".menu-list")) {
    openMenuIndex.value = null;
  }
}

function startEditing(p) {
  // if (!canEdit.value) {
  //   alert("您沒有編輯權限");
  //   return;
  // }
  p.editingTime = true;
  p.arrivalHourTemp = p.arrivalHour ?? 0;
  p.arrivalMinuteTemp = p.arrivalMinute ?? 0;
}

function cancelEditing(p) {
  p.editingTime = false;
}

//制定時間規格
function formatTime(hour, minute) {
  return `${String(hour ?? 0).padStart(2, "0")}:${String(minute ?? 0).padStart(2, "0")}`;
}

//確認更改時間
async function confirmTime(p) {
  // if (!canEdit.value) {
  //   alert("您沒有編輯權限");
  //   return;
  // }
  const newTime = p.arrivalHourTemp * 60 + p.arrivalMinuteTemp;
  const hasConflict = itineraryPlaces.value.some(
    (place) =>
      place.id !== p.id &&
      place.arrivalHour * 60 + place.arrivalMinute === newTime,
  );
  if (hasConflict) {
    alert($t('itinerary.timeConflict'));
    return;
  }

  p.arrivalHour = p.arrivalHourTemp;
  p.arrivalMinute = p.arrivalMinuteTemp;
  p.editingTime = false;

  try {
    await axios.put(`${API_URL}/api/itineraryTime/places/${p.id}`, {
      arrivalHour: p.arrivalHour,
      arrivalMinute: p.arrivalMinute,
    });
  } catch {
    alert($t('itinerary.updateTimeFail'));
  }
}

//更新順序
async function updateOrder() {
  const newOrder = itineraryPlaces.value.map((p, i) => ({
    id: p.id,
    placeOrder: i + 1,
  }));
  try {
    await axios.put(`${API_URL}/api/itinerary/places/reorder`, {
      places: newOrder,
    });
    await loadItinerary();
    emit("refresh");
  } catch {
    alert($t('itinerary.updateOrderFail'));
  }
}

//加入景點
async function addPlace(place, date) {
  // if (!canEdit.value) {
  //   alert("您沒有權限新增景點");
  //   return false;
  // }

  if (!place || !date) {
    alert($t('itinerary.selectLocationDate'));
    return false;
  }
  const exists = itineraryPlaces.value.some((p) => p.name === place.name);
  if (exists) {
    alert($t('itinerary.placeAlreadyAdded'));
    return false;
  }
  const photo =
    place.photos?.[0]?.getUrl({ maxWidth: 1000 }) || defaultImage.value;
  const lat = place.geometry?.location?.lat?.();
  const lng = place.geometry?.location?.lng?.();

  try {
    const res = await axios.post(`${API_URL}/api/itinerary/add-place`, {
      itineraryId: tripId.value,
      date,
      name: place.name,
      address:
        typeof place.formatted_address === "object"
          ? place.formatted_address?.formatted_address
          : place.formatted_address,
      photo,
      lat,
      lng,
    });
    if (res.data.success) {
      await loadItinerary();
      emit("refresh");
      return true;
    }
    alert($t('itinerary.addPlaceFail') + res.data.message);
    return false;
  } catch {
    alert($t('itinerary.addPlaceFail'));
    return false;
  }
}

//移除景點
async function removePlace(p) {
  // if (!canEdit.value) {
  //   alert("您沒有權限刪除景點");
  //   return false;
  // }

  try {
    const res = await axios.delete(`${API_URL}/api/itinerary/place`, {
      params: { itineraryId: tripId.value, name: p.name },
    });
    if (res.data.success) {
      await loadItinerary();
      emit("refresh");
      return true;
    }
    alert($t('itinerary.removePlaceFail'));
    return false;
  } catch {
    alert($t('itinerary.removePlaceFail'));
    return false;
  }
}

//交通資料
async function fetchTrafficData() {
  try {
    const res = await axios.get(`${API_URL}/api/traffic/get-all-traffic`, {
      params: { itineraryId: tripId.value },
    });
    const map = {};
    res.data.data.forEach((t) => {
      map[`${t.fromPlaceId}-${t.toPlaceId}`] = t;
    });
    trafficMap.value = map;
  } catch (err) {
    console.error("交通資料載入失敗", err);
  }
}

defineExpose({
  addPlace,
  itineraryPlaces,
  startEditing,
  cancelEditing,
  confirmTime,
  updateOrder,
  removePlace,
  formatTime,
  trafficMap,
});
</script>
