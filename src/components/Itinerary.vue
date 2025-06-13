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
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import draggable from "vuedraggable";

onMounted(() => {
  loadItinerary();
  window.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", onClickOutside);
});

async function loadItinerary() {
  try {
    const res = await axios.get("http://localhost:3000/api/itinerary/places", {
      params: {
        itineraryId: 1,
      },
    });

    // itineraryPlaces.value = res.data.places;
    itineraryPlaces.value = res.data.places.sort(
      (a, b) => a.arrivalHour - b.arrivalHour
    );
  } catch (error) {
    console.error("載入行程失敗:", error);
  }
}

const props = defineProps({
  selectedPlace: Object,
  defaultImage: String,
});

const itineraryPlaces = ref([]);

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

  try {
    await axios.put(`http://localhost:3000/api/itineraries/places/${p.id}`, {
      arrivalHour: p.arrivalHour,
      arrivalMinute: p.arrivalMinute,
    });
    console.log("✅ 抵達時間更新成功");
  } catch (err) {
    console.error("❌ 更新抵達時間失敗：", err);
  }
}

//更新順序
async function updateOrder() {
  const newOrder = itineraryPlaces.value.map((place, index) => ({
    id: place.id,
    placeOrder: index + 1,
  }));

  console.log("📦 要傳到後端的資料：", newOrder);

  try {
    const response = await axios.put(
      "http://localhost:3000/api/itinerary/places/reorder",
      {
        places: newOrder,
      }
    );
    console.log("✅ 順序已更新", response.data);
  } catch (err) {
    console.error("❌ 無法更新順序：", err.response?.data || err.message);
  }
}

// 加入行程
async function addPlace() {
  if (!props.selectedPlace) {
    alert("請先選擇一個地點");
    return;
  }

  const exists = itineraryPlaces.value.some(
    (p) => p.name === props.selectedPlace.name
  );
  if (exists) {
    alert("⚠️ 這個景點已經加入行程！");
    return;
  }

  try {
    const defaultHour = 9;
    const defaultMinute = 0;

    const rep = await axios.post(
      "http://localhost:3000/api/itinerary/add-place",
      {
        itineraryId: 1,
        name: props.selectedPlace.name,
        address: props.selectedPlace.formatted_address || "",
        photo:
          props.selectedPlace.photos && props.selectedPlace.photos.length
            ? props.selectedPlace.photos[0].getUrl({ maxWidth: 1000 })
            : props.defaultImage,
        arrivalHour: defaultHour,
        arrivalMinute: defaultMinute,
        placeOrder: itineraryPlaces.value.length + 1,
      }
    );

    if (rep.data.success) {
      itineraryPlaces.value.push({
        name: props.selectedPlace.name,
        address: props.selectedPlace.formatted_address,
        rating: props.selectedPlace.rating || "N/A",
        photo:
          props.selectedPlace.photos && props.selectedPlace.photos.length
            ? props.selectedPlace.photos[0].getUrl({ maxWidth: 1000 })
            : props.defaultImage,
        arrivalHour: defaultHour,
        arrivalMinute: defaultMinute,
        placeOrder: itineraryPlaces.value.length + 1,
      });
      alert("✅ 成功加入行程！");
    } else {
      alert("❌ 加入失敗：" + rep.data.message);
    }
  } catch (error) {
    console.error("加入失敗:", error);
    alert("🚨 發生錯誤：" + error.message);
  }
}
// 刪除行程
async function removePlace(place) {
  console.log("刪除景點資料", place);

  try {
    const url = `http://localhost:3000/api/itinerary/place?itineraryId=1&name=${encodeURIComponent(
      place.name
    )}`;
    const response = await axios.delete(url);

    if (response.data.success) {
      itineraryPlaces.value = itineraryPlaces.value.filter(
        (p) => p.name !== place.name
      );
      alert("✅ 成功刪除景點");
    } else {
      alert("❌ 刪除失敗：" + response.data.message);
    }
  } catch (error) {
    console.error("刪除錯誤:", error);
    alert("🚨 發生錯誤：" + error.message);
  }
}
defineExpose({ addPlace });
</script>

<style scoped></style>
