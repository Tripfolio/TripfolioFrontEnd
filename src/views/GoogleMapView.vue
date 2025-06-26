<template>
  <NaveBar class="absolute" />
  <Itinerary
    ref="itineraryRef"
    :trip-id="trip?.id"
    :selected-place="selectedPlace"
    :selected-date="selectedDate?.date"
    :default-image="defaultImage"
  />

  <div
    class="absolute top-2.5 left-1/2 -translate-x-1/2 z-[2] flex items-center gap-2.5 bg-gray-400/95 px-2 py-1 rounded-full"
  >
    <div class="relative w-fit">
      <select
        v-model="selectedCityName"
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
        v-model="searchQuery"
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
  <button
    class="absolute bottom-25 left-8 text-2xl w-12 h-12 rounded-full bg-gray-400/30 backdrop-blur-2xl"
    @click="showCards = !showCards"
  >
    📌
  </button>
  <transition name="slide-fade">
    <div
      v-show="showCards && placeDetails.length"
      class="absolute bottom-2 left-1/2 -translate-x-1/2 z-[3] w-[70%] max-w-screen-xl"
    >
      <div class="card-container-style relative rounded-2xl px-15 py-4">
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
            class="w-[70vw] sm:w-[250px] flex-shrink-0 bg- rounded-xl shadow p-3 hover:shadow-md transition duration-200 cursor-pointer snap-start card-style"
          >
            <img
              :src="
                place.photos?.[0]?.getUrl({ maxWidth: 800 }) || defaultImage
              "
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
    </div>
  </transition>
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
      @click="locateUser"
      class="block w-full text-left bg-gray-500/80 hover:bg-gray-400 text-white px-4 py-2 rounded-full cursor-pointer shadow-inner"
    >
      ⚙︎
    </button>
    <button
      v-for="item in categories"
      :key="item.type"
      @click="searchByCategory(item.type)"
      class="block w-full text-left px-3 py-2 rounded hover:bg-blue-100"
    >
      {{ item.label }}
    </button>

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
  </aside>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed, toRefs } from "vue";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Itinerary from "../components/Itinerary.vue";
import { useRoute, useRouter } from "vue-router";
import { cities } from "../constants/city";
import { rawCategories, rawPlaceCategories } from "../constants/category";
import { useCategoryMenu } from "../composable/useCategoryMenu";
import { useMapSearch, SearchType } from "../composable/useMapSearch";
import NavBar from "../components/NavBar.vue";

const emit = defineEmits(["call-itinerary", "place-added"]);

const props = defineProps({
  trip: Object,
  currentDayIndex: Number,
  dailyPlanRef: Object,
  scheduleDetailRef: Object,
});

const { trip, currentDayIndex } = toRefs(props);

const selectedDate = computed(() => {
  return trip.value?.days?.[currentDayIndex.value] || null;
});

const route = useRoute();
const router = useRouter();
const isLocated = ref(false);

const itineraryRef = ref(null);

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
const selectedCityName = ref(route.query.city || "none");

const selectedMarkers = [];
const showCards = ref(true);

let markers = [];
let service = null;
let directionsService;
let directionsRenderer;
let markerCluster = null;
let performSearch = () => {};
let mapClickListener = null;

const travelMode = ref("DRIVING");
const result = ref(null);
const maxCategoryCount = 5;
const cardContainer = ref(null);

//css
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

//import
function callItinerary() {
  const date = selectedDate.value?.date;
  const place = selectedPlace.value;

  if (!place || !date) {
    alert("請選擇地點與日期");
    return;
  }

  const success = itineraryRef.value?.addPlace(place, date);

  if (success) {
    emit("place-added", { place, date });

    if (props.scheduleDetailRef?.refreshDailyPlan) {
      props.scheduleDetailRef.refreshDailyPlan();
    }

    alert("成功加入行程！");
  }
}


const {
  categories,
  placeCategories,
  showCustomCategory,
  menuRef,
  addCategory,
  removeCategory,
  handleClickOutside,
} = useCategoryMenu(rawCategories, rawPlaceCategories, maxCategoryCount);

//function
function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function searchByCategory(type) {
  if (!map.value || !type) return;
  const center = map.value.getCenter();
  searchQuery.value = type;

  performSearch({
    type: SearchType.TEXT,
    query: type,
    location: center,
  });
}

function initMap() {
  map.value = new google.maps.Map(mapRef.value, {
    center: { lat: 25.033964, lng: 121.564472 },
    zoom: 18,
    mapTypeControl: false,
    mapTypeControlOptions: null,
    zoomControl: false,
    cameraControl: false,
    scaleControl: false,
    fullscreenControl: false,
    errorControl: false,
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
  router.replace({
    query: {},
  });
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

  performSearch({
    type: SearchType.CITY_DEFAULT,
    cityName,
    location: center,
  });
}

function handleResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK || !results.length) {
    alert("找不到地點！");
    return;
  }

  if (results[0]?.geometry?.location) {
    map.value.setCenter(results[0].geometry.location);
    map.value.setZoom(15);
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

function locateUser() {
  if (!map.value) {
    alert("地圖尚未初始化完成，請稍後再試。");
    return;
  }

  if (!navigator.geolocation) {
    alert("你的瀏覽器不支援地理定位功能。");
    return;
  }
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
      if (searchQuery.value) {
        performSearch({
          type: SearchType.TEXT,
          query: searchQuery.value,
          location: userLocation,
        });
      }
    },
    (error) => {
      isLocated.value = true;
      alert("無法取得你的定位資訊", error);
    }
  );
}

function getPlaceIconUrl(types) {
  for (const type of types) {
    return `src/assets/icons/mapIcons/${type}.svg`;
  }
  return "src/assets/icons/mapIcons/default.svg";
}

watch(
  () => route.query.city,
  (newCity) => {
    selectedCityName.value = newCity || "none";
  }
);

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
      performSearch({
        type: SearchType.TEXT,
        query: queryText,
        location: map.value.getCenter(),
      });
    }
  }
);

onMounted(async () => {
  try {
    await loadGoogleMaps();
    initMap();

    if (!mapRef.value) {
      return;
    }
    map.value = new google.maps.Map(mapRef.value, {
      center: { lat: 25.038, lng: 121.5645 },
      zoom: 12,
      mapTypeControl: false,
      mapTypeControlOptions: null,
      zoomControl: false,
      cameraControl: false,
      scaleControl: false,
      fullscreenControl: false,
      errorControl: false,
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
    });

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
    searchQuery.value = route.query.searchQuery || "";
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

