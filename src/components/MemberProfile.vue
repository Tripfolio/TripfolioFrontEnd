<template>
  <div
    class="bg-white rounded-2xl shadow-2xl w-full max-w-screen-lg mx-auto py-6 relative flex flex-col h-auto max-h-[80vh]"
    style="background-color: rgba(128, 128, 128, 0.5); border-radius: 40px"
  >
    <!-- 關閉按鈕 -->
    <button
      @click="$emit('close-modal')"
      class="absolute top-6 left-6 hover:text-white text-3xl font-bold flex items-center justify-center w-10 h-10 rounded-full bg-gray-400 bg-opacity-70 hover:bg-opacity-100 transition-all duration-200"
    >
      &times;
    </button>

    <div class="flex-grow overflow-y-auto px-6 pb-4 scrollable-content">
      <h2 class="text-2xl font-bold mb-6 text-center text-white">
        編輯個人資料
      </h2>
      <!-- 大頭貼區域 -->
      <div class="flex flex-col items-center mb-4">
        <div class="relative w-32 h-32">
          <img
            v-if="!showCropper && (previewUrl || profileData.avatar)"
            :src="previewUrl || profileData.avatar"
            class="w-full h-full rounded-full object-cover border-4 border-gray-400"
            alt="大頭貼"
          />
          <label
            for="avatar-upload"
            class="avatar-upload absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-2 cursor-pointer hover:bg-gray-100 shadow-md"
            title="更換大頭貼"
          >
            <font-awesome-icon
              :icon="['fas', 'pen-to-square']"
              class="text-gray-700 text-lg"
            />
          </label>
          <input
            type="file"
            id="avatar-upload"
            @change="uploadAvatar"
            accept="image/*"
            class="hidden"
          />
        </div>
        <div v-if="showCropper" class="mt-4 flex flex-col items-center">
          <Cropper
            ref="cropperRef"
            :src="previewUrl"
            :stencil-props="{ aspectRatio: 1 }"
            class="w-40 h-40 rounded-full mb-4 border-2 border-gray-300"
          />
          <button
            @click="saveAvatar"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-colors duration-200"
          >
            儲存大頭貼
          </button>
        </div>
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="w-full max-w-xs mx-auto">
          <label
            for="name"
            class="block text-white text-sm font-semibold mb-1 ml-4"
            >姓名</label
          >
          <input
            id="name"
            type="text"
            v-model="profileData.name"
            placeholder="原姓名"
            class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        <div class="w-full max-w-xs mx-auto">
          <label
            for="phone"
            class="block text-white text-sm font-semibold mb-1 ml-4"
            >手機</label
          >
          <input
            id="phone"
            type="tel"
            v-model="profileData.phone"
            placeholder="原手機"
            class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <p v-if="phoneError" class="text-red-400 text-xs mt-1 ml-4">
            {{ phoneError }}
          </p>
        </div>
        <!-- 密碼修改區塊 -->
        <div class="w-full max-w-xs mx-auto pt-4">
          <label class="block text-white text-sm font-semibold mb-1 ml-4"
            >更改密碼？</label>
          <div class="space-y-4">
            <!-- 舊密碼 -->
            <div class="relative">
              <input
                :type="showOld ? 'text' : 'password'"
                v-model="passwordData.oldPassword"
                placeholder="原密碼"
                class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <span
                @click="showOld = !showOld"
                class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-white"
              >
                <font-awesome-icon
                  :icon="showOld ? ['fas', 'eye-slash'] : ['fas', 'eye']"
                />
              </span>
            </div>
            <!-- 新密碼 -->
            <div class="relative">
              <input
                :type="showNew ? 'text' : 'password'"
                v-model="passwordData.newPassword"
                placeholder="新密碼"
                class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <span
                @click="showNew = !showNew"
                class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-white"
              >
                <font-awesome-icon
                  :icon="showNew ? ['fas', 'eye-slash'] : ['fas', 'eye']"
                />
              </span>
              <p v-if="passwordError" class="text-red-400 text-xs mt-1 ml-4">
                {{ passwordError }}
              </p>
            </div>
            <!-- 再次輸入新密碼 -->
            <div class="relative">
              <input
                :type="showConfirm ? 'text' : 'password'"
                v-model="passwordData.confirmPassword"
                placeholder="再次輸入新密碼"
                class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <span
                @click="showConfirm = !showConfirm"
                class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-white"
              >
                <font-awesome-icon
                  :icon="showConfirm ? ['fas', 'eye-slash'] : ['fas', 'eye']"
                />
              </span>
            </div>
          </div>
        </div>
        <div class="flex justify-center pt-4">
          <button
            type="submit"
            class="px-8 py-3 bg-gray-400 bg-opacity-70 hover:bg-black text-white font-bold rounded-full shadow-lg transition-all duration-200"
          >
            完成
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import dayjs from "dayjs";

const emit = defineEmits(["close-modal"]);

const token = localStorage.getItem("token");
if (!token) {
  alert("請先登入會員");
  throw new Error("token 不存在");
}

const profileData = ref({
  name: "",
  gender: "",
  phone: "",
  birthday: "",
  avatar: "",
});

//元件掛載時載入會員資料
onMounted(async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;

    //生日時區
    if (data.birthday) {
      data.birthday = dayjs(data.birthday).format("YYYY-MM-DD");
    }

    profileData.value = {
      ...data,
      avatar: data.avatar || "",
    };
  } catch (error) {}
});

const avatarFile = ref(null);
const previewUrl = ref(profileData.value.avatar);
const cropperRef = ref(null);
const showCropper = ref(false);

//上傳大頭貼裁切預覽
const uploadAvatar = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  avatarFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  showCropper.value = true;
};

//儲存大頭貼傳至後端
const saveAvatar = async () => {
  const canvas = cropperRef.value.getResult().canvas;
  if (!canvas) {
    alert("請先裁切圖片");
    return;
  }

  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("avatar", blob, avatarFile.value.name);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile/upload-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert("大頭貼上傳成功");

      const profileRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      profileData.value = profileRes.data;
      previewUrl.value = "";
      profileData.value.avatar = "";
      showCropper.value = false;
      emit("close-modal"); // 成功後關閉
    } catch (err) {
      alert("上傳失敗");
    }
  }, "image/jpeg");
};

const phoneError = ref("");

//手機號碼格式檢查
watch(
  () => profileData.value.phone,
  (newPhone) => {
    const phoneNumber = /^09\d{8}$/;
    if (!phoneNumber.test(newPhone)) {
      phoneError.value = "手機格式錯誤，範例：0912345678";
    } else {
      phoneError.value = "";
    }
  },
);

//儲存會員資料送去資料庫
const saveProfile = async () => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/profile`,
      profileData.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    alert("儲存成功");
    profileData.value = res.data;
    emit("close-modal");
  } catch (err) {
    alert("儲存失敗");
  }
};

const passwordData = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordError = ref("");
const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

//新密碼格式檢查
watch(
  () => passwordData.value.newPassword,
  (newPwd) => {
    const hasMinLength = newPwd.length >= 8;
    const hasLetter = /[A-Za-z]/.test(newPwd);
    const hasNumber = /\d/.test(newPwd);
    const isSameAsName = newPwd === profileData.value.name;

    if (!hasMinLength) {
      passwordError.value = "密碼至少需8個字元";
    } else if (!hasLetter) {
      passwordError.value = "密碼需包含英文字母";
    } else if (!hasNumber) {
      passwordError.value = "密碼需包含數字";
    } else if (isSameAsName) {
      passwordError.value = "密碼不可與姓名相同";
    } else {
      passwordError.value = "";
    }
  },
);

//修改密碼送到後端
const changePassword = async () => {
  if (
    !passwordData.value.oldPassword ||
    !passwordData.value.newPassword ||
    !passwordData.value.confirmPassword
  ) {
    alert("請填寫所有欄位");
    return;
  }
  if (passwordError.value) {
    alert(passwordError.value);
    return;
  }
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    alert("新密碼輸入不一致，請重新輸入");
    return;
  }

  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/profile/users/password`,
      {
        oldPassword: passwordData.value.oldPassword,
        newPassword: passwordData.value.newPassword,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    alert("密碼修改成功");

    passwordData.value.oldPassword = "";
    passwordData.value.newPassword = "";
    passwordData.value.confirmPassword = "";
  } catch (err) {
    const errorMessage = err.response?.data?.error || "舊密碼錯誤";
    alert(errorMessage);
  }
};
</script>

<style scoped>
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}
.scrollable-content::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    border: 2px solid rgba(128, 128, 128, 0.5); 
}
</style>