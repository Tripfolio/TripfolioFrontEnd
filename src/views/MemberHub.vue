<template>
  <div class="bg-white min-h-screen p-4 sm:p-8 flex flex-col items-center">
    <main class="w-full max-w-4xl bg-[#686868] text-white rounded-2xl shadow-lg overflow-hidden">

      <div class="bg-[#A2A2A2] text-white shadow-md p-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold">會員中心</h2>
        <div class="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-gray-300">
          <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <img class="w-24 h-24 rounded-full border-2 border-blye-200 object-cover" src="https://images.unsplash.com/photo-1529570058547-733204bf87e5?q=80&w=1362&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="使用者頭像">
          </div>  
        </div>
      </div>
      
      <!-- 自我介紹 -->
      <div class="p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <img class="w-24 h-24 rounded-full border-4 border-gray-500 object-cover" src="https://images.unsplash.com/photo-1529570058547-733204bf87e5?q=80&w=1362&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="使用者頭像">
          <div class="flex-grow flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div>
              <h1 class="text-3xl font-bold">{{ user.name }}</h1>
              <div class="flex gap-4 mt-2 text-gray-400 justify-center sm:justify-start">
                <!-- 編輯按鈕觸發模態視窗顯示 -->
                <a href="#" @click.prevent="showMemberProfileModal = true" class="hover:text-white flex items-center gap-1 transition-colors duration-200">
                  <font-awesome-icon :icon="['fas', 'pen-to-square']" /> 編輯
                </a>
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
        
        <!--卡片顯示區-->
        <div class="mt-6"> 
          <div v-if="activeTab === 'travels'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="travel in travels" :key="travel.id" @click="goToTravel(travel.id)" class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group">
              <div class="relative">
                <img :src="travel.coverURL" @error="e => e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'" class="w-full h-60 object-cover rounded-t-lg" alt="行程預覽圖"/>
                <div class="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex justify-end gap-2">
                    <!-- <button class="w-8 h-8 rounded-full bg-gray-800 bg-opacity-70 flex items-center justify-center hover:bg-opacity-100">⋯</button>
                    <button class="w-8 h-8 rounded-full bg-gray-800 bg-opacity-70 flex items-center justify-center hover:bg-opacity-100">🔗</button> -->
                  </div>
                </div>
              </div>
              <div class="p-4">
                <div class="font-semibold text-lg">{{ travel.title }}</div>
              </div>
            </div>
          </div>

          <!-- 我建立的行程 -->
          <div v-else-if="activeTab === 'my_posts'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="post in posts" :key="post.id" @click="goToPost(post.id)" class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group">
              <img :src="post.coverImage" class="w-full h-60 object-cover rounded-t-lg" alt="貼文預覽圖" />
              <div class="p-4">
                <div class="font-semibold text-lg">{{ post.title }}</div>
              </div>
            </div>
          </div>

          <!-- 我收藏的貼文 -->
          <div v-else-if="activeTab === 'collected'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="collected in collectedPosts" :key="collected.id" @click="goToPost(collected.id)" class="bg-gray-600 rounded-xl overflow-hidden cursor-pointer group">
              <img :src="collected.postImage" class="w-full h-60 object-cover rounded-t-lg" alt="貼文預覽圖" />
              <div class="p-4">
                <div class="font-semibold text-lg">{{ collected.title }}</div>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab === 'notifications'">
            <div class="bg-gray-600 rounded-xl p-8 text-center">
              <h3 class="text-xl font-semibold mb-4">通知設定</h3>
              <p class="text-gray-400">通知設定</p>
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
import { jwtDecode } from "jwt-decode";
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

//確認會員token (切版完開啟註解)
const fetchData = async () => {
  // const token = localStorage.getItem('token')
  //   if(!token) {
  //       alert('請先登入會員')
  //       throw new Error('token 不存在')
  //   }

  //   const decoded = jwtDecode(token);
  //   const memberId = decoded.id;
  //   const username = decoded.name;

  try {
    //篩選自己發過的行程
    const postRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/travelSchedule/user`,{
      headers: { Authorization: `Bearer ${token}`}
    })
    posts.value = postRes.data.posts
      .filter(item => item.id === memberId)
      .map(item => ({
        id: item.id,
        title: item.title || '未命名貼文',
        coverImage: item.imageUrl
      }));
  } catch (err) {
      console.warn('取得貼文失敗', err);
      travels.value = [
        { id: 1, title: '沖繩海島慢活之旅', startDate: '2025-07-10', endDate: '2025-07-15', coverUrl: 'https://images.unsplash.com/photo-1662381523885-914182622e12?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 2, title: '京都楓葉古寺巡禮', startDate: '2025-11-20', endDate: '2025-11-25', coverUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&q=80' },
        { id: 3, title: '探索冰島極光', startDate: '2026-01-05', endDate: '2026-01-12', coverUrl: 'https://plus.unsplash.com/premium_photo-1661926694528-a833cc729d54?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      ];
  }

  try {
    //篩選自己收藏過的貼文
    const collectRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/favorites/user/${memberId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    collectedPosts.value = collectRes.data.map(item => ({
      id: item.postId,
      title: item.postTitle || '未命名貼文',
      postImage: item.postImageUrl
    }));
  } catch (err) {
    console.warn('抓貼文失效', err)
  }
};

//初始化與返回頁面重新載入
onMounted(fetchData)
watch(() => route.fullPath, fetchData)

const goToTravel = id => router.push({ path: `/schedule/${id}`, query: { from: 'tracker' } })
const goToPost = (id) => {
  router.push({ path: '/community', query: { postId: id } });
};


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