<template>
  <div class="p-6 w-full">
    <!-- 左側：行程總覽＋每日行程 -->
    <div class="lg:col-span-2">
      <!-- 行程總覽卡片 -->
      <TripOverview
        v-if="trip"
        :trip="trip"
        :cover-timestamp="coverTimestamp"
        @back-to-list="goBack"
        @update-cover="updateCover"
        @update-title="updateTitle"
        @update-notes="updateNotes"
        @update-dates="updateDates"
      />
      <!-- 日期切換按鈕 -->
      <div v-if="trip && trip.days?.length" class="flex gap-2 mt-4 flex-wrap">
        <button
          v-for="(day, index) in trip.days"
          :key="day"
          @click="currentDayIndex = index"
          class="px-4 py-1 rounded-full text-sm border"
          :class="
            currentDayIndex === index
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          "
        >
          第{{ index + 1 }}天
        </button>
      </div>
      <!-- 每日計畫 -->
      <DailyPlan
        v-if="trip && currentDayIndex !== null"
        :selected-trip="trip"
        :day-index="currentDayIndex"
        :itinerary-places="itineraryRef?.itineraryPlaces || []"
        class="mt-6"
        ref="dailyPlanRef"
      />
    </div>

    <!-- 右側：景點清單 -->
    <div class="lg:col-span-1">
      <Itinerary
        v-if="tripLoaded && trip?.id && currentDayIndex !== null"
        :trip-id="trip.id"
        :selected-date="trip.days[currentDayIndex].date"
        :default-image="'/images/default.jpg'"
        ref="itineraryRef"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import TripOverview from "../components/TripOverview.vue";
import DailyPlan from "../components/DailyPlan.vue";
import Itinerary from "../components/Itinerary.vue";
import { generateDaysArray } from "../stores/tripStore";

const props = defineProps({
  tripId: [String, Number],
});

const emit = defineEmits(["back"]);
const router = useRouter();
const trip = ref(null);
const tripLoaded = ref(false);
const currentDayIndex = ref(0);
const coverTimestamp = ref(Date.now());
const itineraryRef = ref(null);
const dailyPlanRef = ref(null);

const token = localStorage.getItem("token");

//返回行程列表
const goBack = () => {
  emit("back");
};

//取得行程資料
const fetchTrip = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/travelSchedule/${props.tripId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const tripData = res.data;
    tripData.days = generateDaysArray(tripData);
    trip.value = tripData;
    tripLoaded.value = true;
  } catch (err) {
    alert("無法載入行程");
    router.push("/schedule");
  }
};

onMounted(() => {
  fetchTrip();
});

watch(
  () => props.tripId,
  () => {
    fetchTrip();
  },
);

//更新送到後端
const updateCover = async (blob) => {
  const formData = new FormData();
  formData.append("cover", blob);

  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/travelSchedule/${props.tripId}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (res.data.coverURL) {
      trip.value.coverURL = res.data.coverURL;
      coverTimestamp.value = Date.now();
    }
    alert("封面已成功更新！");
  } catch (err) {
    alert("封面更新失敗");
  }
};

const updateTitle = async (newTitle) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/travelSchedule/${props.tripId}`,
      { title: newTitle },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    trip.value.title = newTitle;
  } catch (err) {
    alert("標題更新失敗");
  }
};

const updateDates = async ({ startDate, endDate }) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/travelSchedule/${props.tripId}`,
      { startDate, endDate },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    await fetchTrip();

    if (!trip.value.days.length) {
      currentDayIndex.value = null;
    } else if (
      currentDayIndex.value === null ||
      currentDayIndex.value >= trip.value.days.length
    ) {
      currentDayIndex.value = 0;
    }
  } catch (err) {
    alert("更新日期失敗");
  }
};

const updateNotes = async (newNotes) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/travelSchedule/${props.tripId}`,
      { description: newNotes },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    trip.value.description = newNotes;
  } catch (err) {
    alert("筆記更新失敗");
  }
};

watch(
  trip,
  (newTrip) => {
    if (Array.isArray(newTrip?.days) && newTrip.days.length > 0) {
      currentDayIndex.value = 0;
    }
  },
  { deep: true },
);

// 給父層或地圖強制刷新 DailyPlan 用
defineExpose({
  dailyPlanRef,
});
</script>
