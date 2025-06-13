<template>
  <div class="flex h-screen">
    <!-- 左側：可放地圖或其他內容 -->
    <div class="w-2/3 bg-gray-50 p-4">
      <h1 class="text-xl font-bold">這裡是左側地圖/內容</h1>
    </div>

    <!-- 右側：行程列表區 -->
    <div class="w-1/3 h-full overflow-y-auto bg-white p-4 border-l">
      <div class="flex justify-end mb-4">
        <button @click="handleOpenForm" class="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg shadow">建立行程</button>
      </div>

      <!-- 行程卡片列表 -->
      <div v-if="schedules.length > 0" class="space-y-4">
        <div v-for="(item, index) in schedules" :key="index" @click="goToEdit(item.id)" class="bg-white rounded-xl shadow p-4 relative cursor-pointer hover:ring-2 hover:ring-blue-300 transition">
          <img :src="item.coverURL" class="w-full h-60 object-cover rounded-xl mb-3" alt="行程封面照">
          <h2 class="text-xl font-bold mb-1">{{ item.title }}</h2>
          <p class="text-gray-600 text-sm">{{ item.startDate }} - {{ item.endDate }}</p> 
          <p class="text-gray-500 text-sm mt-2">{{ item.description }}</p>

        <!--刪除按鈕-->
        <button @click.stop="deleteSchedule(item.id)" title="刪除行程" class="absolute bottom-2 right-2 text-gray-400 hover:text-red-500 text-xl">刪除行程</button>
        </div>
      </div>

      <div v-else class="text-gray-400 text-center">尚未建立任何行程</div>
    </div>

    <!-- 彈出表單 -->
    <div v-if="showForm" class="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-xl rounded-2xl p-6 shadow-lg relative">
        <TravelSchedule @close="handleCloseForm" />
        <button @click="handleCloseForm"></button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import TravelSchedule from '@/components/TravelSchedule.vue';
import axios from 'axios';

const router = useRouter();
const showForm = ref(false);
const schedules = ref([]);

//取得所有行程列表
const fetchSchedules = async () => {
  const token = localStorage.getItem('token')
  if(!token) return

  try {
    const res = await axios.get("http://localhost:3000/api/travelSchedule", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    schedules.value = res.data.schedules
  } catch (err) {
    console.error("行程載入失敗", err)
  }
};


//建立行程時檢查是否登入
const handleOpenForm = () => {
    const token = localStorage.getItem('token')
    if(!token) {
        alert('請先登入會員')
        return
    }
    showForm.value = true
};


//表單關閉後刷新行程列表
const handleCloseForm = () => {
  showForm.value = false
  fetchSchedules()
};


//首次載入取得行程
onMounted(() => {
  fetchSchedules()
});


//點卡片跳轉至編輯頁
const goToEdit = (id) => {
  router.push(`/schedule/${id}`)
};


//刪除行程
const deleteSchedule = async(id) => {
  const confirmDelete = confirm("確定刪除這個行程嗎?")
  if(!confirmDelete) return

  const token = localStorage.getItem('token')

  try{
    await axios.delete(`http://localhost:3000/api/travelSchedule/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    schedules.value = schedules.value.filter(s => s.id!== id)
    alert("刪除成功")
  } catch (err) {
    console.error("刪除失敗", err)
    alert("刪除失敗，請稍後再試")
  }
};

</script>