<template>
  <div class="homepage-bg relative">

    <!-- Google Calendar通知 -->
    <div class="relative">
      <div
        v-if="googleCalendarMessage"
        :class="[
          'fixed top-4 left-1/2 transform -translate-x-1/2 max-w-xs w-full px-6 py-4 rounded-lg shadow-lg z-50 text-white backdrop-blur-md border border-white/10',
          googleCalendarMessage.includes('成功') || googleCalendarMessage.includes('正在建立行程') || googleCalendarMessage.includes('正在請求 Google 認證') || googleCalendarMessage.includes('Google 服務初始化中')
            ? 'bg-gray-800/50'
            : 'bg-red-800/50'
        ]"
      >
        <p class="text-sm">{{ googleCalendarMessage }}</p>
        <a
          v-if="googleCalendarEventLink"
          :href="googleCalendarEventLink"
          target="_blank"
          rel="noopener noreferrer"
          class="underline mt-2 block text-sm"
        >
          開啟 Google Calendar
        </a>
        <button
          @click="googleCalendarMessage = ''"
          class="absolute top-1 right-2 text-white text-xl"
        >
          &times;
        </button>
      </div>
    </div>


    <div class="flex flex-col lg:flex-row h-screen">

      <!-- 左側：地圖區 -->
      <div class="h-[65%] lg:h-full lg:w-4/6 relative overflow-hidden mb-2 shadow-2xl">
        <div class="w-full h-full relative overflow-hidden">
          <GoogleMapView
            ref="mapRef"
            :trip="selectedTrip"
            :selected-place="selectedPlace"
            :current-day-index="currentDayIndex"
            :daily-plan-ref="dailyPlanRef"
            :schedule-detail-ref="scheduleDetailRef"
            :default-image="defaultImage"
            @place-added="handlePlaceAdded"
          />
        </div>
      </div>

      <!-- 右側：行程列表 -->
      <div class="flex-1 lg:w-2/6 h-[45%] lg:h-full overflow-y-auto">

        <!-- 建立行程按鈕 -->
        <div v-if="!editingTripId" class="fixed bottom-5 right-6 z-50">
          <button
            @click="handleOpenForm"
            class="animated-gradient-modern text-white text-xl px-10 py-3 rounded-full shadow-md shadow-black/40 cursor-pointer bg-gradient-trip hover:bg-gradient-trip-hover"
          >
            建立行程
          </button>
        </div>

        <!-- 行程卡片列表 -->
        <div v-if="!editingTripId" class="travel-card-style rounded-2xl p-7 m-5">
          <div v-if="tripStore.trips.length > 0" class="solo-card-style mt-2 space-y-4 rounded-xl">
            <div
              v-for="item in tripStore.trips"
              :key="item.id"
              @click="editingTripId = item.id"
              class="rounded-2xl shadow-md shadow-black/40 overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-gray-400 transition"
            >
              <img
                :src="item.coverURL || 'https://placehold.co/600x300?text=封面圖'"
                class="w-full h-60 object-cover rounded-tl-xl rounded-tr-xl mb-3"
                alt="行程封面照"
              />
              <div class="px-5">
                <h2 class="text-xl text-white font-bold mb-1">{{ item.title }}</h2>
                <p class="text-white text-m">{{ item.startDate }} - {{ item.endDate }}</p>
                <p class="text-white text-m mt-2">{{ item.description }}</p>
              </div>

              <!-- Google Calendar + 刪除按鈕 -->
              <div class="absolute bottom-2 left-2 right-2 flex justify-end items-center px-">

                <!-- Google Calendar 按鈕 -->
                <button
                  @click.stop="handleAddToGoogleCalendar(item)"
                  :disabled="googleCalendarLoading && currentProcessingTripId === item.id"
                  class="text-gray-600 px-2 rounded-2xl hover:text-blue-500 text-md flex items-center"
                >
                  <span v-if="googleCalendarLoading && currentProcessingTripId === item.id" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    處理中...
                  </span>
                  <span v-else>
                    <img
                    src="@/assets/icons/googleCalendar.svg"
                    alt="Google Calendar"
                    class="w-5 h-5"
                    />
                  </span>
                </button>

                <!-- 刪除按鈕 -->
                <button
                  @click.stop="deleteSchedule(item.id)"
                  title="刪除行程"
                  class="text-gray-600 bg-white px-2 rounded-2xl hover:text-red-500 text-md"
                >
                  刪除行程
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 編輯行程 -->
        <ScheduleDetail
          v-else
          :trip-id="editingTripId"
          :selected-date="selectedTrip?.days?.[currentDayIndex]?.date"
          ref="scheduleDetailRef"
          @back="handleCloseDetail"
          @day-changed="currentDayIndex = $event"
          class="w-[50%] lg:w-full"
        />
      </div>

      <!-- 建立行程表單 Modal -->
      <div v-if="showForm" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4">
        <div>
          <TravelSchedule @close="handleCloseForm" />
        </div>
      </div>

      <!-- 付款提醒 Modal -->
      <PaymentModal
        v-if="showPayModal"
        :result="payResult"
        @close="showPayModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TravelSchedule from '@/components/TravelSchedule.vue';
import PaymentModal from "@/components/PaymentModal.vue";
import axios from 'axios';
import GoogleMapView from '@/views/GoogleMapView.vue';
import ScheduleDetail from '@/views/scheduleDetail.vue';
import { useTripStore } from '@/stores/tripStore';
import { useGoogleCalendar } from '@/composable/useGoogleCalendar';

const router = useRouter();
const route = useRoute();
const editingTripId = ref(null);
const tripStore = useTripStore();
const showForm = ref(false);
const isPremium = ref(false);
const showPayModal = ref(false);
const selectedPlace = ref(null);
const defaultImage = "https://picsum.photos/1000?image";
const currentDayIndex = ref(0);
const itineraryRef = ref(null);
const dailyPlanRef = ref(null);
const mapRef = ref(null);
const scheduleDetailRef = ref(null);
const payResult = ref(null);

const selectedTrip = computed(() => tripStore.trips.find((t) => t.id === editingTripId.value));

const fetchIsPremium = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    isPremium.value = res.data.isPremium;
  } catch (err) {}
};

onMounted(() => {
  tripStore.fetchTrips();
  fetchIsPremium();

  if (route.query.linepayResult === 'success' || route.query.linepayResult === 'fail') {
    payResult.value = route.query.linepayResult;
    showPayModal.value = true;
  }
});

const handleOpenForm = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("請先登入會員");
    return;
  }

  const count = tripStore.trips.length;
  if (isPremium.value || count < 1) {
    showForm.value = true;
  } else {
    showPayModal.value = true;
  }
};

const goToPay = () => {
  showPayModal.value = false;
  router.push("/payment");
};

function handlePlaceAdded() {
  scheduleDetailRef.value?.refreshDailyPlan?.();
}

function refreshDailyPlan() {
  dailyPlanRef.value?.refresh?.();
}

const handleCloseForm = () => {
  showForm.value = false;
  tripStore.fetchTrips();
  fetchIsPremium();
};

const handleCloseDetail = () => {
  editingTripId.value = null;
  tripStore.fetchTrips();
};

// Google Calendar 功能
const {
  message: googleCalendarMessage,
  eventLink: googleCalendarEventLink,
  loading: googleCalendarLoading,
  authorizeAndCreateEvent
} = useGoogleCalendar();

const currentProcessingTripId = ref(null);

const handleAddToGoogleCalendar = async (tripItem) => {
  currentProcessingTripId.value = tripItem.id;
  await authorizeAndCreateEvent(tripItem);
  currentProcessingTripId.value = null;
};

let messageTimeout = null;
watch(googleCalendarMessage, (newVal) => {
  if (newVal) {
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
      googleCalendarMessage.value = '';
      googleCalendarEventLink.value = '';
    }, 5000);
  }
});

const deleteSchedule = async (id) => {
  const confirmed = confirm("確定刪除這個行程嗎?");
  if (!confirmed) return;

  const token = localStorage.getItem("token");
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/travelSchedule/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    tripStore.trips = tripStore.trips.filter((s) => s.id !== id);
    alert("刪除成功");
  } catch (err) {
    alert("刪除失敗，請稍後再試");
  }
};

defineExpose({
  refreshDailyPlan,
  dailyPlanRef,
  googleCalendarMessage,
  googleCalendarEventLink,
  googleCalendarLoading,
});
</script>
