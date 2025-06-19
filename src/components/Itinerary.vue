<template>
  <div
    class="fixed bottom-4 right-4 w-72 bg-white shadow-lg rounded-lg p-4 z-50 max-h-[90vh] overflow-y-auto"
  >
    <h3 class="text-lg font-bold mb-4">已加入的景點</h3>

    <draggable
      v-model="itineraryPlaces"
      item-key="name"
      ghost-class="bg-yellow-100"
      animation="200"
      @end="updateOrder"
    >
      <template #item="{ element: p, index }">
        <div>
          <li
            class="mb-4 border-b bg-gray-500 list-none flex justify-between rounded-2xl w-l relative items-stretch"
          >
            <!-- 右半邊 -->
            <div class="w-1/2 p-3">
              <p
                class="number bg-red-600 w-6 text-center rounded-2xl text-amber-50"
              >
                {{ index + 1 }}
              </p>
              <h3 class="block text-white text-l mb-1.5">{{ p.name }}</h3>
              <!-- 時間選單與按鈕 -->
              <div class="flex flex-col items-start text-white text-xs">
                <p
                  v-if="!p.editingTime"
                  class="cursor-pointer pb-2"
                  @click="startEditing(p)"
                >
                  {{ formatTime(p.arrivalHour, p.arrivalMinute) }}抵達
                </p>

                <div v-else class="flex flex-col gap-1">
                  <div class="flex gap-1 items-center">
                    <!-- 小時 -->
                    <select
                      v-model="p.arrivalHourTemp"
                      class="appearance-none outline-0"
                    >
                      <option v-for="h in 24" :key="h" :value="h - 1">
                        {{ (h - 1).toString().padStart(2, "0") }}
                      </option>
                    </select>
                    :
                    <!-- 分鐘 -->
                    <select
                      v-model="p.arrivalMinuteTemp"
                      class="appearance-none outline-0"
                    >
                      <option v-for="m in [0, 15, 30, 45]" :key="m" :value="m">
                        {{ m.toString().padStart(2, "0") }}
                      </option>
                    </select>
                    抵達
                  </div>

                  <div class="flex gap-2 mt-1">
                    <button @click="confirmTime(p)" class="text-green-300">
                      ✔ 更改
                    </button>
                    <button @click="cancelEditing(p)" class="text-red-300">
                      ✘ 取消
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 右半邊end -->
            <img
              :src="p.photo"
              class="w-1/2 rounded-tr-lg rounded-br-lg object-cover"
            />

            <br />
            <!-- 選單按鈕 -->
            <div class="relative">
              <button
                @click.stop="toggleMenu(index)"
                class="button-list absolute right-0"
              >
                <font-awesome-icon
                  icon="ellipsis-h"
                  class="p-1 text-white bg-cyan-800 rounded-full cursor-pointer absolute right-2 top-2"
                />
              </button>
              <ul
                v-if="openMenuIndex === index"
                class="absolute right-0 mt-12 bg-white shadow rounded"
              >
                <li>
                  <button
                    @click="removePlace(p)"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    🗑️ remove
                  </button>
                </li>
              </ul>
            </div>
            <!-- 選單按鈕end -->
          </li>
          <TrafficBetween
            v-if="itineraryPlaces[index + 1]"
            :itineraryId="itineraryId"
            :fromPlaceId="p.id"
            :toPlaceId="itineraryPlaces[index + 1].id"
            :origin="{ lat: p.lat, lng: p.lng }"
            :destination="{
              lat: itineraryPlaces[index + 1].lat,
              lng: itineraryPlaces[index + 1].lng,
            }"
            :traffic-data="trafficMap.get(`${p.id}-${itineraryPlaces[index + 1].id}`) || null"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { toRefs, ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import draggable from "vuedraggable";
import TrafficBetween from "./TrafficBetween.vue";

const trafficMap = ref(new Map());
const props = defineProps({
  selectedPlace: Object,
  defaultImage: String,
});
const { selectedPlace, defaultImage } = toRefs(props);
const itineraryPlaces = ref([]);
const trafficList = ref([]);
const itineraryId = 1
const API_URL = import.meta.env.VITE_API_URL;

onMounted(async () => {
  await loadItinerary();
  await fetchTrafficData();
  window.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", onClickOutside);
});

async function loadItinerary() {
  try {
    const res = await axios.get(`${API_URL}/api/itinerary/places`, {
      params: {itineraryId},
    });
    itineraryPlaces.value = res.data.places
    .map((p) => ({
        ...p,
        lat: Number(p.lat),
        lng: Number(p.lng),
      }))
    .sort((a, b) => a.arrivalHour - b.arrivalHour);
  } catch (error) {
    alert("載入行程失敗:");
  }
}

async function fetchTrafficData () {
  try {
    const { data } = await axios.get(`${API_URL}/api/traffic/get-all-traffic`, {
      params: { itineraryId }
    });
    if (data.success) {
      const map = new Map();
      data.data.forEach(t => {
        map.set(`${t.fromPlaceId}-${t.toPlaceId}`, t);
      });
      trafficMap.value = map;
      
    } else {
      console.warn("載入交通資料失敗：", data.message);
    }
  } catch (err) {
    console.error("fetchTrafficData error:", err);
  }
}

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

async function addPlace() {
  if (!selectedPlace.value) {
    alert("請先選擇一個地點");
    return;
  }
  const { name, formatted_address, photos, geometry } = selectedPlace.value;
  const lat = geometry?.location?.lat?.();
  const lng = geometry?.location?.lng?.();
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
  alert("⚠️ 無效的經緯度");
  return;
}

  const photo = photos?.length
    ? photos[0].getUrl({ maxWidth: 1000 })
    : defaultImage.value;

  try {
    const defaultHour = 0;
    const defaultMinute = 0;
    const rep = await axios.post(`${API_URL}/api/itinerary/add-place`, {
      itineraryId: 1,
      name,
      address: formatted_address || "",
      photo,
      lat,
      lng,
    });

    if (rep.data.success) {
      itineraryPlaces.value.push({
        name,
        address: formatted_address || "",
        photo,
        arrivalHour: defaultHour,
        arrivalMinute: defaultMinute,
        placeOrder: itineraryPlaces.value.length + 1,
        lat,
        lng,
      });
      alert("成功加入行程！");
    } else {
      alert("加入失敗：" + rep.data.message);
    }
  } catch (error) {
    alert("發生錯誤：" + error.message);
  }
}

async function removePlace(place) {
  try {
    const url = `${API_URL}/api/itinerary/place?id=${place.id}`;
    const response = await axios.delete(url);

    if (response.data.success) {
      itineraryPlaces.value = itineraryPlaces.value.filter(
        (p) => p.id !== place.id
      );
      alert("成功刪除景點");
    } else {
      alert("刪除失敗：" + response.data.message);
    }
  } catch (error) {
    alert("發生錯誤：" + error.message);
  }
}

defineExpose({ addPlace });
</script>

<style scoped></style>
