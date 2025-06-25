<template>
  <main class="pl-[100px] pt-[100px]">
    <h1 class="text-2xl font-bold mb-6">登入頁面</h1>

    <div
      v-if="showError"
      class="w-[300px] flex items-center gap-2 bg-red-100 text-red-800 border border-red-200 px-4 py-3 rounded-md mb-4"
    >
      <font-awesome-icon
        icon="exclamation-triangle"
        class="mr-2 mt-0.5 text-red-600"
      />
      <span class="text-sm">
        {{ errorMessage }}
      </span>
    </div>

    <form v-if="!isLoggedIn" @submit.prevent="login" class="space-y-6">
      <div>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="請輸入電子郵件"
          required
          class="mb-5 block w-[300px] rounded-md border border-gray-300 shadow-sm p-2"
        />
      </div>

      <div>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="請輸入密碼"
          required
          class="mb-5 block w-[300px] rounded-md border border-gray-300 shadow-sm p-2"
        />
      </div>

      <div class="flex justify-start gap-[20px] mt-[10px] w-[300px]">
        <button
          type="submit"
          class="w-[100px] bg-blue-200 text-black py-2 rounded transition"
        >
          登入
        </button>
      </div>
    </form>

    <RouterLink to="/signup">
      <button
        class="w-[100px] text-black py-2 rounded transition hover:text-[#0d4a87]"
      >
        我要註冊
      </button>
    </RouterLink>

    <div v-if="isLoggedIn" class="mt-6">
      <p class="text-blue-600 font-semibold mb-4">您已登入</p>
      <button
        @click="logout"
        class="bg-blue-200 text-black py-2 px-4 rounded transition"
      >
        登出
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const router = useRouter();
const TOKEN_NAME = "token";
const email = ref("");
const password = ref("");
const isLoggedIn = ref(false);
const showError = ref(false);
const errorMessage = ref("");
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/login/`;

const clearText = () => {
  email.value = "";
  password.value = "";
};

const login = async () => {
  if (email.value === "" || password.value === "") {
    showError.value = true;
    errorMessage.value = "請輸入 Email 和密碼";
    return;
  }
  const userData = {
    email: email.value,
    password: password.value,
  };

  try {
    const res = await axios.post(API_BASE_URL, userData);
    const token = res.data.token;
    localStorage.setItem(TOKEN_NAME, token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    isLoggedIn.value = true;
    showError.value = false;
    clearText();
    router.push("/");
  } catch (err) {
    showError.value = true;
    errorMessage.value =
      err.response?.data?.message || "登入失敗，請檢查郵件與密碼";
  }
};

const logout = async () => {
  const token = localStorage.getItem(TOKEN_NAME);
  if (!token) return;

  localStorage.removeItem(TOKEN_NAME);
  localStorage.removeItem("memberId");
  isLoggedIn.value = false;
  clearText();
};

onMounted(() => {
  const token = localStorage.getItem(TOKEN_NAME);
  showError.value = false;
  errorMessage.value = "";

  if (!token) {
    isLoggedIn.value = false;
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    if (exp > now) {
      isLoggedIn.value = true;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem(TOKEN_NAME);
      isLoggedIn.value = false;
      showError.value = false;
      errorMessage.value = "";
    }
  } catch (err) {
    console.error("Token 驗證失敗", err);
    localStorage.removeItem(TOKEN_NAME);
    isLoggedIn.value = false;
    showError.value = false;
    errorMessage.value = "";
  }
});
</script>
