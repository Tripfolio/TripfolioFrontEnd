<template>
  <div class="bg-white min-h-screen p-4 sm:p-8 flex flex-col items-center">

    <nav class="w-full max-w-5xl mx-auto bg-[#A2A2A2] text-white rounded-full shadow-lg p-3 mb-8">
      <div class="flex items-center justify-between">
        <button class="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full hover:bg-gray-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>

        <div class="flex flex-wrap justify-center md:flex items-center gap-2 sm:gap-4 md:gap-6">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="flex items-center gap-1 sm:gap-2 text-gray-800 hover:text-white transition-colors text-xs sm:text-sm md:text-base"
          >
            <span class="font-medium">{{ link.name }}</span>
          </router-link>
        </div>

        <button>
          <img
            class="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-colors"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80"
            alt="使用者頭像"
          >
        </button>
      </div>
    </nav>

    <main class="w-full max-w-sm bg-[#A2A2A2] text-white rounded-2xl shadow-lg overflow-hidden p-6 sm:p-8">
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
          v-model="phone"
          placeholder="請輸入手機號碼 (選填)"
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faExclamationTriangle)

const email = ref('')
const password = ref('')
const phone = ref('')

const router = useRouter()

const showError = ref(false)
const errorMessages = ref([])

const showSuccess = ref(false)
const successMessage = ref('')

const navLinks = [
  { name: '行程安排', path: '/schedule' },
  { name: '探索', path: '/explore' },
  { name: '評論', path: '/reviews' },
  { name: '關於我們', path: '/about' },
];

const clearText = () => {
	email.value = ''
	password.value = ''
	phone.value = ''
}

const signUp = async () => {
	showError.value = false
	errorMessages.value = []
	showSuccess.value = false
	successMessage.value = ''

	try {
		const response = await axios.post("http://localhost:3000/api/signup", {
			email: email.value,
			password: password.value,
			phone: phone.value
		})

		clearText()
		showSuccess.value = true
		successMessage.value = response.data.message || '註冊成功，請重新登入'

		setTimeout(() => {
			showSuccess.value = false
			router.push('/')
		}, 2000)

	} catch (err) {
		showError.value = true
		if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
			errorMessages.value = err.response.data.errors
		} else {
			errorMessages.value = ['註冊失敗，請稍後重試']
		}
	}
}
</script>
