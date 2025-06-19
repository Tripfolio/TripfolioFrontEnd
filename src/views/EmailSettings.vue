<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Email 通知設定</h2>
    <div v-if="loading">載入中...</div>
    <div v-else>
      <div
        v-for="(_value, key) in preferences"
        :key="key"
        class="flex items-center justify-between py-2 border-b"
      >
        <span>{{ labels[key] }}</span>
        <input type="checkbox" v-model="preferences[key]" />
      </div>
      <button
        @click="savePreferences"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        儲存設定
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const preferences = ref({
  onRegister: true,
  onLogin: true,
  onLoginfail: true,
  onVerify: true,
  onComment: true,
  onLike: true,
  onBookmark: true,
  onShare: true,
  onCustomerReply: true,
});

const labels = {
  onRegister: "註冊成功",
  onLogin: "登入成功",
  onLoginfail: "帳號登入異常",
  onVerify: "信箱驗證提醒",
  onComment: "貼文被留言",
  onLike: "貼文被按讚",
  onBookmark: "貼文被收藏",
  onShare: "貼文被分享",
  onCustomerReply: "客服回覆",
};

const loading = ref(false);

const fetchPreferences = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("尚未登入，無法載入偏好設定。");
      return; // 提早結束
    }

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/email-preferences`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    preferences.value = data;
  } catch (err) {
    alert("載入偏好設定失敗。");
  } finally {
    loading.value = false;
  }
};

const savePreferences = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("尚未登入，無法儲存設定。");
      return;
    }

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/email-preferences`,
      { preferences: preferences.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    alert("偏好設定已更新！");
  } catch (err) {
    alert("儲存失敗，請稍後再試。");
  }
};

onMounted(() => {
  fetchPreferences();
});
</script>
