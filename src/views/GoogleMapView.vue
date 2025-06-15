<template>
  <Itinerary
    ref="itineraryRef"
    :selectedPlace="selectedPlace"
    :default-image="defaultImage"
  />

  <div
    class="absolute top-2.5 left-1/2 -translate-x-1/2 z-[2] flex items-center gap-2.5 bg-gray-400/95 px-2 py-1 rounded-full"
  >
    <div class="relative w-fit">
      <select
        :value="route.query.city || 'none'"
        @change="onCityChange($event)"
        class="appearance-none bg-gray-500/80 text-white text-sm py-2 pl-4 pr-10 rounded-full focus:outline-none hover:bg-gray-400 transition duration-200 cursor-pointer shadow-inner"
      >
        <option value="none">當前</option>
        <option v-for="city in cities" :key="city.name" :value="city.name">
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
    <div class="relative w-[300px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="text"
        :value="route.query.searchQuery || ''"
        @input="onSearchInput"
        placeholder="輸入地點"
        class="w-full rounded-full border-none text-white px-7 py-1.5 box-border text-base placeholder-white focus:outline-none"
        ref="searchInput"
        @keyup.enter="searchPlace"
      />
      <button
        @click.prevent="searchPlace"
        class="absolute right-0.5 top-1/2 -translate-y-1/2 bg-white px-2.5 py-1.5 rounded-full border-none cursor-pointer text-xs text-gray-800"
      >
        搜尋
      </button>
    </div>
  </div>

  <div ref="mapRef" class="w-screen h-screen m-0 p-0"></div>

  <!-- <div
    v-if="placeDetails.length"
    class="absolute bottom-2 left-1/2 -translate-x-1/2 z-[3] w-[92%] max-w-screen-xl"
  >
    <div
      class="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl px-6 py-4"
    >
      <button
        @click="scrollLeft"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow px-3 py-2 rounded-full"
      >
        ‹
      </button>

      <div
        ref="cardContainer"
        class="flex gap-4 overflow-x-auto scroll-smooth px-4 pr-6 scrollbar-hidden snap-x snap-mandatory"
      >
        <div
          v-for="(place, index) in placeDetails"
          :key="index"
          @click="selectedPlace = place"
          class="w-[70vw] sm:w-[250px] flex-shrink-0 bg-white rounded-xl shadow p-3 hover:shadow-md transition duration-200 cursor-pointer snap-start"
        >
          <img
            :src="place.photos?.[0]?.getUrl({ maxWidth: 800 }) || defaultImage"
            @error="(e) => (e.target.src = defaultImage)"
            alt="地點圖片"
            class="w-full aspect-[3/2] object-cover rounded-md mb-2"
          />
          <h2 class="text-sm font-semibold truncate" :title="place.name">
            {{ place.name }}
          </h2>
          <p
            v-if="place.rating"
            class="text-xs text-yellow-600 mt-1 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            ⭐ {{ place.rating }} / {{ place.user_ratings_total }} 則評價
          </p>
        </div>
        <div v-if="hasMoreResults" class="flex items-center justify-center">
          <button
            class="bg-gray-400 text-white py-2 px-4 rounded-full text-sm hover:bg-gray-700 whitespace-nowrap"
            @click="loadNextPage"
          >
            更多
          </button>
        </div>
      </div>

      <button
        @click="scrollRight"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow px-3 py-2 rounded-full"
      >
        ›
      </button>
    </div>
  </div> -->

  <!--地點詳細資訊 -->
  <div
    v-if="selectedPlace"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-[4]"
    @click.self="selectedPlace = null"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md relative">
      <h2 class="text-2xl font-bold mb-3">{{ selectedPlace.name }}</h2>
      <p class="text-gray-600 text-sm mb-3">
        {{ selectedPlace.formatted_address }}
      </p>
      <p v-if="selectedPlace.rating" class="text-yellow-600 mb-3">
        ⭐ {{ selectedPlace.rating }}（共
        {{ selectedPlace.user_ratings_total }} 則評價）
      </p>
      <div class="relative w-full aspect-[4/3]">
        <button
          v-if="selectedPlace.photos && selectedPlace.photos.length > 1"
          @click.stop="
            selectedPlacePhotoIndex =
              (selectedPlacePhotoIndex - 1 + selectedPlace.photos.length) %
              selectedPlace.photos.length
          "
          class="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
          aria-label="上一張圖片"
        >
          ‹
        </button>
        <!-- 圖片 -->
        <img
          :src="
            selectedPlace.photos && selectedPlace.photos.length
              ? selectedPlace.photos[selectedPlacePhotoIndex].getUrl({
                  maxWidth: 800,
                })
              : defaultImage
          "
          @error="(e) => (e.target.src = defaultImage)"
          alt="地點圖片"
          class="max-w-full aspect-[4/3] object-cover rounded-lg mt-2.5"
        />
        <button
          v-if="selectedPlace.photos && selectedPlace.photos.length > 1"
          @click.stop="
            selectedPlacePhotoIndex =
              (selectedPlacePhotoIndex + 1) % selectedPlace.photos.length
          "
          class="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
          aria-label="下一張圖片"
        >
          ›
        </button>
      </div>
      <button @click="callItinerary">🤍 加入行程</button>
    </div>
  </div>

  <aside
    class="w-20 p-4 space-y-2 bg-gray-400/30 fixed z-50 left-5 top-1/2 translate-y-[-50%] rounded-full shadow-4xl backdrop-blur-2xl"
    ref="menuRef"
  >
    <button
      v-for="item in categories"
      :key="item.type"
      @click="searchByCategory(item.type)"
      class="block w-full text-left px-3 py-2 rounded hover:bg-blue-100"
    >
      {{ item.label }}
    </button>
    <!-- 🔽 新增自訂分類選單 -->
    <div class="relative">
      <button
        @click="showCustomCategory = !showCustomCategory"
        class="block w-full text-left px-3 py-2 rounded hover:bg-green-100 text-green-700 font-semibold left-3.5"
      >
        ➕
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
    <!-- 🔽 新增自訂分類選單 -->
  </aside>

  <div
    class="absolute bottom-10 left-5 bg-white/90 px-3 py-2 rounded-md shadow-md flex gap-2.5 items-center z-[1]"
  >
    <div v-if="result">
      <p>兩點距離：{{ result.distance }}，預估時間：{{ result.duration }}</p>
    </div>
    <label class="flex items-center gap-2">
      <span>選擇交通方式：</span>
      <select
        v-model="travelMode"
        @change="recalculateRoute"
        class="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="DRIVING">🚗 開車</option>
        <option value="WALKING">🚶‍♀️ 步行</option>
        <option value="TRANSIT">🚇 大眾運輸</option>
      </select>
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMapSearch, SearchType } from "../composable/useMapSearch";
import Itinerary from "../components/Itinerary.vue";
import { loadGoogleMaps } from "../composable/loadGoogleMaps";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const selectedCity = ref(route.query.city || "none");
const isLocated = ref(false);

const itineraryRef = ref(null);
function callItinerary() {
  if (itineraryRef.value && typeof itineraryRef.value.addPlace === "function") {
    itineraryRef.value.addPlace();
  } else {
    alert("itineraryRef 尚未掛載，無法呼叫 addPlace");
  }
}

const mapRef = ref(null);
const searchQuery = ref("");
const searchInput = ref(null);
const map = ref(null);

const placeDetails = ref([]);
const nextPageFunc = ref(null);
const hasMoreResults = ref(false);
const defaultImage = "https://picsum.photos/1000?image";

const selectedPlace = ref(null);
const selectedPlacePhotoIndex = ref(0);
const selectedCityName = ref("none"); // 預設為「當前」

const selectedMarkers = [];

let markers = [];
let service = null;
let directionsService; // 路線服務
let directionsRenderer; // 路線顯示器
let markerCluster = null; //marker的集合

const cities = [
  { name: "台北市", lat: 25.033964, lng: 121.564472 },
  { name: "新北市", lat: 25.016982, lng: 121.462786 },
  { name: "基隆市", lat: 25.131122, lng: 121.739622 },
  { name: "桃園市", lat: 24.993628, lng: 121.300979 },
  { name: "新竹市", lat: 24.80395, lng: 120.964675 },
  { name: "新竹縣", lat: 24.838722, lng: 121.002295 },
  { name: "苗栗縣", lat: 24.560159, lng: 120.821426 },
  { name: "台中市", lat: 24.147736, lng: 120.673648 },
  { name: "彰化縣", lat: 24.068523, lng: 120.562447 },
  { name: "南投縣", lat: 23.958842, lng: 120.971863 },
  { name: "雲林縣", lat: 23.709203, lng: 120.542994 },
  { name: "嘉義市", lat: 23.480075, lng: 120.449111 },
  { name: "嘉義縣", lat: 23.451842, lng: 120.255461 },
  { name: "台南市", lat: 22.999728, lng: 120.227028 },
  { name: "高雄市", lat: 22.627278, lng: 120.301435 },
  { name: "屏東縣", lat: 22.551975, lng: 120.548759 },
  { name: "宜蘭縣", lat: 24.702107, lng: 121.73775 },
  { name: "花蓮縣", lat: 23.987158, lng: 121.601571 },
  { name: "台東縣", lat: 22.764364, lng: 121.113207 },
  { name: "澎湖縣", lat: 23.57104, lng: 119.579369 },
  { name: "金門縣", lat: 24.436679, lng: 118.317088 },
  { name: "連江縣", lat: 26.16058, lng: 119.950946 },
];

const travelMode = ref("DRIVING"); // 交通方式 (select dropdown)
const result = ref(null); // 路線結果（距離與時間）(calculateRoute)

//整個篩選區塊的容器，用來判斷點擊事件是不是發生在外部。
const menuRef = ref(null);

const showCustomCategory = ref(false); //是否顯示選單
const maxCategoryCount = 5; //側邊骰選選單的最大長度

const categories = ref([
  { type: "restaurant", label: "🍽️" },
  { type: "lodging", label: "🏨" },
  { type: "residence", label: "🏠" },
  { type: "tourist_attraction", label: "📍" },
  // { type: "other_options", label: "+" },
]);

//待添加種類
const placeCategories = ref([
  { type: "cafe", label: "咖啡廳" },
  { type: "museum", label: "博物館" },
  { type: "park", label: "公園" },
  { type: "zoo", label: "動物園" },
  { type: "amusement_park", label: "遊樂園" },
  { type: "aquarium", label: "水族館" },
  { type: "art_gallery", label: "藝廊" },
  { type: "bar", label: "酒吧" },
  { type: "book_store", label: "書店" },
  { type: "gym", label: "健身房" },
  { type: "shopping_mall", label: "購物中心" },
  { type: "supermarket", label: "超市" },
  { type: "night_club", label: "夜店" },
]);

const cardContainer = ref(null);

function scrollLeft() {
  if (cardContainer.value) {
    cardContainer.value.scrollBy({ left: -300, behavior: "smooth" });
  }
}

function scrollRight() {
  if (cardContainer.value) {
    cardContainer.value.scrollBy({ left: 300, behavior: "smooth" });
  }
}

watch(selectedPlace, (newVal) => {
  if (newVal) {
    selectedPlacePhotoIndex.value = 0;
  }
});

watch(
  () => route.query,
  (newQuery) => {
    if (!isLocated.value || !map.value) return;

    const queryText = newQuery.searchQuery;
    const queryCity = newQuery.city;

    if (!queryText) return;

    let center = null;

    if (queryCity && queryCity !== "none") {
      const city = cities.find((c) => c.name === queryCity);
      if (!city) return;

      center = new google.maps.LatLng(city.lat, city.lng);
      map.value.setCenter(center);
      map.value.setZoom(13);

      performSearch({
        type: SearchType.TEXT,
        query: queryText,
        cityName: queryCity,
        location: center,
      });
    } else {
      // 這裡改成 TEXT
      performSearch({
        type: SearchType.TEXT,
        query: queryText,
        location: map.value.getCenter(),
      });
    }
  }
  // 不要 immediate: true
);

function searchByCategory(type) {
  if (!map.value || !type) return;
  const center = map.value.getCenter();
  searchQuery.value = "";

  // 這裡也改成 TEXT
  performSearch({
    type: SearchType.TEXT,
    query: type,
    location: center,
  });
}


function onSearchInput(e) {
  router.replace({
    query: {
      ...route.query,
      searchQuery: e.target.value,
    },
  });
}
function initMap() {
  map.value = new google.maps.Map(mapRef.value, {
    center: { lat: 25.033964, lng: 121.564472 },
    zoom: 18,
    mapTypeControl: false,
    zoomControl: true,
    cameraControl: false,
    scaleControl: false,
    fullscreenControl: false,
    errorControl: true,
    streetViewControl: false,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP,
    },
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit.station",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });
  service = new google.maps.places.PlacesService(map.value);
}

function clearMap() {
  selectedMarkers.forEach((m) => m.setMap(null));
  selectedMarkers.length = 0;
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  placeDetails.value = [];
  nextPageFunc.value = null;
  hasMoreResults.value = false;
  selectedPlace.value = null;
}

function searchPlace() {
  if (!searchQuery.value || !map.value) return;

  if (selectedCityName.value !== "none") {
    const center = map.value.getCenter();
    performSearch({
      type: SearchType.TEXT,
      query: searchQuery.value,
      cityName: selectedCityName.value,
      location: center,
    });
  } else {
    performSearch({
      type: SearchType.TEXT,
      query: searchQuery.value,
      location: map.value.getCenter(),
    });
  }
}

function moveToCity(event) {
  const cityName = event.target.value;
  selectedCityName.value = cityName;
  searchQuery.value = "";

  if (cityName === "none") {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const center = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        map.value.setCenter(center);
        map.value.setZoom(15);
        performSearch({
          type: SearchType.NEARBY_TYPE,
          query: "tourist_attraction",
          location: center,
        });
      },
      () => {
        console.log("無法取得你的定位！");
      }
    );
  }

  const city = cities.find((c) => c.name === cityName);
  if (!city || !map.value) return;

  const center = new google.maps.LatLng(city.lat, city.lng);
  map.value.setCenter(center);
  map.value.setZoom(13);

  performSearch({ type: SearchType.CITY_DEFAULT, cityName, location: center });
}


function handleResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK || !results.length) {
    alert("找不到地點！");
    return;
  }

  if (results[0] && results[0].geometry && results[0].geometry.location) {
    map.value.setCenter(results[0].geometry.location);
  }

  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  if (markerCluster) {
    markerCluster.clearMarkers();
    markerCluster = null;
  }

  results.forEach((place) => {
    if (!place.geometry || !place.geometry.location) return;

    const iconUrl = getPlaceIconUrl(place.types);

    const marker = new google.maps.Marker({
      map: map.value,
      position: place.geometry.location,
      title: place.name,
      icon: {
        url: iconUrl,
      },
    });

    markers.push(marker);

    const detailRequest = {
      placeId: place.place_id,
      fields: [
        "name",
        "formatted_address",
        "geometry",
        // "types",
        "rating",
        "user_ratings_total",
        // "formatted_phone_number",
        // "international_phone_number",
        // "opening_hours",
        // "current_opening_hours",
        // "secondary_opening_hours",
        "photos",
        // "reviews",
        // "price_level",
        // "website",
        // "url", //開啟 Google 地圖
        // "vicinity", //附近描述（適用於搜尋 API，如 "near Taipei 101"）
        // "address_components",
        // "adr_address",
        // "postal_address",
        // "short_formatted_address",
        // "business_status",
        // "icon", // =icon_mask_base_uri + icon_background_color
        // 其他field欄位參考：https://developers.google.com/maps/documentation/places/web-service/legacy/details?hl=zh-tw#fields
      ],
    };

    service.getDetails(detailRequest, (detailResult, detailStatus) => {
      if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
        placeDetails.value.push(detailResult);

        marker.addListener("click", () => {
          selectedPlace.value = detailResult;
        });
      }
    });
  });

  markerCluster = new MarkerClusterer({
    map: map.value,
    markers: markers,
    renderer: {
      render({ count, position }) {
        return new google.maps.Marker({
          position,
          label: {
            text: String(count),
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          },
        });
      },
    },
  });

  if (pagination && pagination.hasNextPage) {
    nextPageFunc.value = () => pagination.nextPage();
    hasMoreResults.value = true;
  } else {
    hasMoreResults.value = false;
  }
}

function loadNextPage() {
  if (nextPageFunc.value) {
    nextPageFunc.value();
  }
}

function calculateRoute(origin, destination) {
  directionsService.route(
    {
      origin,
      destination,
      travelMode: travelMode.value,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);

        const leg = response.routes[0].legs[0];
        result.value = {
          distance: leg.distance.text,
          duration: leg.duration.text,
        };
      } else {
        alert("路線規劃失敗：" + status);
      }
    }
  );
}

function recalculateRoute() {
  if (markers.length === 2) {
    calculateRoute(markers[0].getPosition(), markers[1].getPosition());
  }
}

function onCityChange(event) {
  searchQuery.value = "";
  moveToCity(event);
}

function locateUser(map) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      new google.maps.Marker({
        position: userLocation,
        map: map.value,
        title: "你的位置",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 15,
          fillColor: "#4285F4",
          fillOpacity: 0.9,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      map.value.setCenter(userLocation);
      map.value.setZoom(15);
      isLocated.value = true;
    },
    (error) => {
      isLocated.value = true;
      alert("無法取得你的定位資訊", error);
    }
  );
}

function addCategory(item) {
  const exists = categories.value.some((cat) => cat.type === item.type);
  if (exists) return;
  if (categories.value.length >= maxCategoryCount) {
    alert("已達上限，最多只能選擇 5 種類別");
    return;
  }

  categories.value.push(item);
  placeCategories.value = placeCategories.value.filter(
    (cat) => cat.type !== item.type
  );
}

function removeCategory(item) {
  categories.value = categories.value.filter((cat) => cat.type !== item.type);

  const exists = placeCategories.value.some((cat) => cat.type === item.type);
  if (!exists) {
    placeCategories.value.push(item);
  }
}

function handleClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showCustomCategory.value = false;
  }
}

function getPlaceIconUrl(types) {
  // 只要類別與檔名一致，直接組合路徑
  for (const type of types) {
    // 你可以用 fetch 或其他方式檢查檔案是否存在
    return `src/assets/icons/mapIcons/${type}.svg`;
  }
  return "src/assets/icons/mapIcons/default.svg";
}

let performSearch = () => {};
let mapClickListener = null;

onMounted(async () => {
  try {
    await loadGoogleMaps();
    initMap();
    await locateUser(map);

    // 初始化方向服務
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
    directionsRenderer.setMap(map.value);

    service = new google.maps.places.PlacesService(map.value);
    performSearch = useMapSearch({
      map: map.value,
      service,
      clearMap,
      handleResults,
    }).performSearch;

    const queryText = route.query.searchQuery;
    const queryCity = route.query.city;

    if (queryText && queryCity && queryCity !== "none") {
  const city = cities.find((c) => c.name === queryCity);
  if (city) {
    const center = new google.maps.LatLng(city.lat, city.lng);
    map.value.setCenter(center);
    map.value.setZoom(13);
    performSearch({
      type: SearchType.TEXT,
      query: queryText,
      cityName: queryCity,
      location: center,
    });
  }
} else if (queryText) {
  performSearch({
    type: SearchType.TEXT,
    query: queryText,
    location: map.value.getCenter(),
  });
}
    map.value.addListener("click", (event) => {
      markers.forEach((marker) => marker.setMap(null));
      markers = [];
      placeDetails.value = [];
      nextPageFunc.value = null;
      hasMoreResults.value = false;

      if (event.placeId) {
        event.stop();
        const placeId = event.placeId;
        const detailRequest = {
          placeId,
          fields: [
            "name",
            "formatted_address",
            "geometry",
            "rating",
            "user_ratings_total",
            "photos",
            "business_status",
            "icon",
          ],
        };

        service.getDetails(detailRequest, (detailResult, detailStatus) => {
          if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
            // 第三個點時，重置
            if (selectedMarkers.length === 2) {
              selectedMarkers.forEach((m) => m.setMap(null));
              selectedMarkers.length = 0;
              selectedPlace.value = null;
              if (directionsRenderer)
                directionsRenderer.setDirections({ routes: [] });
            }

            const marker = new google.maps.Marker({
              position: detailResult.geometry.location,
              map: map.value,
              title: detailResult.name,
            });
            selectedMarkers.push(marker);

            if (selectedMarkers.length === 1) {
              selectedPlace.value = detailResult;
            } else if (selectedMarkers.length === 2) {
              selectedPlace.value = null;
              calculateRoute(
                selectedMarkers[0].getPosition(),
                selectedMarkers[1].getPosition()
              );
            }
          } else {
            alert("取得詳細資料失敗", detailStatus);
          }
        });
      } else {
        alert("點擊了非place地點");
      }
    });

    mapClickListener = google.maps.event.addListener(
      map.value,
      "click",
      handleClickOutside
    );
  } catch (err) {
    alert("Google Maps 載入失敗");
  }
});

onUnmounted(() => {
  google.maps.event.removeListener(mapClickListener);
});
</script>

<style scoped>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
