<template>
  <div style="display: none"></div>
  <!-- <div
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
          
          <div class="w-1/2 p-3">
            <p
              class="number bg-red-600 w-6 text-center rounded-2xl text-amber-50"
            >
              {{ index + 1 }}
            </p>
            <h3 class="block text-white text-l mb-1.5">{{ p.name }}</h3>
           
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
                  
                  <select
                    v-model="p.arrivalHourTemp"
                    class="appearance-none outline-0"
                  >
                    <option v-for="h in 24" :key="h" :value="h - 1">
                      {{ (h - 1).toString().padStart(2, "0") }}
                    </option>
                  </select>
                  :
                  
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
          
          <img
            :src="p.photo"
            class="w-1/2 rounded-tr-lg rounded-br-lg object-cover"
          />

          <br />
          
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
          
        </li>
      </template>
    </draggable>
  </div> -->
</template>


<script setup>
import { toRefs, ref, onMounted, onBeforeUnmount, watch } from "vue";
import axios from "axios";

const emit = defineEmits(['refresh']);

const props = defineProps({
  tripId: [String, Number],
  selectedDate: String,
  defaultImage: {
    type: String,
    default: 'https://placehold.co/600x400?text=No+Image',
  },
  selectedPlace: Object,
});

const { defaultImage, tripId, selectedDate } = toRefs(props);
const itineraryPlaces = ref([]);
const API_URL = import.meta.env.VITE_API_URL;

onMounted(() => {
  loadItinerary();
  window.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", onClickOutside);
});

watch(selectedDate, () => {
  loadItinerary();
});

async function loadItinerary() {
  try {
    if (!tripId.value || !selectedDate.value) return;
    const res = await axios.get(`${API_URL}/api/itinerary/places`, {
      params: { itineraryId: tripId.value, date: selectedDate.value },
    });
    itineraryPlaces.value = res.data.places
      .filter(p => p.date === selectedDate.value)
      .sort((a, b) => a.arrivalHour - b.arrivalHour);

    emit('refresh');  // ← 這行通知父層
  } catch (error) {
    alert("載入行程失敗");
  }
}

//景點選單順序
const openMenuIndex = ref(null);

//控制景點選單開關
function toggleMenu(index) {
  openMenuIndex.value = openMenuIndex.value === index ? null : index;
}

// 全局點擊事件處理
function onClickOutside(e) {
  if (!e.target.closest(".button-list") && !e.target.closest(".menu-list")) {
    openMenuIndex.value = null;
  }
}

function startEditing(p) {
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
  const newTime = p.arrivalHourTemp * 60 + p.arrivalMinuteTemp;
  const hasConflict = itineraryPlaces.value.some(
    place => place.id !== p.id && (place.arrivalHour * 60 + place.arrivalMinute) === newTime
  );
  if (hasConflict) {
    alert("有其他景點時間重複！");
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
    alert("更新時間失敗");
  }
}

//更新順序
async function updateOrder() {
  const newOrder = itineraryPlaces.value.map((p, i) => ({ id: p.id, placeOrder: i + 1 }));
  try {
    await axios.put(`${API_URL}/api/itinerary/places/reorder`, { places: newOrder });
    await loadItinerary();
  } catch {
    alert("排序更新失敗");
  }
}

async function addPlace(place, date) {
  if (!place || !date) {
    alert("請選擇地點與日期");
    return false;
  }
  const exists = itineraryPlaces.value.some(p => p.name === place.name);
  if (exists) {
    alert("已加入此景點");
    return false;
  }
  const photo = place.photos?.[0]?.getUrl({ maxWidth: 1000 }) || defaultImage.value;

  try {
    const res = await axios.post(`${API_URL}/api/itinerary/add-place`, {
      itineraryId: tripId.value,
      date,
      name: place.name,
      address: typeof place.formatted_address === "object" ? place.formatted_address?.formatted_address : place.formatted_address,
      photo,
    });
    if (res.data.success) {
      await loadItinerary();
      return true;
    }
    alert("加入失敗：" + res.data.message);
    return false;
  } catch {
    alert("加入景點失敗");
    return false;
  }
}

async function removePlace(p) {
  try {
    const res = await axios.delete(`${API_URL}/api/itinerary/place`, {
      params: { itineraryId: tripId.value, name: p.name },
    });
    if (res.data.success) {
      await loadItinerary();
      return true;
    }
    alert("刪除失敗");
    return false;
  } catch {
    alert("刪除失敗");
    return false;
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