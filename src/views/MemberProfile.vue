<template>
  <div
    class="solo-card-style rounded-2xl p-6 sm:p-8 w-full max-w-xl text-gray-800 space-y-6 max-h-[80vh] overflow-y-auto"
  >
    <!-- 標題 -->
    <h2 class="text-2xl font-semibold text-center text-white">
      {{ $t("memberProfile.updateProfile") }}
    </h2>

    <!-- 頭像區塊 -->
    <div class="flex justify-center">
      <div class="relative w-24 h-24">
        <img
          v-if="!showCropper && (previewUrl || profileData.avatar)"
          :src="previewUrl || profileData.avatar"
          class="w-full h-full rounded-full object-cover border-4 border-gray-200"
          alt="大頭貼"
        />
        <label
          for="avatar-upload"
          class="absolute bottom-1 right-1 bg-white border rounded-full p-2 cursor-pointer shadow hover:bg-gray-100"
          :title="$t('memberProfile.avatarUpload')"
        >
          <font-awesome-icon :icon="['fas', 'pen-to-square']" />
        </label>
        <input
          type="file"
          id="avatar-upload"
          @change="uploadAvatar"
          accept="image/*"
          class="hidden"
        />
      </div>
    </div>

    <!-- 裁切器 -->
    <div
      v-if="showCropper"
      class="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50"
    >
      <Cropper
        ref="cropperRef"
        :src="previewUrl"
        :stensil-props="{ aspectRatio: 1 }"
        class="w-40 h-40 rounded-full"
      />
      <button
        @click="saveAvatar"
        class="mt-4 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
      >
        {{ $t("memberProfile.saveAvatarSuccess") }}
      </button>
    </div>

    <!-- 基本資料表單 -->
    <form @submit.prevent="saveProfile" class="space-y-2">
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block font-medium mb-1">{{
            $t("memberProfile.name")
          }}</label>
          <input
            type="text"
            v-model="profileData.name"
            class="w-full border border-gray-300 rounded px-3 py-2"
            :placeholder="$t('memberProfile.namePlaceholder')"
          />
        </div>

        <div>
          <label class="block font-medium mb-1">{{
            $t("memberProfile.gender")
          }}</label>
          <select
            v-model="profileData.gender"
            class="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="male">{{ $t("memberProfile.male") }}</option>
            <option value="female">{{ $t("memberProfile.female") }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block font-medium mb-1">{{
          $t("memberProfile.phone")
        }}</label>
        <input
          type="tel"
          v-model="profileData.phone"
          class="w-full border border-gray-300 rounded px-3 py-2"
          :placeholder="$t('memberProfile.phonePlaceholder')"
        />
        <p v-if="phoneError" class="text-red-500 text-sm mt-1">
          {{ phoneError }}
        </p>
      </div>

      <div>
        <label class="block font-medium mb-1">{{
          $t("memberProfile.birthday")
        }}</label>
        <input
          type="date"
          v-model="profileData.birthday"
          class="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div class="text-center">
        <button
          type="submit"
          class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {{ $t("memberProfile.saveProfileBtn") }}
        </button>
      </div>
    </form>

    <!-- 密碼區 -->
    <div>
      <h2 class="text-xl font-bold mt-6 mb-4 text-center">
        {{ $t("memberProfile.passwordSectionTitle") }}
      </h2>
      <form @submit.prevent="changePassword" class="space-y-4">
        <div class="relative">
          <input
            :type="showOld ? 'text' : 'password'"
            v-model="passwordData.oldPassword"
            class="w-full border border-gray-300 rounded px-3 py-2"
            :placeholder="$t('memberProfile.oldPasswordPlaceholder')"
          />
          <span
            class="absolute right-3 top-3 text-gray-500 cursor-pointer"
            @click="showOld = !showOld"
          >
            <font-awesome-icon :icon="showOld ? 'fa-eye-slash' : 'fa-eye'" />
          </span>
        </div>

        <div class="relative">
          <input
            :type="showNew ? 'text' : 'password'"
            v-model="passwordData.newPassword"
            class="w-full border border-gray-300 rounded px-3 py-2"
            :placeholder="$t('memberProfile.newPasswordPlaceholder')"
          />
          <span
            class="absolute right-3 top-3 text-gray-500 cursor-pointer"
            @click="showNew = !showNew"
          >
            <font-awesome-icon :icon="showNew ? 'fa-eye-slash' : 'fa-eye'" />
          </span>
          <p class="text-sm text-gray-500 mt-1">
            {{ $t("memberProfile.passwordMinLength") }}
          </p>
          <p v-if="passwordError" class="text-red-500 text-sm">
            {{ passwordError }}
          </p>
        </div>

        <div class="relative">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="passwordData.confirmPassword"
            class="w-full border border-gray-300 rounded px-3 py-2"
            :placeholder="$t('memberProfile.confirmPasswordPlaceholder')"
          />
          <span
            class="absolute right-3 top-3 text-gray-500 cursor-pointer"
            @click="showConfirm = !showConfirm"
          >
            <font-awesome-icon
              :icon="showConfirm ? 'fa-eye-slash' : 'fa-eye'"
            />
          </span>
        </div>

        <div class="text-center">
          <button
            type="submit"
            class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            {{ $t("memberProfile.changePasswordBtn") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits } from "vue";
import axios from "axios";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import dayjs from "dayjs";

const emit = defineEmits(["close-modal", "profile-updated"]);

//確認會員token
const token = localStorage.getItem("token");
if (!token) {
  alert(t("memberProfile.loginFirst"));
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
      alert(t("memberProfile.saveAvatarSuccess"));

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

      emit("update-profile");
    } catch (err) {}
  }, "image/jpeg");
};

const phoneError = ref("");

//手機號碼格式檢查
watch(
  () => profileData.value.phone,
  (newPhone) => {
    const phoneNumber = /^09\d{8}$/;
    if (!phoneNumber.test(newPhone)) {
      phoneError.value = $t("memberProfile.phoneError");
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
    alert(t("memberProfile.saveProfileSuccess"));
    profileData.value = res.data;
    emit("profile-updated", {
      name: res.data.name,
      avatar: res.data.avatar || "",
    });
  } catch (err) {
    alert(t("memberProfile.saveProfileFailure"));
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
      passwordError.value = $t("memberProfile.passwordMinLength");
    } else if (!hasLetter) {
      passwordError.value = $t("memberProfile.passwordRequiresLetter");
    } else if (!hasNumber) {
      passwordError.value = $t("memberProfile.passwordRequiresNumber");
    } else if (isSameAsName) {
      passwordError.value = $t("memberProfile.passwordNoMatchName");
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
    alert(t("memberProfile.fillAllFields"));
    return;
  }
  if (passwordError.value) {
    alert(passwordError.value);
    return;
  }
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    alert(t("memberProfile.passwordMismatch"));
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
    alert(t("memberProfile.passwordChangedSuccess"));

    passwordData.value.oldPassword = "";
    passwordData.value.newPassword = "";
    passwordData.value.confirmPassword = "";
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || $t("memberProfile.oldPasswordError");
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
