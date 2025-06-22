<template>
  <main class="px-4 py-8 md:px-10 md:py-12 lg:px-24 lg:py-16">
    <h2 class="text-3xl font-extrabold mb-8 text-gray-900 text-center">註冊頁面</h2>

    <div v-if="showError" class="space-y-4 max-w-sm mx-auto mb-6">
      <div
        v-for="(msg, index) in errorMessages"
        :key="index"
        class="flex items-start bg-red-100 text-red-700 border border-red-300 px-5 py-3 rounded-lg shadow-sm text-sm"
      >
        <font-awesome-icon icon="exclamation-triangle" class="text-red-500 mr-3 mt-0.5" />
        <span>{{ msg }}</span>
      </div>
    </div>

    <div
      v-if="showSuccess"
      class="max-w-sm mx-auto bg-green-100 text-green-700 border border-green-300 px-5 py-3 rounded-lg shadow-sm mb-6"
    >
      {{ successMessage }}
    </div>

    <form class="flex flex-col space-y-4 max-w-sm mx-auto" @submit.prevent="signUp">
      <div>
        <input
          v-model="name"
          id="name"
          placeholder="該怎麼稱呼您"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="請輸入電子郵件"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="請輸入密碼"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#66B3FF] hover:bg-[#2894FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
        註冊
      </button>
    </form>
    <div class="flex max-w-sm mx-auto mt-4">
      <button
        type='button'
        @click="handleGoogleLogin"
        class="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5 mr-3" />
        <span>使用 Google 註冊/登入</span>
      </button>
    </div>
    <RouterLink to="/login" class="block">
      <button
        class="w-full py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
      >
        有會員走這裡
      </button>
    </RouterLink>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const name = ref('');
const email = ref('');
const password = ref('');

const router = useRouter();
const TOKEN_NAME = 'user_token';

const showError = ref(false);
const errorMessages = ref([]);

const showSuccess = ref(false);
const successMessage = ref('');

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/signup/`;

const clearText = () => {
  email.value = '';
  password.value = '';
  name.value = '';
};

const signUp = async () => {
  showError.value = false;
  errorMessages.value = [];
  showSuccess.value = false;
  successMessage.value = '';

  try {
    const response = await axios.post(API_BASE_URL, {
      email: email.value,
      password: password.value,
      name: name.value
    });

    clearText();
    showSuccess.value = true;
    successMessage.value = response.data.message;

    setTimeout(() => {
      showSuccess.value = false;
      router.push('/login');
    }, 2000);

  } catch (err) {
    showError.value = true;
    if (Array.isArray(err.response?.data?.errors)) {
        errorMessages.value = err.response.data.errors;
    } else {
      errorMessages.value = ['註冊失敗，請稍後重試'];
    }
  }
};

const handleGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const googleToken = urlParams.get('token');

  if (googleToken) {
    localStorage.setItem(TOKEN_NAME, googleToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${googleToken}`;

    router.replace('/');
  }
});
</script>