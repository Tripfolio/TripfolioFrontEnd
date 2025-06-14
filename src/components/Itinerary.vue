<template>
  <div
    class="fixed bottom-4 right-4 w-72 bg-white shadow-lg rounded-lg p-4 z-50 max-h-[90vh] overflow-y-auto"
  >
    <h3 class="text-lg font-bold mb-4">已加入的景點</h3>
    <ul>
      <li
        v-for="p in itineraryPlaces"
        :key="p.id"
        class="mb-4 border-b last:border-none"
      >
        <strong class="block">{{ p.name }}</strong>
        <strong class="block text-yellow-600">{{ p.rating }}</strong>
        <img :src="p.photo" class="aspect-[4/3]" />
        <span class="text-sm text-gray-600">{{ p.address }}</span>
        <br />
        <button @click="removePlace(p)">🗑️ remove</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { toRefs, ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  selectedPlace: Object,
  defaultImage: String,
});
const { selectedPlace, defaultImage } = toRefs(props);
const itineraryPlaces = ref([]);
const API_URL = import.meta.env.VITE_API_URL;
onMounted(() => {
  loadItinerary();
});

async function loadItinerary() {
  try {
    const res = await axios.get(`${API_URL}/api/itinerary/places`, {
      params: {
        itineraryId: 1,
      },
    });
    itineraryPlaces.value = res.data.places;
  } catch (error) {
    alert("載入行程失敗:");
  }
}

async function addPlace() {
  if (!selectedPlace.value) {
    alert("請先選擇一個地點");
    return;
  }
  const { name, formatted_address, photos } = selectedPlace.value;

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
      itineraryId: 1,
      name,
      address: formatted_address || "",
      photo,
    });

    if (rep.data.success) {
      itineraryPlaces.value.push({
        name,
        address: formatted_address || "",
        photo,
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
    const url = `${API_URL}/api/itinerary/place?itineraryId=1&name=${encodeURIComponent(
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
defineExpose({ addPlace });
</script>
