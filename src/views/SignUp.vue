<template>
  <div class="bg-white min-h-screen p-4 sm:p-8 flex flex-col items-center">

  <main class="w-full max-w-sm text-white rounded-2xl overflow-hidden p-6 sm:p-8
		bg-[#A2A2A2] main-convex-effect">

		<div class="text-center mb-6">
        <h2 class="text-2xl font-semibold">註冊帳號</h2>
      </div>

      <div v-if="showError" class="space-y-2 mb-4">
        <div
          v-for="(msg, index) in errorMessages"
          :key="index"
          class="flex items-start bg-red-800 text-white border border-red-700 px-4 py-3 rounded-md text-sm"
        >
          <font-awesome-icon icon="exclamation-triangle" class="mr-2 mt-0.5 text-red-400" />
          <span>{{ msg }}</span>
        </div>
      </div>

      <div
        v-if="showSuccess"
        class="bg-blue-800 text-white border border-blue-700 px-4 py-3 rounded-md mb-4"
      >
        {{ successMessage }}
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="signUp">
        <input
          v-model="email"
          type="email"
          placeholder="請輸入電子郵件"
          class="p-3 bg-gray-500 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
        />
        <input
          v-model="password"
          type="password"
          placeholder="請輸入密碼"
          class="p-3 bg-gray-500 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
        />
        <input
          v-model="name"
          placeholder="請輸入使用者名稱 (選填)"
          class="p-3 bg-gray-500 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
        />
        <button
          type="submit"
          class="p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors duration-200"
        >
          註冊
        </button>

        <div class="relative flex items-center my-4">
          <div class="flex-grow border-t border-gray-500"></div>
          <span class="flex-shrink mx-4 text-gray-400">或者</span>
          <div class="flex-grow border-t border-gray-500"></div>
        </div>

				<!-- 匯入第三方登入功能請修改~ -->
        <button
          type="button"
          class="flex items-center justify-center p-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors duration-200"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" alt="Google Logo" class="w-5 h-5 mr-2">
          使用 Google 註冊
        </button>

        <p class="text-center text-gray-300 text-sm mt-4">
          已經有帳號了？
          <router-link to="/login" class="text-blue-400 hover:underline">立即登入</router-link>
        </p>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const name = ref('')
const email = ref('')
const password = ref('')

const router = useRouter()

const showError = ref(false)
const errorMessages = ref([])

const showSuccess = ref(false)
const successMessage = ref('')

const navLinks = [
  { name: '行程安排', path: '/schedule' },
  { name: '探索', path: '/explore' },
	{ name: '社群', path: '/community' },
  { name: '評論', path: '/reviews' },
  { name: '關於我們', path: '/about' },
];

const clearText = () => {
	email.value = ''
	password.value = ''
	name.value = ''
}

const signUp = async () => {
	showError.value = false
	errorMessages.value = []
	showSuccess.value = false
	successMessage.value = ''

	try {
		const response = await axios.post(API_BASE_URL, {
			email: email.value,
			password: password.value,
			name: name.value
		})

		clearText()
		showSuccess.value = true
		successMessage.value = response.data.message

		setTimeout(() => {
			showSuccess.value = false
			router.push('/login')
		}, 2000)

	} catch (err) {
    showError.value = true;
    if (Array.isArray(err.response?.data?.errors)) {
        errorMessages.value = err.response.data.errors;
    } else {
        errorMessages.value = ['註冊失敗，請稍後重試'];
    }
	}
}

</script>

<style scoped>
	.main-convex-effect {
		/* background-color: #A2A2A2; */
		box-shadow:
    /* 整體外凸陰影 */
    -8px -8px 16px rgba(255, 255, 255, 0.2),  /* 左上 */
    8px 8px 16px rgba(0, 0, 0, 0.3),           /* 右下 */
    -4px 0px 8px rgba(0, 0, 0, 0.1),           /* 左側 */
    /* Neumorphism 紋理 */
    inset 2px 2px 5px rgba(0, 0, 0, 0.1),     
    inset -2px -2px 5px rgba(255, 255, 255, 0.1); 

    transition: all 0.2s ease-in-out;
	}

	.main-convex-effect:hover {
		box-shadow: -12px -12px 24px rgba(255, 255, 255, 0.3),
		12px 12px 24px rgba(0, 0, 0, 0.4);
	}

	.main-convex-effect input {
  background-color: #909090;
  border: none; 
  box-shadow:
    inset 3px 3px 6px rgba(0, 0, 0, 0.2),
    inset -3px -3px 6px rgba(255, 255, 255, 0.1);
}

/* 按鈕的 Neumorphism 風格調整 (外凸效果) */
.main-convex-effect button:not(.bg-gray-700) {
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.2),          
    -4px -4px 8px rgba(255, 255, 255, 0.15);
  border: none;
  transition: all 0.2s ease-in-out;
}

/* 按鈕按下時的效果 (內凹效果) */
.main-convex-effect button:not(.bg-gray-700):active {
  box-shadow:
    inset 2px 2px 5px rgba(0, 0, 0, 0.3),
    inset -2px -2px 5px rgba(255, 255, 255, 0.05);
  transform: translateY(2px);
}
</style>
