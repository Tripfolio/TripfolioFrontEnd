<template>
  <div class="bg-white min-h-screen p-4 sm:p-8 flex flex-col items-center">
    <main v-if="profileData" class="w-full max-w-4xl bg-[#686868] text-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300">

      <div class="bg-[#A2A2A2] text-white shadow-md p-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold">會員中心</h2>
      </div>
      
      <div class="p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <img class="w-24 h-24 rounded-full border-4 border-gray-500 object-cover" :src="profileData.avatar" alt="使用者頭像">
          <div class="flex-grow flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div>
              <h1 class="text-3xl font-bold">{{ profileData.name }}</h1>
              <div class="flex gap-4 mt-2 text-gray-400 justify-center sm:justify-start">
                <!-- 編輯按鈕視窗顯示 -->
                <a href="#" @click.prevent="showMemberProfile = true" class="hover:text-white flex items-center gap-1 transition-colors duration-200">
                  <font-awesome-icon :icon="['fas', 'pen-to-square']" /> 編輯
                </a>
              </div>
            </div>
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
    <!-- MemberProfile 視窗 -->
    <div v-if="showMemberProfile" class="fixed inset-0 bg-opacity-60 backdrop-blur-xs flex items-center justify-center z-50 overflow-auto p-4">
      <div>
        <MemberProfile 
          @close-modal="showMemberProfile = false" 
          @profile-updated="handleProfileUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import MemberProfile from '@/components/MemberProfile.vue';

const router = useRouter()
const route = useRoute()

const showMemberProfile = ref(false);
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

const checkLoginandRedirect = () => {
  const token = localStorage.getItem('token')
    if(!token) {
        alert('請先登入會員')
        router.push({ path: '/login', query: { redirect: route.fullPath } });
        return false;
    }
    return true;
};


//確認會員token
const fetchData = async () => {
  if (!checkLoginandRedirect()) {
    return;
  }

  const token = localStorage.getItem('token')

    const decoded = jwtDecode(token);
    const memberId = decoded.id;
    const username = decoded.name;

  try {
//   // 會員中心獲取使用者基本資料
    const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    profileData.value.name = userRes.data.name || '';
    profileData.value.avatar = userRes.data.avatar || ''; // 更新頭像 URL
    } catch (err) {
      console.error('取得使用者資料失敗', err);
  }



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

const handleProfileUpdate = () => {
  fetchData(); // 重新執行 fetchData 以更新 profileData
}

//初始化與返回頁面重新載入
onMounted(fetchData)
watch(() => route.fullPath, fetchData)

const goToTravel = id => router.push({ path: `/schedule/${id}`, query: { from: 'tracker' } })
const goToPost = (id) => {
  router.push({ path: '/community', query: { postId: id } });
};



</script>

<style scoped>
</style>
