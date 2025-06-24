<template>
  <div class="min-h-screen homepage-bg">
    <div class="min-h-screen px-4 py-6">
      <div class="w-[80vw] mx-auto">
        <!-- <header
          class="flex items-center bg-gray-300 rounded-full px-6 py-2 shadow-md"
        >
          <div class="flex-none font-bold">logo</div>

          <nav
            class="flex-1 flex justify-center space-x-6 items-center text-gray-700"
          >
            <button class="flex items-center space-x-1">
              <RouterLink to="/map" class="underline">探索</RouterLink>
            </button>
            <button class="flex items-center space-x-1">
              <span>社群</span>
            </button>
            <button class="flex items-center space-x-1">
              <span>關於我們</span>
            </button>
          </nav>
          <div class="flex-none text-gray-700">
            <RouterLink to="/signup" class="underline">註冊</RouterLink>
            |
            <RouterLink to="/login" class="underline">登入</RouterLink>
          </div>
        </header> -->

        <section
          class="mt-10 bg-gray-300 rounded-[3rem] h-[300px] md:h-[400px] shadow-inner"
        >
          <section class="mt-10 p-6">
            <p class="mb-2">其他連結 我先放這</p>
            <div class="flex flex-wrap gap-4">
              <RouterLink to="/emailSettings" class="underline"
                >Email 通知</RouterLink
              >
              <RouterLink to="/profile" class="underline"
                >會員資料修改</RouterLink
              >
              <RouterLink to="/calendar" class="underline"
                >連結 Google Calendar</RouterLink
              >
              <RouterLink to="/schedule" class="underline">個人行程</RouterLink>
              <RouterLink to="/community">社群貼文</RouterLink>
              <RouterLink to="/trips">行程建立</RouterLink>
            </div>
          </section>
        </section>
      </div>
      <div class="w-[60vw] mx-auto -mt-16 z-10">
        <section class="bg-gray-800 text-white rounded-4xl py-3 px-6 shadow-md">
          <div
            class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4"
          >
            <div class="relative w-fit">
              <select
                :value="route.query.city || 'none'"
                @change="onCityChange($event)"
                class="appearance-none bg-gray-500/80 text-white text-sm py-2 pl-4 pr-10 rounded-full focus:outline-none hover:bg-gray-400 transition duration-200 cursor-pointer shadow-inner"
              >
                <option value="none">當前</option>
                <option
                  v-for="city in cities"
                  :key="city.name"
                  :value="city.name"
                >
                  {{ city.name }}
                </option>
              </select>
              <svg
                class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div class="relative w-full bg-gray-600 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="輸入地點"
                class="w-full rounded-full border-none text-white px-9 py-1.5 box-border text-base placeholder-white focus:outline-none"
                ref="searchInput"
                @keyup.enter="searchPlace"
              />
              <button
                @click.prevent="searchPlace"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 px-2.5 py-1.5 rounded-full border-none cursor-pointer text-xs text-white"
              >
                搜尋
              </button>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="item in categories"
              :key="item.type"
              @click="searchByCategory(item.type)"
              class="bg-gray-700 px-3 py-1 rounded-full flex items-center space-x-1 hover:bg-blue-100"
            >
              {{ item.label }}
            </button>
            <div class="relative" ref="menuRef">
              <button
                @click="showCustomCategory = !showCustomCategory"
                class="block w-full text-left px-3 py-2 rounded hover:bg-green-100 text-green-700 font-semibold left-3.5"
              >
                + others
              </button>
              <div
                v-if="showCustomCategory"
                class="absolute z-10 bg-gray-400/90 rounded-4xl p-3 w-80 shadow-md bottom-1 left-18 transform transition-all duration-300 ease-in-out translate-x-0 opacity-100"
              >
                <button
                  @click="removeCategory(item)"
                  v-for="item in categories"
                  :key="item.type"
                  class="m-4"
                >
                  {{ item.label }} ❌
                </button>
                <hr />
                <button
                  @click="addCategory(item)"
                  v-for="item in placeCategories"
                  :key="item.type"
                  class="m-4 cursor-pointer"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div v-if="placeDetails.length" class="w-full mx-auto">
      <div class="backdrop-blur-lg rounded-2xl shadow-xl px-6 py-4 space-y-3">
        <div
          v-for="(place, index) in placeDetails"
          :key="index"
          @click="selectedPlace = place"
          class="p-3 rounded-xl bg-white shadow hover:shadow-md transition duration-200 cursor-pointer"
        >
          <h2
            class="text-base font-semibold text-gray-800 truncate"
            :title="place.name"
          >
            {{ place.name }}
          </h2>
          <p v-if="place.rating" class="text-sm text-yellow-600 mt-1">
            ⭐ {{ place.rating }} / {{ place.user_ratings_total }} 則評價
          </p>
          <p
            v-if="place.formatted_address"
            class="text-sm text-gray-500 mt-1 truncate"
          >
            📍 {{ place.formatted_address }}
          </p>
        </div>
        <div v-if="hasMoreResults" class="flex justify-center pt-4">
          <button
            class="bg-gray-500 text-white py-2 px-6 rounded-full text-sm hover:bg-gray-700"
            @click="loadNextPage"
          >
            載入更多
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { cities } from "../constants/city";
import { rawCategories, rawPlaceCategories } from "../constants/category";
import { useCategoryMenu } from "../composable/useCategoryMenu";

const {
  categories,
  placeCategories,
  showCustomCategory,
  menuRef,
  addCategory,
  removeCategory,
  handleClickOutside,
} = useCategoryMenu(rawCategories, rawPlaceCategories, maxCategoryCount);

const route = useRoute();
const router = useRouter();

const searchQuery = ref("");
const searchInput = ref(null);
const placeDetails = ref([]);
const hasMoreResults = ref(false);
const selectedPlace = ref(null);
const selectedCityName = ref("none");
const maxCategoryCount = 5;

function searchPlace() {
  if (!searchQuery.value) return;
  router.push({
    path: "/map",
    query: {
      searchQuery: searchQuery.value,
    },
  });
}

function searchByCategory(type) {
  if (!type) return;

  searchQuery.value = "";

  router.push({
    path: "/map",
    query: {
      searchQuery: type,
      city: selectedCityName.value || "none",
    },
  });
}

function onCityChange(event) {
  const cityName = event.target.value;
  selectedCityName.value = cityName;

  router.push({
    path: "/map",
    query: {
      searchQuery: searchQuery.value || "tourist_attraction",
      city: cityName || "none",
      t: Date.now(),
    },
  });
}

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.homepage-bg {
  background-image:
    radial-gradient(#999 1px, transparent 1px),
    linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size:
    40px 40px,
    40px 40px,
    40px 40px;
  background-position:
    20px 20px,
    0px 0px,
    0px 0px;
  background-color: white;
}
</style>
