<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow text-center">
      <h1 class="text-2xl font-bold mb-4">升級為付費會員</h1>
      <p class="mb-6 text-gray-600">僅需支付 NT$30 元，即可建立更多行程</p>
      <div v-if="loading" class="text-green-500 font-medium">付款連結生成中，請稍候...</div>
      <div v-else-if="isPremium" class="text-blue-500 font-medium">您已經是付費會員！</div>
      <button
        v-if="!loading && !isPremium"
        @click="handlePayment"
        class="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded text-lg"
      >
        前往 LINE Pay 付款
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(false)
const isPremium = ref(false)
const token = localStorage.getItem('user_token')

const checkPremium = async () => {
  if (!token) {
    return
  }
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/linepay/check-status`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    isPremium.value = res.data?.isPremium
  } catch (err) {
    isPremium.value = false
  }
}

const handlePayment = async () => {
  if (!token) {
    alert('請先登入才能進行付款。')
    return
  }
  loading.value = true
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/linepay/request`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (res.data && res.data.url) {
      window.location.href = res.data.url
    } else {
      alert('無法獲取 Line Pay 付款連結，請稍後再試。')
    }
  } catch (err) {
    alert('付款初始化失敗，請檢查網路連線或稍後再試。')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkPremium()
})
</script>