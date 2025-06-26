<template>
  <div class="homepage-bg overflow-x-hidden">

    <section class="min-h-screen  flex justify-center">
      <transition name="fade-landing">
        <div class="landing fixed inset-0 bg-white text-gray-400 flex justify-center items-center" v-if="show">
          <div class="loading text-5xl tracking-[0.4em] whitespace-no-wrap" >
            <span style="--i: 0">T</span>
            <span style="--i: 1">R</span>
            <span style="--i: 2">I</span>
            <span style="--i: 3">P</span>
            <span style="--i: 4">F</span>
            <span style="--i: 5">O</span>
            <span style="--i: 6">L</span>
            <span style="--i: 7">I</span>
            <span style="--i: 8;; margin-right: -0.4em;">O</span>
          </div>
        </div>
      </transition>
      <div class="px-4 py-6 ">
        <div class="w-[80vw] mx-auto">
          <header
            class="flex custom-frosted items-center rounded-[32px] px-6 py-2"
          >
            <!-- 左 -->
            <div class="flex-none font-bold">logo</div>
            <!-- 中 -->
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
            <!-- 右 -->
            <div class="flex-none text-gray-700">
              <RouterLink to="/signup" class="underline">註冊</RouterLink>
              |
              <RouterLink to="/login" class="underline">登入</RouterLink>
            </div>
          </header>
        </div>
        <div class="w-[100vw]">
          <HomeCarousel/>
          <div class="w-[60vw] mx-auto -mt-6 z-10 relative">
            <section class="bg-gray-800/30  custom-frosted backdrop-blur-[30px] text-white rounded-4xl py-3 px-6 shadow-md">
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
      </div>
      <!-- <div v-if="placeDetails.length" class="w-full mx-auto">
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
      </div> -->
    </section>

    <section class="min-h-[500px] flex relative ">
      <h2 class="text-4xl font-bold text-lef ml-40 mt-30" data-aos="fade-up" data-aos-duration="1000">
        <p class="text-5xl tracking-[15px]">TRIPFOLIO</p>
        <p class="ml-30 mt-5 text-3xl font-medium tracking-wider"> Where your journey begins</p>
      </h2>

      <div class="relative mt-6 h-4">
        <div data-aos="fade-up" class="absolute right-60 top-80 w-32 min-h-10 bg-black rounded-full flex items-center justify-center">
          <p class="text-white">hsjdhfhdfkajhd</p>
        </div>
        <div data-aos="fade-up" data-aos-delay="300" class="absolute right-60 top-100 w-32 min-h-10 bg-black rounded-full flex items-center justify-center">
          <p class="text-white">hsjdhfhdfkajhd</p>
        </div>
      </div>

      <div class="relative ml-auto mr-50">
        <img :src="taiwan"  ref="mapImg" alt="台灣地圖" class="w-auto max-w-[500px] h-auto  " data-aos="fade-up" data-aos-duration="1000" />
        <img :src="marker1" v-show="showMarker1" alt="marker" class="absolute z-50 top-[18%] left-[40%] w-16 h-16 fade-in-down will-change: transform" />
        <img :src="marker2" v-show="showMarker2" alt="marker" class="absolute z-50 top-[30%] left-[60%] w-16 h-16 fade-in-down will-change: transform" />
        <img :src="marker3" v-show="showMarker3" alt="marker" class="absolute z-50 top-[50%] left-[30%] w-16 h-16 fade-in-down will-change: transform" />
      </div>
    </section>
    
    <section class="min-h-[600px] px-6 py-16">
      <!-- 標題區 -->
      <h2 class="text-4xl font-bold text-center mb-20 mt-10" data-aos="fade-up" data-aos-duration="1000" data-aos-anchor-placement="top-center">
        讓分享，成為彼此的路標
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- 卡片 1 -->
        <div class="rounded-3xl bg-white shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="700">
          <div class="relative h-[300px] bg-gray-300">
            <img :src="s1" alt="行程圖" class="w-full h-full object-cover " loading="lazy"/>
            <div class="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded-full flex items-center space-x-2">
              <img :src="s2" alt="avatar" class="w-5 h-5 rounded-full object-cover ml-0.5 mr-2" />
              <p class="mr-2">Kris</p>
            </div>
          </div>
          <div class="p-4 flex justify-between items-center">
            <p class="text-sm font-medium">慢遊台灣五日行</p>
            <button class="text-xl">♡</button>
          </div>
        </div>

        <!-- 卡片 2 -->
        <div class="rounded-3xl bg-white shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="1000">
          <div class="relative h-[300px] bg-gray-300">
            <img :src="s2" alt="行程圖" class="w-full h-full object-cover" loading="lazy"/>
            <div class="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded-full flex items-center space-x-2">
              <img :src="p1" alt="avatar" class="w-5 h-5 rounded-full object-cover ml-0.5 mr-2" />
              <p class="mr-2">May</p>
            </div>
          </div>
          <div class="p-4 flex justify-between items-center">
            <p class="text-sm font-medium">一步一景，小島旅行中</p>
            <button class="text-xl">♡</button>
          </div>
        </div>

        <!-- 卡片 3 -->
        <div class="rounded-3xl bg-white shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="1300">
          <div class="relative h-[300px] bg-gray-300">
            <img :src="s3" alt="行程圖" class="w-full h-full object-cover" loading="lazy" />
            <div class="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded-full flex items-center space-x-2">
              <img :src="p2" alt="avatar" class="w-5 h-5 rounded-full object-cover ml-0.5 mr-2" />
              <p class="mr-2">Kiwi</p>
            </div>
          </div>
          <div class="p-4 flex justify-between items-center">
            <p class="text-sm font-medium">台北三天兩夜攻略</p>
            <button class="text-xl">♡</button>
          </div>
        </div>
      </div>

      <div class="w-full flex justify-center z-50 ">
        <button
          @click="scrollToTop"
          class="bg-black text-white pl-10 pr-10 pt-5 pb-5 rounded-full shadow-lg hover:bg-gray-400 transition-all duration-300 mt-35 mb-15 cursor-pointer"
        >
          Start Exploring With TRIPFOLIO 
        </button>
      </div>
    </section>

    <!-- <section class="min-h-screen" data-aos="fade-up">社群</section> -->

  </div>
</template>
//記得把email routes拿回來

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { cities } from "../constants/city";
import { rawCategories, rawPlaceCategories } from "../constants/category";
import { useCategoryMenu } from "../composable/useCategoryMenu";
import AOS from 'aos'
import 'aos/dist/aos.css'
import HomeCarousel from '../components/HomeCarousel.vue';
import taiwan from '../assets/HomePage/taiwan.png';
import marker1 from '../assets/icons/mapIcons/amusement_park.svg';
import marker2 from '../assets/icons/mapIcons/restaurant.svg';
import marker3 from '../assets/icons/mapIcons/cafe.svg';
import s1 from '../assets/HomePage/s1.png';
import s2 from '../assets/HomePage/s2.png';
import s3 from '../assets/HomePage/s3.png';
import p1 from '../assets/HomePage/p1.png';
import p2 from '../assets/HomePage/p2.png';

const show = ref(true)
const showMarker1 = ref(false)
const showMarker2 = ref(false)
const showMarker3 = ref(false)

const mapImg = ref(null)

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
// const placeDetails = ref([]);
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

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);

  setTimeout(() => {
    show.value = false  
  }, 5000);

  AOS.init({ once: false, duration: 1000,});

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          showMarker1.value = true
        }, 1000)
        setTimeout(() => {
          showMarker2.value = true
        }, 1500)
        setTimeout(() => {
          showMarker3.value = true
        }, 2000)
      } else {
        showMarker1.value = false
        showMarker2.value = false
        showMarker3.value = false
      }
    },
    {
      threshold: 0.4,
    }
  )
  if (mapImg.value) {
    observer.observe(mapImg.value)
  }
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


.fade-landing-enter-active,
.fade-landing-leave-active {
  transition: opacity 0.5s;
}
.fade-landing-enter-from,
.fade-landing-leave-to {
  opacity: 0;
}
.fade-landing-enter-to,
.fade-landing-leave-from {
  opacity: 1;
}

.landing {
  animation: fadeout 3s forwards;
  z-index: 9999;
}

.loading span {
  animation: blur 1.5s calc(var(--i) / 5 * 1s) alternate;
}

.fade-in-down {
  animation: fadeInDown 0.6s ease-out forwards;
}

.custom-frosted {
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
  opacity: 0.8;
  backdrop-filter: blur(100px);
}

@keyframes fadeout {
  0% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes blur {
  to {
    filter: blur(0px);
  }
  from {
    filter: blur(5px);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
