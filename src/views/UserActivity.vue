<template>
    <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-4">動態追蹤</h2>
        <!--切換選單-->
        <div class="flex gap-4 mb-6">
            <button v-for="tab in tabs" :key="tab.key" @click="activeTab=tab.key" :class="['px-4 py-2 rounded-full border',activeTab === tab.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300']">{{ tab.label }}</button>
        </div>

        <!--卡片顯示區-->
        <div class="grid grid-cols-2 gap-4">
            <template v-if="activeTab === 'travels'">
                <div v-for="travel in travels" :key="travel.id" @click="goToTravel(travel.id)" class="bg-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer">
                    <img :src="travel.coverURL" @error="e => e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'" class="w-full h-60 object-cover rounded-t-lg" alt="行程預覽圖"/>
                    <div class="p-2">
                        <div class="font-semibold">{{ travel.title }}</div>
                        <div class="text-sm text-gray-500">{{ travel.startDate }} ~ {{ travel.endDate }}</div>
                    </div>
                </div>
            </template>

            <template v-else-if="activeTab === 'posts'">
                <div v-for="post in posts" :key="post.id" @click="goToPost(post.id)" class="bg-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer">
                    <img :src="post.coverImage" class="w-full h-60 object-cover rounded-t-lg" alt="貼文預覽圖" />
                    <div class="p-2">
                        <div class="font-semibold">{{ post.title }}</div>
                    </div>
                </div>
            </template>

            <template v-else-if="activeTab === 'collected'">
                <div v-for="collected in collectedPosts" :key="collected.id" @click="goToPost(collected.id)" class="bg-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer">
                    <img :src="collected.postImage" class="w-full h-60 object-cover rounded-t-lg" alt="貼文預覽圖" />
                    <div class="p-2">
                        <div class="font-semibold">{{ collected.title }}</div>
                    </div>
                </div>
            </template>
        </div>
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
]

//確認會員token

const fetchData = async () => {
    const token = localStorage.getItem('token')
    if(!token) {
        alert('請先登入會員')
        throw new Error('token 不存在')
    }
    const decoded = jwtDecode(token);
    const memberId = decoded.id;

    try {
        //抓自己發過的行程
        const travelRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/travelSchedule/user`,{
            headers: { Authorization: `Bearer ${token}`}
        })
        const schedules = travelRes.data.schedules;
          if (!Array.isArray(schedules)) {
        return;
        }
        travels.value = schedules.map(item => ({
            id: item.id,
            title: item.title,
            startDate: item.startDate?.slice(0, 10),
            endDate: item.endDate?.slice(0, 10),
            coverURL: item.coverURL
        }));
    } catch (err) {
    console.warn('取得行程失敗', err)
    }

    try {
        //抓自己發過的貼文
        const postRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/community-post/me`,{
            headers: {Authorization: `Bearer ${token}`} 
        })
        posts.value = postRes.data.posts.map(item => ({
            id: item.postId,
            title: item.scheduleTitle,
            coverImage: item.coverURL
        }));
    } catch (err) {
        console.warn('取得貼文失敗', err)
    }

    try {
            //抓自己收藏過的貼文
        const collectRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/favorites/user/${memberId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        collectedPosts.value = collectRes.data.map(item => ({
            id: item.postId,
            title: item.postTitle,
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
const goToPost = id => router.push(`/community/post/${id}`)



</script>