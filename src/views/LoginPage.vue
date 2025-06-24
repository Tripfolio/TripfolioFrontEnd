<template>
  <main class="px-4 py-8 md:px-10 md:py-12 lg:px-24 lg:py-16">
    <h1 class="text-3xl font-extrabold mb-8 text-gray-900">登入頁面</h1>

    <div
      v-if="showError"
      class="flex items-center gap-2 bg-red-100 text-red-700 border border-red-300 px-5 py-3 rounded-lg shadow-sm mb-6 max-w-sm"
    >
      <font-awesome-icon icon="exclamation-triangle" class="text-red-500 text-lg" />
      <span class="text-sm font-medium">
        {{ errorMessage }}
      </span>
    </div>

    <form v-if="!isLoggedIn" @submit.prevent="login" class="space-y-6 max-w-sm">
      <div>
        <input
          v-model="email"
          type="email"
          placeholder="請輸入電子郵件"
          required
          class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <input
          v-model="password"
          type="password"
          placeholder="請輸入密碼"
          required
          class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div class="flex flex-col space-y-4">
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#66B3FF] hover:bg-[#2894FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          登入
        </button>

        <button
          type="button"
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5 mr-3" />
          <span>使用 Google 登入</span>
        </button>
      </div>
    </form>

    <RouterLink to="/signup" class="mt-6 block max-w-sm">
      <button class="w-full py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
        我要註冊
      </button>
    </RouterLink>

    <div v-if="isLoggedIn" class="mt-8 p-6 bg-blue-50 rounded-lg shadow-md max-w-sm">
      <p class="text-blue-700 font-semibold mb-4">您已成功登入！</p>
      <button @click="logout" class="bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out">登出</button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import axios from 'axios';
import { logoutUser, checkLoginStatus } from '../composable/authUtils';

const router = useRouter();
const TOKEN_NAME = 'user_token';
const email = ref('');
const password = ref('');
const isLoggedIn = ref(false);
const showError = ref(false);
const errorMessage = ref('');
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/login/`;

const clearText = () => {
  email.value = '';
  password.value = '';
};

const login = async () => {
  if (email.value === '' || password.value === '') {
    showError.value = true;
    errorMessage.value = '請輸入 Email 和密碼';
    return;
  }
  const userData = {
    email: email.value,
    password: password.value
  };

  try {
    const res = await axios.post(API_BASE_URL, userData);
    const token = res.data.token;
    localStorage.setItem(TOKEN_NAME, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    isLoggedIn.value = true;
    showError.value = false;
    clearText();
    router.push('/');
  } catch (err) {
    showError.value = true;
    errorMessage.value = err.response?.data?.message || '登入失敗，請檢查郵件與密碼';
  }
};

const logout = () => {
  logoutUser(router);
  isLoggedIn.value = false;
  clearText();
};

const handleGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};

onMounted(() => {
  isLoggedIn.value = checkLoginStatus();
  showError.value = false;
  errorMessage.value = '';
});
</script>