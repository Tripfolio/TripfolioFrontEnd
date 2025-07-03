<template>
  <div class="flex justify-center items-center h-screen">
    <div class="text-lg text-gray-600">正在驗證共享連結...</div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const token = route.params.token;

const checkShareToken = async () => {
  const loginToken = localStorage.getItem("token");
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/tripShares/check/${token}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${loginToken}` },
      withCredentials: true,
    });

    const tripId = res.data.tripId;
    router.replace("/schedule"); //需確認路由
  } catch (err) {
    if (err.response?.status === 403) {
      alert("此分享連結已過期");
    } else {
      alert("此分享連結無效或已過期");
      router.replace("/schedule"); //需確認路由
    }
  }
};

checkShareToken();
</script>
