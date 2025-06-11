<template>

  <Itinerary
    ref="itineraryRef"
    :selectedPlace="selectedPlace"
    class="z-[4]"
    :default-image="defaultImage"
  />

  <div
    class="absolute top-2.5 left-1/2 -translate-x-1/2 z-[2] flex items-center gap-2.5 bg-gray-400/90 px-2.5 py-2.5 rounded-full"
  >
    <div class="relative w-[300px]">
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
        class="w-full rounded-full border-none text-white bg-gray-600/70 px-10 py-2.5 box-border text-base placeholder-white"
        ref="searchInput"
        @keyup.enter="searchPlace"
      />
      <button
        @click.prevent="searchPlace"
        class="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gray-400 px-2.5 py-1.5 rounded-full border-none cursor-pointer text-xs text-white"
      >
        搜尋
      </button>
    </div>

    <!-- Toggle switch -->
    <label class="relative inline-block w-20 h-8.5">
      <input type="checkbox" v-model="isToggled" class="opacity-0 w-0 h-0" />
      <span
        class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition duration-300 rounded-full"
      >
        <span
          class="absolute h-6 w-10 left-1.5 bottom-1.5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black transition duration-300"
          :class="{ 'translate-x-7': isToggled }"
          :style="{ content: isToggled ? `'卡片'` : `'地圖'` }"
        >
          {{ isToggled ? "卡片" : "地圖" }}
        </span>
      </span>
    </label>
  </div>

  <div v-show="!isToggled" ref="mapRef" class="w-screen h-screen m-0 p-0"></div>

  <div
    v-show="isToggled"
    v-if="placeDetails.length"
    class="absolute top-20 left-50 z-[3] bg-white p-2.5 box-border grid w-60% grid-cols-[repeat(auto-fill,minmax(250px,max-content))] justify-start gap-2.5 overflow-y-auto"
  >
    <div
      v-for="(place, index) in placeDetails"
      :key="index"
      @click="selectedPlace = place"
      class="bg-gray-300 rounded-lg p-3 shadow-sm min-w-0 max-w-full hover:bg-slate-400 cursor-pointer transition duration-300"
    >
      <h2
        :title="place.name"
        class="w-full text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis mb-2"
      >
        {{ place.name }}
      </h2>

      <img
        :src="
          place.photos && place.photos.length
            ? place.photos[0].getUrl({ maxWidth: 1000 })
            : defaultImage
        "
        @error="(e) => (e.target.src = defaultImage)"
        alt="地點圖片"
        class="max-w-full aspect-[4/3] object-cover rounded-lg mt-2.5"
      />
    </div>

    <div v-if="hasMoreResults" class="col-span-full text-center mt-2.5">
      <button
        class="bg-gray-500 text-white py-2.5 px-5 rounded-full cursor-pointer text-lg w-1/2 hover:bg-gray-800"
        @click="loadNextPage"
      >
        🔄 載入更多
      </button>
    </div>
  </div>

  <!--地點詳細資訊 -->
  <div
    v-if="selectedPlace"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-[4]"
    @click.self="selectedPlace = null"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md relative">
      <!-- <button
        class="absolute top-6 right-5 hover:cursor-pointer text-yellow-600 text-2xl"
        @click="selectedPlace = null"
      >
        ✖︎
      </button> -->
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

  <div class="controls">
    <div v-if="result">
      <p>兩點距離：{{ result.distance }}，預估時間：{{ result.duration }}</p>
    </div>
    <label
      >選擇交通方式：
      <select v-model="travelMode" @change="recalculateRoute">
        <option value="DRIVING">🚗 開車</option>
        <option value="WALKING">🚶‍♀️ 步行</option>
        <option value="TRANSIT">🚇 大眾運輸</option>
      </select>
    </label>
  </div>

  <!-- 選擇地區 -->
<div class="absolute top-4 left-4 bg-white p-3 rounded shadow z-10">
  <select @change="onCityChange($event)">
    <option value="none">當前</option>
    <option v-for="city in cities" :key="city.name" :value="city.name">
      {{ city.name }}
    </option>
  </select>
</div>

</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { MapIcons } from "@/assets/MapIcons";
import { MarkerClusterer } from "@googlemaps/markerclusterer"; //marker的集合
import Itinerary from "../components/Itinerary.vue";
  
// 子元件 Itinerary.vue
const itineraryRef = ref(null);
function callItinerary() {
  if (itineraryRef.value && typeof itineraryRef.value.addPlace === "function") {
    itineraryRef.value.addPlace();
  } else {
    console.warn("itineraryRef 尚未掛載，無法呼叫 addPlace");
  }
}

// 地圖與搜尋
const mapRef = ref(null); // 地圖容器 (initMap)
const searchQuery = ref(""); // 搜尋關鍵字 (searchPlace)
const isToggled = ref(false); // 切換地圖 / 卡片視圖
const searchInput = ref(null); // 輸入搜尋關鍵字

// 地點資料
const placeDetails = ref([]); // 搜尋結果詳細資訊 (searchPlace, handleResults)
const nextPageFunc = ref(null); // 分頁函式 (handleResults, loadNextPage)
const hasMoreResults = ref(false); // 是否有更多結果 (searchPlace, handleResults)
const defaultImage = "https://picsum.photos/1000?image";

// 選擇的地點與圖片
const selectedPlace = ref(null);       // 使用者選擇的地點 (點擊 marker 或卡片)
const selectedPlacePhotoIndex = ref(0);// 當前顯示的圖片索引 (watch selectedPlace)
const selectedCityName = ref("none"); // 預設為「當前」

const selectedMarkers = []; // 用於存儲選擇的標記 (點擊地圖)
const cities = [
  { name: '台北市', lat: 25.033964, lng: 121.564472 },
  { name: '新北市', lat: 25.016982, lng: 121.462786 },
  { name: '基隆市', lat: 25.131122, lng: 121.739622 },
  { name: '桃園市', lat: 24.993628, lng: 121.300979 },
  { name: '新竹市', lat: 24.80395, lng: 120.964675 },
  { name: '新竹縣', lat: 24.838722, lng: 121.002295 },
  { name: '苗栗縣', lat: 24.560159, lng: 120.821426 },
  { name: '台中市', lat: 24.147736, lng: 120.673648 },
  { name: '彰化縣', lat: 24.068523, lng: 120.562447 },
  { name: '南投縣', lat: 23.958842, lng: 120.971863 },
  { name: '雲林縣', lat: 23.709203, lng: 120.542994 },
  { name: '嘉義市', lat: 23.480075, lng: 120.449111 },
  { name: '嘉義縣', lat: 23.451842, lng: 120.255461 },
  { name: '台南市', lat: 22.999728, lng: 120.227028 },
  { name: '高雄市', lat: 22.627278, lng: 120.301435 },
  { name: '屏東縣', lat: 22.551975, lng: 120.548759 },
  { name: '宜蘭縣', lat: 24.702107, lng: 121.73775 },
  { name: '花蓮縣', lat: 23.987158, lng: 121.601571 },
  { name: '台東縣', lat: 22.764364, lng: 121.113207 },
  { name: '澎湖縣', lat: 23.57104, lng: 119.579369 },
  { name: '金門縣', lat: 24.436679, lng: 118.317088 },
  { name: '連江縣', lat: 26.16058, lng: 119.950946 },
]; // 城市列表


// 路線規劃
const travelMode = ref("DRIVING"); // 交通方式 (select dropdown)
const result = ref(null); // 路線結果（距離與時間）(calculateRoute)

//整個篩選區塊的容器，用來判斷點擊事件是不是發生在外部。
const menuRef = ref(null);

//側邊景點種類篩選
const showCustomCategory = ref(false); //是否顯示選單
const maxCategoryCount = 5; //側邊骰選選單的最大長度

//篩選種類
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

// Google Maps 實例與服務
let map = null; // 地圖實例 (initMap)
let markers = []; // 所有標記 (searchPlace, 點擊地圖)
let service = null; // 地點服務 (initMap)
let directionsService; // 路線服務 (onMounted)
let directionsRenderer; // 路線顯示器 (onMounted)
let markerCluster = null; //marker的集合

//當 selectedPlace 改變時，重設圖片索引
watch(selectedPlace, (newVal) => {
  if (newVal) {
    selectedPlacePhotoIndex.value = 0;
  }
});

// 載入 Google Maps API
function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places,geometry`;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 初始化地圖
function initMap() {
  map = new google.maps.Map(mapRef.value, {
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
  service = new google.maps.places.PlacesService(map);
}

// 搜尋地點
function searchPlace() {
  if (!searchQuery.value || !map) return;

  selectedMarkers.forEach((m) => m.setMap(null));
  selectedMarkers.length = 0;

  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  placeDetails.value = [];
  nextPageFunc.value = null;
  hasMoreResults.value = false;

  if (selectedCityName.value !== "none") {
    // 選縣市+搜尋欄 用文字搜尋
    const center = map.getCenter();
    const request = {
      query: `${searchQuery.value} ${selectedCityName.value}`,
      location: center,
      radius: 1000,
    };
    service.textSearch(request, handleResults);
  } else {
    // 選擇當前+搜尋欄 用附近搜尋
    const center = map.getCenter();
    const request = {
      location: center,
      radius: 3000,
      keyword: searchQuery.value,
    };
    service.nearbySearch(request, handleResults);
  }
}


// 處理搜尋結果
function handleResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK || !results.length) {
    alert("找不到地點！");
    return;
  }

  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  if (markerCluster) {
    markerCluster.clearMarkers();
    markerCluster = null;
  }

  results.forEach((place) => {
    if (!place.geometry || !place.geometry.location) return;

    map.setCenter(place.geometry.location);
    const iconUrl = getPlaceIconUrl(place.types);


    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      title: place.name,
      icon: {
        url: iconUrl,
      }, // 這裡套用分類 SVG
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
    map: map,
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

  // 分頁處理
  if (pagination && pagination.hasNextPage) {
    nextPageFunc.value = () => pagination.nextPage();
    hasMoreResults.value = true;
  } else {
    hasMoreResults.value = false;
  }
}

// 載入下一頁
function loadNextPage() {
  if (nextPageFunc.value) {
    nextPageFunc.value();
  }
}

// 計算路線
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

//  重新計算路線
function recalculateRoute() {
  if (markers.length === 2) {
    calculateRoute(markers[0].getPosition(), markers[1].getPosition());
  }
}

// 重設地圖和標記
function reset() {
  result.value = null;
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  if (directionsRenderer) {
    directionsRenderer.setDirections({ routes: [] });
  }
}

// 選擇縣市後移動地圖並搜尋景點
function moveToCity(event) {
  selectedMarkers.forEach((m) => m.setMap(null));
  selectedMarkers.length = 0;

  const cityName = event.target.value;
  selectedCityName.value = cityName;

  if (cityName === "none") {
    markers.forEach((m) => m.setMap(null));
    markers = [];

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const center = new google.maps.LatLng(userLat, userLng);
          map.setCenter(center);
          map.setZoom(15);
          searchNearby(userLat, userLng, 3000);
        },
        () => {
          alert("⚠️ 無法取得你的定位！");
        }
      );
    } else {
      alert("你的瀏覽器不支援定位功能");
    }
    return;
  }

  const city = cities.find((c) => c.name === cityName);
  if (!city || !map) return;

  const center = new google.maps.LatLng(city.lat, city.lng);
  map.setCenter(center);
  map.setZoom(13);

  searchNearbyByText(cityName, center, 4000);
}

// 當選擇的縣市改變時，重設搜尋關鍵字並移動地圖
function onCityChange(event) {
  searchQuery.value = "";        
  moveToCity(event);             
}

// 搜尋附近旅遊景點(用半徑)
function searchNearby(lat, lng, radius= 5000) {
  if (!service) {
    service = new google.maps.places.PlacesService(map);
  }

  const location = new google.maps.LatLng(lat, lng);

  markers.forEach((m) => m.setMap(null));
  markers = [];
  placeDetails.value = [];
  hasMoreResults.value = false;


  service.nearbySearch(
    {
      location,
      radius,
      type: "tourist_attraction",
    },
    (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
          const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
          });
          marker.addListener("click", () => {
            selectedPlace.value = place;
          });
          markers.push(marker);
          placeDetails.value.push(place);
        });
      }
    }
  );
}

// 搜尋附近旅遊景點(用城市名稱)
function searchNearbyByText(cityName, center, radius= 5000) {
  if (!service) {
    service = new google.maps.places.PlacesService(map);
  }

  markers.forEach((m) => m.setMap(null));
  markers = [];
  placeDetails.value = [];
  hasMoreResults.value = false;

  service.textSearch(
    {
      query: `tourist attractions ${cityName}`,
      location: center,
      radius,
    },
    (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
          const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
          });
          marker.addListener("click", () => {
            selectedPlace.value = place;
          });
          markers.push(marker);
          placeDetails.value.push(place);
        });
      }
    }
  );
}

//篩選景點
function searchByCategory(type) {
  if (!map || !type) return;
    
  // 點側邊 icon 時，清空搜尋欄文字
  searchQuery.value = "";

  // 清空資料，避免殘影
  placeDetails.value = [];
  selectedPlace.value = null;

  // 清除舊有 marker
  markers.forEach((m) => m.setMap(null));
  markers = [];

  const service = new window.google.maps.places.PlacesService(map);
  const request = {
    location: map.getCenter(),
    radius: 3000,
    type,
  };

  service.nearbySearch(request, (results, status, pagination) => {
    
    //確認有結果才執行後續處理
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length) {
      results.forEach((place) => {
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
          title: place.name,
        });
        markers.push(marker);

        marker.addListener("click", () => {
          selectedPlace.value = place;
        });
      });

      placeDetails.value = results; //卡片模式會立即刷新
    }
  })
};


//個人定位
function locateUser(map) {
  if (!navigator.geolocation) {
    alert("❗ 你的瀏覽器不支援定位功能");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // 在地圖上加上使用者位置的標記
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
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

      // 將地圖中心移動到使用者位置
      map.setCenter(userLocation);
      map.setZoom(15);
    },
    (error) => {
      alert("❗ 無法取得你的定位資訊");
      console.error(error);
    }
  );
}

//添加篩選種類
function addCategory(item) {
  const exists = categories.value.some((cat) => cat.type === item.type);
  if (exists) return; // 已存在就不處理
  if (categories.value.length >= maxCategoryCount) {
    alert("❗ 已達上限，最多只能選擇 5 種類別");
    return;
  }

  categories.value.push(item);
  placeCategories.value = placeCategories.value.filter(
    (cat) => cat.type !== item.type
  );
}

//移除篩選種類
function removeCategory(item) {
  // 從已選類別移除
  categories.value = categories.value.filter((cat) => cat.type !== item.type);

  // 加回候選清單，如果還沒在裡面
  const exists = placeCategories.value.some((cat) => cat.type === item.type);
  if (!exists) {
    placeCategories.value.push(item);
  }
}

// 點擊外部時關閉自訂分類
function handleClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showCustomCategory.value = false;
  }
}

//讓svg可以被地圖使用
function getPlaceIconUrl(types = []) {
  for (const type of types) {
    if (MapIcons[type]) {
      return (
        "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(MapIcons[type])
      );
    }
  }
  // 沒有對應圖示就使用 default
  return (
    "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(MapIcons.default)
  );
}

onMounted(async () => {
  try {
    await loadGoogleMaps(); // 等待 API 載入
    initMap(); // 初始化地圖
    await locateUser(map);

    // 初始化方向服務
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
    directionsRenderer.setMap(map);

    // 初始化 PlacesService（for 點擊地圖查詢）
    service = new google.maps.places.PlacesService(map);

    // 初始化 Autocomplete（for 搜尋欄）
    const autocomplete = new google.maps.places.Autocomplete(
      searchInput.value,
      {
        fields: ["geometry", "name"],
        types: ["(cities)"], // 可依需求改成 ['geocode'] 或移除限制
      }
    );

    // 當使用者選擇建議項目後，自動觸發搜尋
    autocomplete.addListener("place_changed", () => {

      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      searchQuery.value = place.name;
      searchPlace();
    });

    // 設置地圖點擊事件
    map.addListener("click", (e) => {
      if (markers.length >= 2) reset();

      const marker = new google.maps.Marker({
        position: e.latLng,
        map,
      });


    // 地圖點擊事件
    map.addListener("click", (event) => {
      markers.forEach((marker) => marker.setMap(null));
      markers = [];
      placeDetails.value = [];
      nextPageFunc.value = null;
      hasMoreResults.value = false;
      if (isToggled.value) return;

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
              map,
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
            console.warn("取得詳細資料失敗", detailStatus);
          }
        });
      } else {
        console.log("點擊了非place地點");
      }
    });

    // 使用者點擊地圖任意位置時，執行 handleClickOutside
    map.addListener("click", handleClickOutside);

  } catch (err) {
    alert("❌ Google Maps 載入失敗");
    console.error(err);
  }
});

// onUnmounted 清理監聽器（防止記憶體洩漏）
onUnmounted(() => {
  map.removeListener("click", handleClickOutside);
});

</script>

<style scoped>
.controls {
  position: absolute;
  bottom: 40px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 1;
}
</style>
