<template>
  <div class="post-form">
    <label>選擇行程</label>
    <select v-model="selectedScheduleId" @change="onScheduleChange">
      <option v-for="s in schedules" :key="s.id" :value="s.id">
        {{ s.title }}
      </option>
    </select>

    <label>貼文主圖</label>
    <input type="file" accept="image/*" @change="handleImageUpload" />
    <img v-if="previewImage" :src="previewImage" alt="預覽" width="200" />

    <label>貼文內容</label>
    <textarea v-model="content" rows="5" />

    <button @click="submitPost">送出貼文</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// 本地測畫面、功能用的
// localStorage.setItem("token", import.meta.env.VITE_JWT_TOKEN);

const schedules = ref([]);
const selectedScheduleId = ref(null);
const content = ref("");
const previewImage = ref(null);
const imageFile = ref(null);
const token = localStorage.getItem("token");

onMounted(async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/travelSchedule/user`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    schedules.value = res.data.schedules;
  } catch {
    alert("無法取得");
  }
});

function onScheduleChange() {
  const selected = schedules.value.find(
    (s) => s.id === selectedScheduleId.value
  );
  if (selected) {
    content.value = selected.description;
    previewImage.value = selected.coverURL;
  }
}

function handleImageUpload(e) {
  const file = e.target?.files?.[0];
  if (!file) return;

  const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeBytes = 3145728; 
  if (!acceptedTypes.includes(file.type) ||file.size > maxSizeBytes ) {

    alert("格式不支援或檔案太大。請上傳 JPG、PNG 或 WebP。檔案最高3MB");

    const selected = schedules.value.find(
      (s) => s.id === selectedScheduleId.value
    );
    if (selected) {
      previewImage.value = selected.coverURL || null;
      imageFile.value = null;
    }
    e.target.value = ""; 
    return;
  }

  imageFile.value = file;
  previewImage.value = URL.createObjectURL(file);
}


async function submitPost() {
  if (!selectedScheduleId.value || !content.value) {
    alert("選擇行程並填寫內容!!");
    return;
  }
  const formData = new FormData();
  formData.append("scheduleId", selectedScheduleId.value);
  formData.append("content", content.value);

  if (imageFile.value) {
    formData.append("cover", imageFile.value);
  } else if (previewImage.value?.startsWith("https://")) {
    formData.append("coverURL", previewImage.value);
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/community-posts`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    alert("success");
    router.push("/community");
  } catch (err) {
    alert("發佈貼文失敗，請稍後再試！");
  }
}
</script>
