<template>
  <div class="bg-gray-800 min-h-screen p-4 sm:p-8 flex flex-col items-center">
    
    <nav class="w-full max-w-5xl mx-auto bg-gray-700 text-white rounded-full shadow-lg p-3 mb-8">
      <div class="flex items-center justify-between">
        <button class="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full hover:bg-gray-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>

        <div class=" md:flex items-center gap-6">
          <a v-for="link in navLinks" :key="link.name" :href="link.href" class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <span class="text-sm font-medium">{{ link.name }}</span>
          </a>
        </div>

        <button>
          <img class="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-colors" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80" alt="使用者頭像">
        </button>
      </div>
    </nav>
    
    <main class="w-full max-w-4xl bg-gray-700 text-white rounded-2xl shadow-lg p-6 sm:p-8">

      <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <img class="w-24 h-24 rounded-full border-4 border-gray-500 object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80" alt="使用者頭像">
        <div class="flex-grow flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div>
            <h1 class="text-3xl font-bold">{{ user.name }}</h1>
            <div class="flex gap-4 mt-2 text-gray-400 justify-center sm:justify-start">
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
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="['pb-2 text-lg font-semibold transition-colors duration-300', activeTab === tab.key ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white']">
            {{ tab.label }}
          </button>
        </div>
      </div>
      
      <div>
        <!-- 我建立的行程 -->
        <div v-if="activeTab === 'travels'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="travel in travels" :key="travel.id" @click="goToTravel(travel.id)" class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group">
            <div class="relative">
              <img :src="travel.coverUrl" class="w-full h-48 object-cover" alt="行程預覽圖"/>
              <div class="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex justify-end gap-2">
                  <button class="w-8 h-8 rounded-full bg-gray-800 bg-opacity-70 flex items-center justify-center hover:bg-opacity-100">⋯</button>
                  <button class="w-8 h-8 rounded-full bg-gray-800 bg-opacity-70 flex items-center justify-center hover:bg-opacity-100">🔗</button>
                </div>
              </div>
            </div>
            <div class="p-4">
              <div class="font-semibold text-lg">{{ travel.title }}</div>
              <div class="text-sm text-gray-400">{{ travel.startDate }} ~ {{ travel.endDate }}</div>
            </div>
          </div>
        </div>
        <!-- 我建立的貼文 -->
        <div v-else-if="activeTab === 'my_posts'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="post in posts" :key="post.id" @click="goToPost(post.id)" class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group">
            <img :src="post.postImage" class="w-full h-48 object-cover" alt="貼文預覽圖" />
            <div class="p-4">
              <div class="font-semibold text-lg">{{ post.title }}</div>
              <div class="text-sm text-gray-400">作者: {{ post.author }}</div>
            </div>
          </div>
        </div>
        <!-- 我收藏的貼文 -->
        <div v-else-if="activeTab === 'collected_posts'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="post in collectedPosts" :key="post.id" @click="goToPost(post.id)" class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group">
            <img :src="post.postImage" class="w-full h-48 object-cover" alt="貼文預覽圖" />
            <div class="p-4">
              <div class="font-semibold text-lg">{{ post.title }}</div>
              <div class="text-sm text-gray-400">作者: {{ post.author }}</div>
            </div>
          </div>
        </div>
        <!-- 通知設定 -->
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
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

// 原始 Navbar 連結的資料
const navLinks = ref([
  { name: '行程安排', href: '#' },
  { name: '探索', href: '#' },
  { name: '評論', href: '#' },
  { name: '關於我們', href: '#' },
]);

// 原始使用者資料
const user = ref({
  name: 'yourName',
  bio: '這裡放自介，一段關於您的簡短介紹，讓大家更認識您。',
});

// 結合組員與原始的 Tab 選項
// 'travels': 我建立的行程 (對應原本的 collected_spots)
// 'my_posts': 我建立的貼文 (組員新增)
// 'collected_posts': 我收藏的貼文 (對應原本的 collected_posts)
// 'notifications': 通知設定 (原始保留)
const tabs = ref([
  { key: 'travels', label: '我建立的行程' },
  { key: 'my_posts', label: '我建立的貼文' },
  { key: 'collected_posts', label: '我收藏的貼文' },
  { key: 'notifications', label: '通知設定' },
]);

// 預設選中的 Tab 為 'travels'
const activeTab = ref('travels');

// 組員的資料狀態
const travels = ref([]); // 我建立的行程
const posts = ref([]); // 我建立的貼文
const collectedPosts = ref([]); // 我收藏的貼文

// 確認會員登入並抓取 memberId
// 請注意：在實際應用中，應將 alert 替換為更友善的 UI 提示，例如一個彈出視窗或訊息方塊。
const memberId = localStorage.getItem('memberId') || '1'; // 預設為 '1' 以便測試
if (!memberId) {
  console.error('Member ID 不存在，請先登入會員。');
  // throw new Error('memberId 不存在'); // 如果不希望頁面繼續執行，可以取消註解此行
}

// 獲取資料的函式
const fetchData = async () => {
  // 環境變數 VITE_API_URL 必須在 .env.local 或 vite.config.js 中定義
  // 例如：VITE_API_URL=http://localhost:3000
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // 請替換成實際的 API 基礎 URL

  try {
    // 抓取自己發過的行程
    const travelRes = await axios.get(`${API_BASE_URL}/api/schedules/member/${memberId}`);
    travels.value = travelRes.data.map(item => ({
      id: item.id,
      title: item.title,
      startDate: item.startDate?.slice(0, 10),
      endDate: item.endDate?.slice(0, 10),
      coverUrl: item.coverURL
    }));
  } catch (err) {
    console.warn('抓取行程資料失敗，請確認 API 路徑和服務是否正常。', err);
    // 測試用的行程假資料，若 API 失敗可啟用
    travels.value = [
      { id: 1, title: '沖繩海島慢活之旅', startDate: '2025-07-10', endDate: '2025-07-15', coverUrl: 'https://images.unsplash.com/photo-1540998145393-8c43715265d2?w=500&q=80' },
      { id: 2, title: '京都楓葉古寺巡禮', startDate: '2025-11-20', endDate: '2025-11-25', coverUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&q=80' },
      { id: 3, title: '探索冰島極光', startDate: '2026-01-05', endDate: '2026-01-12', coverUrl: 'https://images.unsplash.com/photo-153643135-645438519473?w=500&q=80' },
    ];
  }

  try {
    // 抓取自己發過的貼文 (請替換為實際 API 路徑，或使用假資料)
    // const postRes = await axios.get(`${API_BASE_URL}/api/members/${memberId}/posts`);
    // posts.value = postRes.data.map(item => ({
    //   id: item.id,
    //   title: item.title,
    //   author: item.author, // 假設有作者欄位
    //   postImage: item.post_image // 或 item.coverImage
    // }));
  } catch (err) {
    console.warn('抓取自己建立的貼文失敗，可忽略，等待合併資料庫後再啟用。', err);
    // 測試用的貼文假資料
    posts.value = [
      { id: 1, title: '一個人旅行的10個心得', author: '旅行家A', postImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&q=80'},
      { id: 2, title: '東京必吃拉麵 TOP 5', author: '美食家B', postImage: 'https://images.unsplash.com/photo-1552634354-1b1759793c19?w=500&q=80'},
    ];
  }

  try {
    // 抓取自己收藏過的貼文 (請替換為實際 API 路徑，或使用假資料)
    // const collectRes = await axios.get(`${API_BASE_URL}/api/members/${memberId}/collections`);
    // collectedPosts.value = collectRes.data.map(item => ({
    //   id: item.id,
    //   title: item.title,
    //   author: item.author, // 假設有作者欄位
    //   postImage: item.post_image // 或 item.coverImage
    // }));
  } catch (err) {
    console.warn('抓取收藏貼文失敗，可忽略，等待合併資料庫後再啟用。', err);
    // 測試用的收藏貼文假資料
    collectedPosts.value = [
      { id: 1, title: '台中兩日遊', author: '探險家C', postImage: 'https://via.placeholder.com/400x200?text=Taichung_Trip' },
      { id: 2, title: '花蓮兩日遊', author: '攝影師D', postImage: 'https://via.placeholder.com/400x200?text=Hualien_Trip' },
    ];
  }
};

// 初次載入時抓取一次資料
onMounted(fetchData);

// 監聽路由變化，每次切換回來這頁也要抓一次（確保資料有更新）
watch(() => route.fullPath, fetchData);

// 導航到行程詳情頁
const goToTravel = id => {
  router.push(`/travel/${id}`);
};

// 導航到貼文詳情頁
const goToPost = id => {
  router.push(`/community/post/${id}`); // 修正為 'community'
};
</script>
