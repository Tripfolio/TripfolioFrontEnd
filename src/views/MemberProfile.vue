<template>
  <div class="solo-card-style rounded-2xl p-4 max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">資料修改</h2>

    <div class="flex flex-col items-center mb-4">
      <div class="relative w-40 h-40">
        <img
          v-if="!showCropper && (previewUrl || profileData.avatar)"
          :src="previewUrl || profileData.avatar"
          class="w-full h-full rounded-full object-cover border border-gray-300"
          alt="大頭貼"
        />
        <label
          for="avatar-upload"
          class="avatar-upload absolute bottom-2 right-2 bg-white border border-gray-300 rounded-full p-2 cursor-pointer hover:bg-gray-100 shadow-md"
          title="更換大頭貼"
          ><font-awesome-icon :icon="['fas', 'pen-to-square']"
        /></label>
        <input
          type="file"
          id="avatar-upload"
          @change="uploadAvatar"
          accept="image/*"
          class="hidden"
        />
      </div>
    </div>
    <div
      v-if="showCropper"
      class="absolute top-0 left-0 w-full h-full bg-white/80 flex flex-col items-center justify-center z-50"
    >
      <Cropper
        ref="cropperRef"
        :src="previewUrl"
        :stensil-props="{ aspectRatio: 1 }"
        class="w-40 h-40 rounded-full"
      />
      <button @click="saveAvatar" class="w-24 bg-sky-500/50 mt-2">
        儲存大頭貼
      </button>
    </div>

    <form @submit.prevent="saveProfile">
      <span>名稱：</span>
      <input
        type="text"
        v-model="profileData.name"
        placeholder="名稱"
        class="border-2 border-solid"
      />
      <span>性別：</span>
      <select
        name=""
        id=""
        v-model="profileData.gender"
        class="border-2 border-solid"
      >
        <option value="male">男</option>
        <option value="female">女</option>
      </select>
      <div>
        <span>手機號碼：</span>
        <input
          type="tel"
          v-model="profileData.phone"
          placeholder="手機號碼"
          class="border-2 border-solid"
        />
        <p v-if="phoneError" style="color: red">{{ phoneError }}</p>
      </div>
      <span>生日：</span>
      <input
        type="date"
        v-model="profileData.birthday"
        class="border-2 border-solid"
      />
      <button type="submit" class="w-24 bg-sky-500/50">儲存會員資料</button>
    </form>

    <h2>密碼修改</h2>
    <form @submit.prevent="changePassword">
      <div>
        <input
          :type="showOld ? 'text' : 'password'"
          v-model="passwordData.oldPassword"
          placeholder="舊密碼"
          class="border-2 border-solid"
        />
        <span @click="showOld = !showOld">
          <font-awesome-icon :icon="showOld ? 'fa-eye-slash' : 'fa-eye'" />
        </span>
      </div>
      <div>
        <input
          :type="showNew ? 'text' : 'password'"
          v-model="passwordData.newPassword"
          placeholder="新密碼"
          class="border-2 border-solid"
        />
        <span @click="showNew = !showNew">
          <font-awesome-icon :icon="showNew ? 'fa-eye-slash' : 'fa-eye'" />
        </span>
        <p>需輸入8位以上字元，密碼需包含數字+英文</p>
        <p v-if="passwordError" style="color: red">{{ passwordError }}</p>
      </div>
      <div>
        <input
          :type="showConfirm ? 'text' : 'password'"
          v-model="passwordData.confirmPassword"
          placeholder="再次輸入新密碼"
          class="border-2 border-solid"
        />
        <span @click="showConfirm = !showConfirm">
          <font-awesome-icon :icon="showConfirm ? 'fa-eye-slash' : 'fa-eye'" />
        </span>
      </div>
      <button type="submit" class="w-24 bg-sky-500/50">送出修改密碼</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits } from "vue";
import axios from "axios";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import dayjs from "dayjs";

const emit = defineEmits(["close-modal"]);
function closeModal() {
  emit("close-modal");
}

//確認會員token
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
  } catch (error) {
    // eslint-disable-next-line no-empty
  }
});

const avatarFile = ref(null);
const previewUrl = ref("");
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
      showCropper.value = false;

      emit('update-profile');
      
    } catch (err) {

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
.homepage-bg {
  background-image:
    radial-gradient(#999 1px, transparent 1px),
    linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size:
    40px 40px,
    40px 40px,
    40px 40px;
  background-position:
    20px 20px,
    0px 0px,
    0px 0px;
  background-color: white;
}
</style>
