<template>
    <div :class="['fixed right-0 top-0 h-full bg-gray-50 shadow-lg z-40 transition-all duration-300 ease-in-out flex flex-col', { 'w-full md:w-1/2 lg:w-1/3 xl:w-[500px]': isOpen, 'w-0': !isOpen }]">

        <button
            @click="toggleSidebar"
            :class="['absolute p-2 rounded-l-md text-white z-50 transition-all duration-300 ease-in-out', isOpen ? 'bg-gray-700 top-1/2 left-0 -translate-x-full -translate-y-1/2' : 'bg-gray-700 top-1/2 right-0 -translate-y-1/2 rounded-r-md']"
            style="width: 32px;"
            :aria-label="isOpen ? '收合側邊欄' : '展開側邊欄'">
            <font-awesome-icon :icon="isOpen ? ['fas', 'angle-right'] : ['fas', 'angle-left']" class="w-6 h-6" />
        </button>

        <div v-if="isOpen" class="flex flex-col h-full w-full">
            <div class="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-20">
                <h2 class="text-xl font-bold text-gray-800">行程管理</h2>
                <div class="flex space-x-3">
                    <button @click="closeSidebar" class="text-gray-500 hover:text-gray-700" aria-label="關閉側邊欄">
                        <font-awesome-icon :icon="['fas', 'xmark']" class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div v-if="tripStore.selectedTrip" class="flex-shrink-0 flex items-center bg-gray-100 border-b border-gray-200 shadow-sm sticky top-[65px] z-10 px-4 py-2 overflow-x-auto whitespace-nowrap ">
                <button
                    @click="currentView = 'tripOverview'; currentDayIndex = null;"
                    :class="['flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full mr-2', currentView === 'tripOverview' && currentDayIndex === null ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
                    總覽
                </button>
                <button
                    v-for="(day, index) in tripStore.selectedTrip?.days"
                    :key="day.date"
                    @click="selectDay(index)"
                    :class="['flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full mr-2', currentView === 'dailyPlans' && currentDayIndex === index ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
                    第 {{ index + 1 }} 天
                </button>
                <button
                    @click="addDayAndSelect"
                    class="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">
                    <font-awesome-icon :icon="['fas', 'plus']" /> 
                </button>
            </div>
            <div v-else class="flex-shrink-0 flex items-center bg-gray-100 border-b border-gray-200 shadow-sm sticky top-[65px] z-10 px-4 py-2">
                <span class="text-gray-500 text-sm">請從下方選擇行程來管理</span>
            </div>


            <div class="flex-grow p-4 overflow-y-auto">
                <div v-if="!tripStore.selectedTrip">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">我的行程</h2>
                    </div>
                    <div v-if="tripStore.trips.length === 0" class="text-center text-gray-500 py-10 text-base">
                        <p class="mb-4">還沒有任何行程資料！</p>
                    </div>
                    <ul class="space-y-4">
                        <li
                            v-for="trip in tripStore.trips"
                            :key="trip.id"
                            class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                            @click="viewTrip(trip.id)">
                            <img v-if="trip.cover" :src="trip.cover" alt="行程封面" class="w-full h-32 object-cover object-center" />
                            <div v-else class="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">無封面圖片</div>
                            <div class="p-4">
                                <h3 class="font-bold text-lg text-gray-800 mb-1">{{ trip.title }}</h3>
                                <p class="text-gray-600 text-sm">{{ trip.startDate }} ~ {{ trip.endDate }} (共 {{ trip.days.length }} 天)</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div v-if="currentView === 'tripOverview' && tripStore.selectedTrip">
                    <button @click="backToTripList" class="mb-4 text-gray-600 hover:text-gray-800 flex items-center text-sm">
                        <font-awesome-icon :icon="['fas', 'arrow-left']" class="w-4 h-4 mr-1" />
                        返回行程總覽
                    </button>
                    <div class="bg-white rounded-lg shadow-md overflow-hidden p-4 mb-6">
                        <div class="relative w-full h-48 rounded-md mb-4 group overflow-hidden">
                            <img v-if="tripStore.selectedTrip.cover" :src="tripStore.selectedTrip.cover" alt="行程封面" class="w-full h-full object-cover rounded-md" />
                            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                無封面圖片
                            </div>

                            <label for="cover-upload" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                <font-awesome-icon :icon="['fas', 'camera']" class="w-6 h-6 mr-2" />
                                更改封面
                            </label>
                            <input type="file" id="cover-upload" class="hidden" @change="handleCoverUpload" accept="image/*">
                        </div>

                        <div class="px-2">
                            <h2 v-if="!isTitleEditing" @click="isTitleEditing = true" class="text-2xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-gray-700">
                                {{ tripStore.selectedTrip.title }}
                                <font-awesome-icon :icon="['fas', 'pen-to-square']" class="ml-2 text-gray-500 text-lg" />
                            </h2>
                            <input
                                v-else
                                v-model="editableTrip.title"
                                @blur="saveTitle"
                                @keyup.enter="saveTitle"
                                class="text-2xl font-bold text-gray-900 mb-2 p-1 border border-gray-300 rounded w-full"/>

                            <p class="text-md text-gray-600 mb-2">
                                {{ tripStore.selectedTrip.startDate }} - {{ tripStore.selectedTrip.endDate }} (共 {{ tripStore.selectedTrip.days.length }} 天)
                            </p>
                            <div class="flex items-center text-gray-500 mb-4">
                                <span class="text-sm">筆記：</span>
                                <textarea
                                    v-model="editableTrip.notes"
                                    @blur="saveNotes"
                                    class="flex-grow ml-2 p-2 border border-gray-300 rounded-md text-sm resize-y min-h-[60px] text-gray-800"
                                    placeholder="點擊這裡新增或編輯行程筆記...">
                                </textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="currentView === 'dailyPlans' && tripStore.selectedTrip && currentDayIndex !== null">
                    <button @click="backToTripOverview" class="mb-4 text-gray-600 hover:text-gray-800 flex items-center text-sm">
                        <font-awesome-icon :icon="['fas', 'arrow-left']" class="w-4 h-4 mr-1" />
                        返回行程主頁
                    </button>
                    <DailyPlan
                        :selected-trip="tripStore.selectedTrip"
                        :day-index="currentDayIndex"
                        :day-number="currentDayIndex + 1"/>
                </div>

                <div v-if="!tripStore.selectedTrip && currentView === 'tripOverview'" class="text-center text-gray-500 py-10 text-base">
                    請從「我的行程」中選擇一個行程來編輯。
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useTripStore } from '@/stores/tripStore';
import DailyPlan from '@/components/DailyPlan.vue';

const tripStore = useTripStore();

const isOpen = ref(false);
const currentView = ref('tripOverview');
const currentDayIndex = ref(null);

const editableTrip = ref({
    title: '',
    notes: '',
});
const isTitleEditing = ref(false);

const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
};

const closeSidebar = () => {
    isOpen.value = false;
    tripStore.selectedTrip = null;
    tripStore.selectedTripId = null;
    currentView.value = 'tripOverview';
    currentDayIndex.value = null;
};

const viewTrip = (id) => {
    tripStore.selectTrip(id);
    currentView.value = 'tripOverview';
    currentDayIndex.value = null;
};

const backToTripList = () => {
    tripStore.selectedTrip = null;
    tripStore.selectedTripId = null;
    currentView.value = 'tripOverview';
    currentDayIndex.value = null;
};

const backToTripOverview = () => {
    currentView.value = 'tripOverview';
    currentDayIndex.value = null;
};

const selectDay = (index) => {
    currentDayIndex.value = index;
    currentView.value = 'dailyPlans';
};

const addDayAndSelect = () => {
    if (tripStore.selectedTrip) {
        const currentTripId = tripStore.selectedTrip.id;
        tripStore.addDay(currentTripId);
        currentDayIndex.value = tripStore.selectedTrip.days.length - 1;
        currentView.value = 'dailyPlans';
    }
};

const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (tripStore.selectedTrip) {
                tripStore.updateTripField(tripStore.selectedTrip.id, 'cover', e.target.result);
            }
        };
        reader.readAsDataURL(file);
    } else {
        if (tripStore.selectedTrip) {
            tripStore.updateTripField(tripStore.selectedTrip.id, 'cover', '');
        }
    }
};

const saveTitle = () => {
    if (tripStore.selectedTrip && editableTrip.value.title !== tripStore.selectedTrip.title) {
        tripStore.updateTripField(tripStore.selectedTrip.id, 'title', editableTrip.value.title);
    }
    isTitleEditing.value = false;
};

const saveNotes = () => {
    if (tripStore.selectedTrip && editableTrip.value.notes !== tripStore.selectedTrip.notes) {
        tripStore.updateTripNotes(tripStore.selectedTrip.id, editableTrip.value.notes);
    }
};

watch(() => tripStore.selectedTrip, (newTrip) => {
    if (newTrip) {
        editableTrip.value.title = newTrip.title;
        editableTrip.value.notes = newTrip.notes;
        if (currentView.value !== 'dailyPlans' && currentDayIndex.value === null) {
            currentView.value = 'tripOverview';
        }
    } else {
        currentView.value = 'tripOverview';
        currentDayIndex.value = null;
    }
}, { immediate: true });

onMounted(() => {
    if (tripStore.selectedTripId) {
        tripStore.selectTrip(tripStore.selectedTripId);
    }
});
</script>

<style scoped>
.xl\:w-\[500px\] {
    width: min(33.33vw, 500px);
}
</style>