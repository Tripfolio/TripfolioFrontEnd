# 🌍 Tripfolio Frontend

📌 這是我們的前端專案，目的是將前端課程中所學的知識實際應用，實作一個旅遊行程規劃網站，透過 Vue.js 建立互動式 UI 並串接後端 API。
<br>
📌 搭配後端專案請參考 → [link](https://github.com/Tripfolio/TripfolioBackEnd)
## 框架與套件
- Vue
- Tailwind CSS
## 安裝步驟
1. 克隆這個專案：
    ```bash
    git clone https://github.com/Tripfolio/TripfolioFrontEnd.git
    ```
2. 安裝依賴：
    ```bash
    npm install
    ```
3. 本地開發：
    ```bash
    npm run dev
    ```
4. 設定 Google Map API 金鑰：
   <br>
   請在專案根目錄建立 .env 檔案，並依照 .env.template 的格式填寫對應的環境變數。

## 組員與分工：
|組員|GitHub|功能：行程|功能：地圖|功能：會員|
|--|--|--|--|--|
|陳品均|[LeoChen517](https://github.com/LeoChen517)|瀏覽/查看功能||郵件通知功能|
|張哲豪|[kiwiisfish](https://github.com/kiwiisfish)|預算估算功能|依類別篩選||
|蘇怡瑄|[mmaysu](https://github.com/mmaysu)|加入景點功能|關鍵字搜尋||
|林芳綺|[yanamint](https://github.com/yanamint)|串接 google calender||註冊|
|周子筠|[yumi-chou](https://github.com/yumi-chou)|通勤方式與時間功能|路線與通勤時間
|許家瑜|[Ninahsuuuuu](https://github.com/Ninahsuuuuu)|行程總覽建立||資料變更|
|劉暄|[pearl-liu-1203](https://github.com/pearl-liu-1203)|行程頁面編輯||登入|













<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";
// import { useMapSearch } from "../composable/useMapSearch";
// import { loadGoogleMaps } from "../composable/loadGoogleMaps";
import { cities } from "../composable/city";

const route = useRoute();
const router = useRouter();

const mapRef = ref(null);
const searchQuery = ref("");
const searchInput = ref(null);
const map = ref(null);

const placeDetails = ref([]);
const nextPageFunc = ref(null);
const hasMoreResults = ref(false);

const selectedPlace = ref(null);
const selectedPlacePhotoIndex = ref(0);
const selectedCityName = ref("none");

// const selectedMarkers = [];

// let markers = [];
// let service = null;
let directionsRenderer;
// let markerCluster = null;

const menuRef = ref(null);
const showCustomCategory = ref(false);
const maxCategoryCount = 5;

const categories = ref([
  { type: "restaurant", label: "🍽️ restaurant" },
  { type: "lodging", label: "🏨 lodging" },
  { type: "residence", label: "🏠 residence" },
  { type: "tourist_attraction", label: "📍 tourist_attraction" },
  // { type: "other_options", label: "+" },
]);

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

watch(selectedPlace, (newVal) => {
  if (newVal) {
    selectedPlacePhotoIndex.value = 0;
  }
});

// function clearMap() {
//   selectedMarkers.forEach((m) => m.setMap(null));
//   selectedMarkers.length = 0;
//   markers.forEach((marker) => marker.setMap(null));
//   markers = [];
//   placeDetails.value = [];
//   nextPageFunc.value = null;
//   hasMoreResults.value = false;
//   selectedPlace.value = null;
// }

function searchPlace() {
  if (!searchQuery.value) return;
  router.push({
    path: "/map",
    query: {
      searchQuery: searchQuery.value,
      // city: route.query.city || "none",
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

// function handleResults(results, status, pagination) {
//   if (status !== google.maps.places.PlacesServiceStatus.OK || !results.length) {
//     alert("找不到地點！");
//     return;
//   }

//   markers.forEach((marker) => marker.setMap(null));
//   markers = [];
//   if (markerCluster) {
//     markerCluster.clearMarkers();
//     markerCluster = null;
//   }

//   results.forEach((place) => {
//     if (!place.geometry || !place.geometry.location) return;

//     map.value.setCenter(place.geometry.location);
//     const iconUrl = getPlaceIconUrl(place.types);

//     const marker = new google.maps.Marker({
//       map: map.value,
//       position: place.geometry.location,
//       title: place.name,
//       icon: {
//         url: iconUrl,
//       },
//     });

//     markers.push(marker);

//     // const detailRequest = {
//     //   placeId: place.place_id,
//     //   fields: [
//     //     "name",
//     //     "formatted_address",
//     //     "geometry",
//     //     "rating",
//     //     "user_ratings_total",
//     //     "photos",
//     //   ],
//     // };

//     // service.getDetails(detailRequest, (detailResult, detailStatus) => {
//     //   if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
//     //     placeDetails.value.push(detailResult);

//     //     marker.addListener("click", () => {
//     //       selectedPlace.value = detailResult;
//     //     });
//     //   }
//     // });
//   });

//   // markerCluster = new MarkerClusterer({
//   //   map: map.value,
//   //   markers: markers,
//   //   renderer: {
//   //     render({ count, position }) {
//   //       return new google.maps.Marker({
//   //         position,
//   //         label: {
//   //           text: String(count),
//   //           color: "white",
//   //           fontSize: "20px",
//   //           fontWeight: "bold",
//   //         },
//   //       });
//   //     },
//   //   },
//   // });

//   if (pagination && pagination.hasNextPage) {
//     nextPageFunc.value = () => pagination.nextPage();
//     hasMoreResults.value = true;
//   } else {
//     hasMoreResults.value = false;
//   }
// }

function loadNextPage() {
  if (nextPageFunc.value) {
    nextPageFunc.value();
  }
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

// function getPlaceIconUrl(types) {
//   for (const type of types) {
//     return `src/assets/icons/mapIcons/${type}.svg`;
//   }
//   return "src/assets/icons/mapIcons/default.svg";
// }

// let performSearch = () => {};

onMounted(async () => {
  // try {
    // await loadGoogleMaps();

    // map.value = new google.maps.Map(mapRef.value, {
    //   center: { lat: 25.033964, lng: 121.564472 },
    //   zoom: 15,
    //   disableDefaultUI: true,
    // });

    // directionsRenderer = new google.maps.DirectionsRenderer({
    //   suppressMarkers: true,
    // });
    // directionsRenderer.setMap(map.value);

    // service = new google.maps.places.PlacesService(map.value);

    // performSearch = useMapSearch({
    //   map: map.value,
    //   // service,
    //   clearMap,
    //   handleResults,
    // }).performSearch;

    document.addEventListener("click", handleClickOutside);
    // setTimeout(() => {
    //   searchPlace();
    // }, 300);
  // } catch (err) {
  //   alert("Google Maps 載入失敗");
  //   alert(err);
  // }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>