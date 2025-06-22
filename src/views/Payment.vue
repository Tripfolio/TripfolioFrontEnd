<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow text-center">
      <h1 class="text-2xl font-bold mb-4">升級為付費會員</h1>
      <p class="mb-6 text-gray-600">僅需支付 NT$50 元，即可建立更多行程</p>
      <button
        @click="handlePayment"
        class="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded text-lg"
      >
        前往 LINE Pay 付款
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";

const handlePayment = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("請先登入");
    return;
  }

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/payment/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    window.location.href = res.data.url;
  } catch (err) {
    alert("付款初始化失敗，請稍後再試");
  }
};
</script>