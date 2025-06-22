<template>
  <div style="display: none"></div>
</template>

<script setup>
import { toRefs, ref, onMounted, onBeforeUnmount, watch } from "vue";
import axios from "axios";


const props = defineProps({
  tripId: {
    type: [String, Number],
    required: true,
  },
  selectedDate: {
    type: String,
    required: true,
  },
  defaultImage: {
    type: String,
    default: 'https://placehold.co/600x400?text=No+Image',
  },
  selectedPlace: {
    type: Object,
    default: null,
  },
});

const { defaultImage, tripId, selectedDate } = toRefs(props);
const selectedPlace = props.selectedPlace;
const itineraryPlaces = ref([]);
const API_URL = import.meta.env.VITE_API_URL;

onMounted(() => {
  loadItinerary();
  window.addEventListener("click", onClickOutside);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", onClickOutside);
});

async function loadItinerary() {
  try {
    if (!tripId.value || !selectedDate.value) return;
    
    const id = Number(tripId.value)
    const res = await axios.get(`${API_URL}/api/itinerary/places`, {
      params: {
        itineraryId: id,
        date: selectedDate.value,
      },
    });
    itineraryPlaces.value = res.data.places
      .filter(p => p.date === selectedDate.value)
      .sort((a, b) => a.arrivalHour - b.arrivalHour);
  } catch (error) {
    alert("載入行程失敗:");
  }
}

watch(selectedDate, () => {
  loadItinerary();
});

//景點選單順序
const openMenuIndex = ref(null);

//控制景點選單開關
const toggleMenu = (index) => {
  openMenuIndex.value = openMenuIndex.value === index ? null : index;
};

// 全局點擊事件處理
function onClickOutside(event) {
  // 判斷點擊的目標元素
  // 這裡用 class 名稱判斷，建議你的按鈕和選單都有明確 class
  const target = event.target;
  if (
    !target.closest(".button-list") && // 按鈕外面
    !target.closest(".menu-list") // 選單外面
  ) {
    openMenuIndex.value = null;
  }
}

function startEditing(p) {
  p.editingTime = true;
  // 暫存目前的時間
  p.arrivalHourTemp = p.arrivalHour ?? 0;
  p.arrivalMinuteTemp = p.arrivalMinute ?? 0;
}

function cancelEditing(p) {
  p.editingTime = false;
}

//制定時間規格
function formatTime(hour, minute) {
  const h = (hour ?? 0).toString().padStart(2, "0");
  const m = (minute ?? 0).toString().padStart(2, "0");
  return `${h}:${m}`;
}

//確認更改時間
async function confirmTime(p) {
  p.arrivalHour = p.arrivalHourTemp;
  p.arrivalMinute = p.arrivalMinuteTemp;
  p.editingTime = false;
  const newTime = p.arrivalHourTemp * 60 + p.arrivalMinuteTemp;
  const hasConflict = itineraryPlaces.value.some(
    (place) =>
      place.id !== p.id &&
      place.arrivalHour * 60 + place.arrivalMinute === newTime
  );

  if (hasConflict) {
    alert("有其他景點的抵達時間重複，請選擇不同的時間！");
    return;
  }

  try {
    await axios.put(`${API_URL}/api/itineraryTime/places/${p.id}`, {
      arrivalHour: p.arrivalHour,
      arrivalMinute: p.arrivalMinute,
    });
    console.log("抵達時間更新成功");
  } catch (err) {
    console.error("更新抵達時間失敗：", err);
  }
}

//更新順序
async function updateOrder() {
  const newOrder = itineraryPlaces.value.map((place, index) => ({
    id: place.id,
    placeOrder: index + 1,
  }));

  console.log("要傳到後端的資料：", newOrder);

  try {
    const response = await axios.put(
      `${API_URL}/api/itinerary/places/reorder`,
      {
        places: newOrder,
      }
    );
    console.log("順序已更新", response.data);
  } catch (err) {
    console.error("無法更新順序：", err.response?.data || err.message);
  }
}

async function addPlace(place,date) {
  const id = tripId.value;
  if (!place || !date) {

    alert("請先選擇一個地點");
    return;
  }
  const { name, formatted_address, photos } = place;

  const exists = itineraryPlaces.value.some((p) => p.name === name);
  if (exists) {
    alert("這個景點已經加入行程！");
    return;
  }

  const photo = photos?.length
    ? photos[0].getUrl({ maxWidth: 1000 })
    : defaultImage.value;

  try {
    const rep = await axios.post(`${API_URL}/api/itinerary/add-place`, {
      itineraryId: Number(id),
      date: String(date),
      name,
      address: typeof formatted_address === 'object' ? formatted_address?.formatted_address || '' : formatted_address || '',
      photo,
    });

    if (rep.data.success && rep.data.place) {
      itineraryPlaces.value.push(rep.data.place);
      alert("成功加入行程！");
    } else {
      alert("加入失敗：" + rep.data.message);
    }
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || "未知錯誤";
    alert("加入失敗：" + msg);
  }
}

async function removePlace(place) {
  try {
    const url = `${API_URL}/api/itinerary/place?itineraryId=${tripId.value}&name=${encodeURIComponent(
      place.name
    )}`;
    const response = await axios.delete(url);

    if (response.data.success) {
      itineraryPlaces.value = itineraryPlaces.value.filter(
        (p) => p.name !== place.name
      );
      alert("成功刪除景點");
    } else {
      alert("刪除失敗：" + response.data.message);
    }
  } catch (error) {
    alert("發生錯誤：" + error.message);
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
});


</script>

<style scoped></style>