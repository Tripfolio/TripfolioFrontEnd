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
    >
      <template #item="{ element: p, index }">
        <li
          class="mb-4 border-b bg-gray-500 list-none flex justify-between rounded-2xl w-l relative items-stretch"
        >
          <!-- 右半邊 -->
          <div class="w-1/2 p-3">
            <h3 class="block text-white text-l mb-1.5">{{ p.name }}</h3>
            <button class="flex flex-col items-start">
              <p
                v-if="!p.editingTime"
                class="text-white cursor-pointer text-xs pb-5"
                @click="p.editingTime = true"
              >
                {{ arrivalTime }}抵達
              </p>
            </button>
            <p class="text-xs text-white">離開時間：{{ leaveTime }}</p>
          </div>
          <!-- 右半邊end -->
          <img
            :src="p.photo"
            class="w-1/2 rounded-tr-lg rounded-br-lg object-cover"
          />
          <!-- <strong class="block text-yellow-600">{{ p.rating }}</strong> -->
          <!-- <span class="text-sm text-gray-200">{{ p.address }}</span> -->
          <br />
          <!-- 選單按鈕 -->
          <div
            class="relative"
            v-click-outside="{
              handler: () => {
                menuOpen = false;
              },
            }"
          >
            <button
              @click="toggleMenu(index)"
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
import { ref } from "vue";
import axios from "axios";
import { onMounted } from "vue";
import draggable from "vuedraggable";

onMounted(() => {
  loadItinerary();
});

async function loadItinerary() {
  try {
    const res = await axios.get("http://localhost:3000/api/itinerary/places", {
      params: {
        itineraryId: 1,
      },
    });
    itineraryPlaces.value = res.data.places;
  } catch (error) {
    console.error("載入行程失敗:", error);
  }
}

const props = defineProps({
  selectedPlace: Object,
  defaultImage: String,
});
const itineraryPlaces = ref([]);
const arrivalTime = ref("12:00");
const leaveTime = ref("13:00");
let menuOpen = ref(false);
// const toggleMenu = () => {
//   menuOpen.value = !menuOpen.value;
// };

const openMenuIndex = ref(null);

const toggleMenu = (index) => {
  openMenuIndex.value = openMenuIndex.value === index ? null : index;
};

const closeMenu = () => {
  console.log("outside"); // ⬅️ 如果這個出現了就代表成功
  menuOpen.value = false;
};

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
