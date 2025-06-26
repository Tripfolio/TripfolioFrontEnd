<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">

    <main class="flex-grow flex items-center justify-center p-6">
      <div class="relative bg-white rounded-lg shadow-md w-full max-w-4xl h-[70vh] flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <button @click="goBack" class="text-gray-600 hover:text-gray-900 flex items-center text-lg">
            <svg class="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h2 class="text-xl font-semibold text-gray-800">建立貼文</h2>
          <button @click="nextStep" class="text-blue-600 hover:text-blue-800 font-medium text-lg">下一步</button>
        </div>

        <div
          class="flex-grow flex flex-col items-center justify-center p-6 bg-gray-200 text-gray-600 text-center cursor-pointer relative overflow-hidden"
          @click="fileInput.click()" >
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            ref="fileInput"
            class="hidden"
          />

          <div v-if="!previewImage" class="flex flex-col items-center justify-center">
            <svg class="w-20 h-20 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p class="text-xl">選擇檔案</p>
          </div>
          <div v-else class="relative w-full h-full flex items-center justify-center">
            <img :src="previewImage" alt="預覽圖片" class="max-w-full max-h-full object-contain rounded" />
            <button @click.stop="clearImage" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center">
              X
            </button>
          </div>
        </div>

        <div>
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
          <textarea style="resize: both;" v-model="content" rows="5"></textarea>

          <button @click="submitPost">送出貼文</button>
        </div>
      </div>
    </main>

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
const fileInput = ref(null); 
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

// 假設這些函式已經存在於您的 script 中，因為 template 需要調用它們
const goBack = () => {
  router.back();
};

const nextStep = async () => {
  // 這裡假設 nextStep 會觸發 submitPost
  await submitPost();
};

const clearImage = () => {
  previewImage.value = null;
  imageFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};


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
