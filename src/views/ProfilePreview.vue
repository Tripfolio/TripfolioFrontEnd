<template>
  <div class="bg-white min-h-screen p-4 sm:p-8 flex flex-col items-center">
    
    <nav class="w-full max-w-5xl mx-auto bg-[#A2A2A2] text-white rounded-full p-3 mb-8 nav-convex-effect">
      <div class="flex items-center justify-between">
        <button class="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full hover:bg-gray-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>

        <div class="flex flex-wrap justify-center md:flex items-center gap-2 sm:gap-4 md:gap-6">
          <router-link v-for="link in navLinks" :key="link.name" :to="link.path" class="flex items-center gap-1 sm:gap-2 text-gray-800 hover:text-white transition-colors text-xs sm:text-sm md:text-base">
            <span class="font-medium">{{ link.name }}</span>
          </router-link>
        </div>

        <button>
          <img class="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-colors" src="https://images.unsplash.com/photo-1529570058547-733204bf87e5?q=80&w=1362&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="使用者頭像">
        </button>
      </div>
    </nav>
    
    <main class="w-full max-w-4xl bg-[#686868] text-white rounded-2xl shadow-lg overflow-hidden">

      <div class="bg-[#A2A2A2] text-white shadow-md p-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold">會員中心</h2>
        <div class="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-gray-300">
          
        </div>
      </div>

      <div class="p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <img class="w-24 h-24 rounded-full border-4 border-gray-500 object-cover" src="https://images.unsplash.com/photo-1529570058547-733204bf87e5?q=80&w=1362&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="使用者頭像">
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
          <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            開通 AI
          </button>
        </div>
        
        <div class="mt-6"> 
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
          <div v-else-if="activeTab === 'my_posts'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="post in posts" :key="post.id" @click="goToPost(post.id)" class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group">
              <img :src="post.postImage" class="w-full h-48 object-cover" alt="貼文預覽圖" />
              <div class="p-4">
                <div class="font-semibold text-lg">{{ post.title }}</div>
                <div class="text-sm text-gray-400">作者: {{ post.author }}</div>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab === 'collected_posts'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="post in collectedPosts" :key="post.id" @click="goToPost(post.id)" class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group">
              <img :src="post.postImage" class="w-full h-48 object-cover" alt="貼文預覽圖" />
              <div class="p-4">
                <div class="font-semibold text-lg">{{ post.title }}</div>
                <div class="text-sm text-gray-400">作者: {{ post.author }}</div>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab === 'notifications'">
            <div class="bg-gray-600 rounded-xl p-8 text-center">
              <h3 class="text-xl font-semibold mb-4">通知設定</h3>
              <p class="text-gray-400">這裡將會放置您的通知設定選項。</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter()
const route = useRoute()

const travels = ref([])
const posts = ref([])
const collectedPosts = ref([])
const activeTab = ref('travels')
const tabs = [
    { key: 'travels', label: '我建立的行程' },
    { key: 'posts', label: '我建立的貼文' }, 
    { key: 'collected', label: '我收藏的貼文' }, 
    { key: 'notifications', label: '通知設定' }, 
]

//確認會員登入 抓id
const memberId = localStorage.getItem('memberId') || '1'
if (!memberId) {
  alert('請先登入會員')
  throw new Error('memberId 不存在')
}

const fetchData = async () => {
    try {
        //抓自己發過的行程
        const travelRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/schedules/member/${memberId}`)
        travels.value = travelRes.data.map(item => ({
            id: item.id,
            title: item.title,
            startDate: item.startDate?.slice(0, 10),
            endDate: item.endDate?.slice(0, 10),
            coverUrl: item.coverURL
        }));
    } catch (err) {
        alert('Failed to fetch travel data, please check API path and service. (Can be ignored, will be replaced with real data after database merge)', err);
        // 連接後端請註解，關閉假資料
        travels.value = [
            { id: 1, title: '沖繩海島慢活之旅', startDate: '2025-07-10', endDate: '2025-07-15', coverUrl: 'https://images.unsplash.com/photo-1662381523885-914182622e12?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { id: 2, title: '京都楓葉古寺巡禮', startDate: '2025-11-20', endDate: '2025-11-25', coverUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&q=80' },
            { id: 3, title: '探索冰島極光', startDate: '2026-01-05', endDate: '2026-01-12', coverUrl: 'https://plus.unsplash.com/premium_photo-1661926694528-a833cc729d54?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ];
    }

    //     抓自己發過的貼文(先用假資料合併後再改掉註解)
    	// try {
        // const postRes = await axios.get(`${API_BASE_URL}/api/members/${memberId}/posts`)
        // posts.value = postRes.data.map(item => ({
        //     id: item.id,
        //     title: item.title,
        //     postImage: item.post_image // Or adjust based on actual API response field
        // }));
    		//} catch (err) {
        //		console.warn('Failed to fetch user-created posts (can be ignored, will be replaced with real data after database merge)', err)
    		//	}

    		//try {
			  //     抓自己收藏過的貼文(先用假資料合併後再改掉註解)
        // const collectRes = await axios.get(`${API_BASE_URL}/api/members/${memberId}/collections`)
        // collectedPosts.value = collectRes.data.map(item => ({
        //     id: item.id,
        //     title: item.title,
        //     postImage: item.post_image // Or adjust based on actual API response field
        // }));
				//    } catch (err) {
				//        console.warn('Failed to fetch collected posts (can be ignored, will be replaced with real data after database merge)', err)
				//    }
				};

//初次載入抓一次
onMounted(fetchData)

//每次切換回來這頁也要抓一次（確保資料有更新）
watch(() => route.fullPath, fetchData)

const goToTravel = id => router.push(`/travel/${id}`)
const goToPost = id => router.push(`/community/post/${id}`) 


//測試用的貼文假資料，合併後改連資料庫
posts.value = [
    {
        id: 1,
        title: '台北兩日遊',
        postImage: 'https://via.placeholder.com/400x200?text=Trip',
        author: '旅行家A'
    },
    {
        id: 2,
        title: '高雄兩日遊',
        postImage: 'https://via.placeholder.com/400x200?text=Trip',
        author: '美食家B' 
    },  
];

collectedPosts.value = [
    {
        id: 1,
        title: '台中兩日遊',
        postImage: 'https://via.placeholder.com/400x200?text=Trip',
        author: '探險家C' 
    },
    {
        id: 2, 
        title: '花蓮兩日遊',
        postImage: 'https://via.placeholder.com/400x200?text=Trip',
        author: '攝影師D' 
    },
];



const navLinks = [
  { name: '行程安排', path: '/schedule' },
  { name: '探索', path: '/explore' },
	{ name: '社群', path: '/community' },
  { name: '評論', path: '/reviews' },
  { name: '關於我們', path: '/about' },
	];

const user = ref({
  name: 'yourName',
  bio: '這裡放自介',
});
</script>

<style scoped>
.nav-convex-effect {
		background-color: #A2A2A2;
    box-shadow:
      /* 整體外凸陰影 (浮起效果) */
      -6px -6px 12px rgba(255, 255, 255, 0.2),  /* 左上 */
      6px 6px 12px rgba(0, 0, 0, 0.3),           /* 右下 */
      -3px 0px 6px rgba(0, 0, 0, 0.1),           /* 左側 */
  
      /* Neumorphism 紋理 */
      inset 1.5px 1.5px 4px rgba(0, 0, 0, 0.1),     
      inset -1.5px -1.5px 4px rgba(255, 255, 255, 0.1); 
  
    transition: all 0.2s ease-in-out; 
  }
  
  
  /* .nav-convex-effect:hover { 
    box-shadow:
      /* hover 時整體外凸陰影微調 */
      -4px -4px 8px rgba(255, 255, 255, 0.15),
      4px 4px 8px rgba(0, 0, 0, 0.25),
      -1.5px 0px 4px rgba(0, 0, 0, 0.08),
  
      /* hover 時表面陰影紋理微調 
      inset 1px 1px 3px rgba(0, 0, 0, 0.08),
      inset -1px -1px 3px rgba(255, 255, 255, 0.08);
  
    transform: translateY(1px); 
  } */
	
	.main-convex-effect {
		/* background-color: #A2A2A2; */
		box-shadow:
    /* 整體外凸陰影 */
    -8px -8px 16px rgba(255, 255, 255, 0.2),  /* 左上 */
    8px 8px 16px rgba(0, 0, 0, 0.3),           /* 右下 */
    -4px 0px 8px rgba(0, 0, 0, 0.1),           /* 左側 */
    /* Neumorphism 紋理 */
    inset 2px 2px 5px rgba(0, 0, 0, 0.1),     
    inset -2px -2px 5px rgba(255, 255, 255, 0.1); 

    transition: all 0.2s ease-in-out;
	}
</style>