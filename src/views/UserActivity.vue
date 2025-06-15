<template>
    <div class="max-w-screen-lg mx-auto p-6 bg-white rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-4">動態追蹤</h2>
        <!--切換選單-->
        <div class="flex gap-4 mb-6">
            <button v-for="tab in tabs" :key="tab.key" @click="activeTab=tab.key" :class="['px-4 py-2 rounded-full border',activeTab === tab.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300']">{{ tab.label }}</button>
        </div>

        <!--卡片顯示區-->
        <div class="grid grid-cols-2 gap-4">
            <template v-if="activeTab === 'travels'">
                <div v-for="travel in travels" :key="travel.id" @click="goToTravel(travel.id)" class="bg-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer">
                    <img :src="travel.coverUrl" class="w-full h-60 object-cover rounded-t-lg" alt="行程預覽圖"/>
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
    }

    //     抓自己發過的貼文(先用假資料合併後再改掉註解)
    // try {
    //     const postRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/members/${memberId}/posts`)
    //     posts.value = postRes.data.map(item => ({
    //         id: item.id,
    //         title: item.title,
    //         postImage: item.post_image
    //     }));
    // } catch (err) {
    //     console.warn('抓貼文失效，可忽略，等合併資料庫再開啟', err)
    // }

    // try {
    //     抓自己收藏過的貼文(先用假資料合併後再改掉註解)
    //     const collectRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/members/${memberId}/collections`)
    //     collectedPosts.value = collectRes.data.map(item => ({
    //         id: item.id,
    //         title: item.title,
    //         postImage: item.post_image
    //     }));
    // } catch (err) {
    //     console.warn('抓貼文失效，可忽略，等合併資料庫再開啟', err)
    // }
};

//初次載入抓一次
onMounted(fetchData)

//每次切換回來這頁也要抓一次（確保資料有更新）
watch(() => route.fullPath, fetchData)

const goToTravel = id => router.push(`/travel/${id}`)
const goToPost = id => router.push(`comunity/post/${id}`)


//測試用的貼文假資料，合併後改連資料庫
posts.value = [
  {
    id: 1,
    title: '台北兩日遊',
    postImage: 'https://via.placeholder.com/400x200?text=Trip'
  },

  {
    id: 2,
    title: '高雄兩日遊',
    postImage: 'https://via.placeholder.com/400x200?text=Trip'
  },  
];

collectedPosts.value = [
  {
    id: 1,
    title: '台中兩日遊',
    postImage: 'https://via.placeholder.com/400x200?text=Trip'
  },
    {
    id: 1,
    title: '花蓮兩日遊',
    postImage: 'https://via.placeholder.com/400x200?text=Trip'
  },
];


</script>