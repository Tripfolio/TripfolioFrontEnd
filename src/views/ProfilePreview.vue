<template>
  <div class="bg-white min-h-screen p-4 sm:p-8 flex flex-col items-center">
    <nav
      class="w-full max-w-5xl mx-auto bg-[#A2A2A2] text-white rounded-full shadow-lg p-3 mb-8"
    >
      <div class="flex items-center justify-between">
        <button
          class="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full hover:bg-gray-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>

        <div
          class="flex flex-wrap justify-center md:flex items-center gap-2 sm:gap-4 md:gap-6"
        >
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="flex items-center gap-1 sm:gap-2 text-gray-800 hover:text-white transition-colors text-xs sm:text-sm md:text-base"
          >
            <span class="font-medium">{{ link.name }}</span>
          </router-link>
        </div>

        <button>
          <img
            class="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-colors"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80"
            alt="User Avatar"
          />
        </button>
      </div>
    </nav>

    <main
      class="w-full max-w-4xl bg-[#686868] text-white rounded-2xl shadow-lg p-6 sm:p-8"
    >
      <header>
        <div
          class="bg-[#A2A2A2] text-white rounded-t-2xl shadow-md p-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold">會員中心</h2>
          <div class="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-gray-300">
					</div>
        </div>
      </header>

      <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <!-- Example image: User avatar -->
        <img
          class="w-24 h-24 rounded-full border-4 border-gray-500 object-cover"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80"
          alt="使用者頭像"
        />
        <div
          class="flex-grow flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
        >
          <div>
            <h1 class="text-3xl font-bold">{{ user.name }}</h1>
            <div
              class="flex gap-4 mt-2 text-gray-400 justify-center sm:justify-start"
            >
              <a href="#" class="hover:text-white">編輯</a>
              <a href="#" class="hover:text-white">登出</a>
            </div>
          </div>
          <div class="hidden sm:block w-px h-16 bg-gray-500"></div>
          <p class="text-gray-300">{{ user.bio }}</p>
        </div>
      </div>

      <hr class="border-gray-500 mb-6" />

      <div class="flex justify-between items-center mb-8">
        <div class="flex gap-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'pb-2 text-lg font-semibold transition-colors duration-300',
              activeTab === tab.key
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          開通 AI
        </button>
      </div>

      <div>
        <!-- My created itineraries -->
        <div
          v-if="activeTab === 'travels'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="travel in travels"
            :key="travel.id"
            @click="goToTravel(travel.id)"
            class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group"
          >
            <div class="relative">
              <!-- Example image: Travel cover image -->
              <img
                :src="travel.coverUrl"
                class="w-full h-48 object-cover"
                alt="行程預覽圖"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div class="flex justify-end gap-2">
                  <button
                    class="w-8 h-8 rounded-full bg-gray-800 bg-opacity-70 flex items-center justify-center hover:bg-opacity-100"
                  >
                    ⋯
                  </button>
                  <button
                    class="w-8 h-8 rounded-full bg-gray-800 bg-opacity-70 flex items-center justify-center hover:bg-opacity-100"
                  >
                    🔗
                  </button>
                </div>
              </div>
            </div>
            <div class="p-4">
              <div class="font-semibold text-lg">{{ travel.title }}</div>
              <div class="text-sm text-gray-400">
                {{ travel.startDate }} ~ {{ travel.endDate }}
              </div>
            </div>
          </div>
        </div>
        <!-- My created posts -->
        <div
          v-else-if="activeTab === 'my_posts'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="post in posts"
            :key="post.id"
            @click="goToPost(post.id)"
            class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group"
          >
            <!-- Example image: Post cover image -->
            <img
              :src="post.postImage"
              class="w-full h-48 object-cover"
              alt="貼文預覽圖"
            />
            <div class="p-4">
              <div class="font-semibold text-lg">{{ post.title }}</div>
              <div class="text-sm text-gray-400">作者: {{ post.author }}</div>
            </div>
          </div>
        </div>
        <!-- My collected posts -->
        <div
          v-else-if="activeTab === 'collected_posts'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="post in collectedPosts"
            :key="post.id"
            @click="goToPost(post.id)"
            class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group"
          >
            <!-- Example image: Collected post cover image -->
            <img
              :src="post.postImage"
              class="w-full h-48 object-cover"
              alt="貼文預覽圖"
            />
            <div class="p-4">
              <div class="font-semibold text-lg">{{ post.title }}</div>
              <div class="text-sm text-gray-400">作者: {{ post.author }}</div>
            </div>
          </div>
        </div>
        <!-- Notification settings -->
        <div v-else-if="activeTab === 'notifications'">
          <div class="bg-gray-600 rounded-xl p-8 text-center">
            <h3 class="text-xl font-semibold mb-4">通知設定</h3>
            <p class="text-gray-400">這裡將會放置您的通知設定選項。</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

// START of teammate's code
const travels = ref([]);
const posts = ref([]);
const collectedPosts = ref([]);
const activeTab = ref("travels");
const tabs = [
  { key: "travels", label: "我建立的行程" },
  { key: "my_posts", label: "我建立的貼文" }, // Adjusted to 'my_posts' for distinction
  { key: "collected_posts", label: "我收藏的貼文" }, // Adjusted to 'collected_posts' for distinction
  { key: "notifications", label: "通知設定" }, // Retained from original
];

// Check member login, fetch ID
const memberId = localStorage.getItem("memberId") || "1";
if (!memberId) {
  // Teammate originally used alert, changed to console.error for Canvas environment compatibility
  console.error("請先登入會員");
  // throw new Error('memberId 不存在') // Uncomment if you wish to block execution
}

const fetchData = async () => {
  // VITE_API_URL environment variable must be defined in .env.local or vite.config.js
  // e.g.: VITE_API_URL=http://localhost:3000
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // Replace with actual API base URL

  try {
    // Fetch user's created itineraries
    const travelRes = await axios.get(
      `${API_BASE_URL}/api/schedules/member/${memberId}`,
    );
    travels.value = travelRes.data.map((item) => ({
      id: item.id,
      title: item.title,
      startDate: item.startDate?.slice(0, 10),
      endDate: item.endDate?.slice(0, 10),
      coverUrl: item.coverURL,
    }));
  } catch (err) {
    console.warn(
      "Failed to fetch travel data, please check API path and service. (Can be ignored, will be replaced with real data after database merge)",
      err,
    );
    // Test data for itineraries, enable if API fails
    travels.value = [
      {
        id: 1,
        title: "沖繩海島慢活之旅",
        startDate: "2025-07-10",
        endDate: "2025-07-15",
        coverUrl:
          "https://images.unsplash.com/photo-1540998145393-8c43715265d2?w=500&q=80",
      },
      {
        id: 2,
        title: "京都楓葉古寺巡禮",
        startDate: "2025-11-20",
        endDate: "2025-11-25",
        coverUrl:
          "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&q=80",
      },
      {
        id: 3,
        title: "探索冰島極光",
        startDate: "2026-01-05",
        endDate: "2026-01-12",
        coverUrl:
          "https://images.unsplash.com/photo-153643135-645438519473?w=500&q=80",
      },
    ];
  }

  // Fetch user's created posts (using dummy data for now, will connect to DB later)
  try {
    // const postRes = await axios.get(`${API_BASE_URL}/api/members/${memberId}/posts`)
    // posts.value = postRes.data.map(item => ({
    //     id: item.id,
    //     title: item.title,
    //     postImage: item.post_image // Or adjust based on actual API response field
    // }));
  } catch (err) {
    console.warn(
      "Failed to fetch user-created posts (can be ignored, will be replaced with real data after database merge)",
      err,
    );
  }

  // Fetch user's collected posts (using dummy data for now, will connect to DB later)
  try {
    // const collectRes = await axios.get(`${API_BASE_URL}/api/members/${memberId}/collections`)
    // collectedPosts.value = collectRes.data.map(item => ({
    //     id: item.id,
    //     title: item.title,
    //     postImage: item.post_image // Or adjust based on actual API response field
    // }));
  } catch (err) {
    console.warn(
      "Failed to fetch collected posts (can be ignored, will be replaced with real data after database merge)",
      err,
    );
  }
};

// Fetch data on initial load
onMounted(fetchData);

// Fetch data every time this page is switched back to (ensure data is updated)
watch(() => route.fullPath, fetchData);

const goToTravel = (id) => router.push(`/travel/${id}`);
// Corrected 'comunity' spelling to 'community'
const goToPost = (id) => router.push(`/community/post/${id}`);

// Test dummy data for posts, will connect to DB later
// Retained teammate's dummy data, note this serves as fallback if API calls fail
posts.value = [
  {
    id: 1,
    title: "台北兩日遊",
    postImage: "https://via.placeholder.com/400x200?text=Trip",
    author: "旅行家A", // Added author field to match template
  },
  {
    id: 2,
    title: "高雄兩日遊",
    postImage: "https://via.placeholder.com/400x200?text=Trip",
    author: "美食家B", // Added author field to match template
  },
];

collectedPosts.value = [
  {
    id: 1,
    title: "台中兩日遊",
    postImage: "https://via.placeholder.com/400x200?text=Trip",
    author: "探險家C", // Added author field to match template
  },
  {
    id: 2, // Changed ID to 2 to avoid duplication with above
    title: "花蓮兩日遊",
    postImage: "https://via.placeholder.com/400x200?text=Trip",
    author: "攝影師D", // Added author field to match template
  },
];
// END of teammate's code

// Original Navbar link data - integrated with teammate's script and used in template
const navLinks = ref([
  { name: "行程安排", href: "/schedules" }, // Example: Replace with actual route path
  { name: "探索", href: "/explore" }, // Example: Replace with actual route path
  { name: "評論", href: "/reviews" }, // Example: Replace with actual route path
  { name: "關於我們", href: "/about" }, // Example: Replace with actual route path
]);

// Original user data - defined independently, no conflict with teammate's script
const user = ref({
  name: "yourName",
  bio: "這裡放自介，一段關於您的簡短介紹，讓大家更認識您。",
});

// Dynamic modification of Navbar links
// Regarding the linking of `navLinks` hyperlinks, if your Vue project uses `vue-router`,
// the most recommended approach is to use the `<router-link>` component and bind the `to` prop.
// For example:
// <router-link :to="link.path" class="text-xs sm:text-sm md:text-base">{{ link.name }}</router-link>
//
// The advantages of doing this are:
// 1. It does not trigger a browser reload, achieving a smooth Single Page Application (SPA) experience.
// 2. It automatically handles active link styles.
//
// This requires you to replace `href` with `path` in your `navLinks` data and correspond it to the paths defined in your `router/index.js` or `router.ts`.
// For example:
// const navLinks = ref([
//   { name: '行程安排', path: '/schedules' },
//   { name: '探索', path: '/explore' },
//   // ... other links
// ]);
//
// If your teammate's script uses plain `<a>` tags instead of `router-link`, then linking can only be achieved by modifying `href`.
// Currently, `navLinks`' `href` has been updated to example route paths.
</script>
