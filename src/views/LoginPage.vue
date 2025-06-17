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
            class="flex items-center gap-1 sm:gap-2 text-gray-800 hover:text-white transition-colors text-xs sm:text-sm md:text-base">
            <span class="font-medium">{{ link.name }}</span>
          </router-link>
        </div>

        <button>
          <img
            class="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-blue-200 transition-colors"
            src="https://images.unsplash.com/photo-1685316494198-a71c8344aa9a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="使用者頭像">
        </button>
      </div>
    </nav>

    <main class="w-full max-w-sm text-white rounded-2xl overflow-hidden p-6 sm:p-8
		bg-[#A2A2A2] main-convex-effect">
      <div class="text-center mb-6">
        <div class="flex justify-center mb-4">
          <img 
					src="https://plus.unsplash.com/premium_photo-1722908886610-85956c1f55e6?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
					alt="Tripfolio Logo" class="w-20 h-20 rounded-full object-cover "> </div>
        <h1 class="text-2xl font-semibold mb-2">welcome to Tripfolio</h1>
        <p class="text-gray-300">Nice to see you</p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="login">
        <input
          v-model="emailOrPhone"
          type="text"
          placeholder="Email"
          class="p-3 bg-gray-500 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="p-3 bg-gray-500 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
        />
        <button
          type="submit"
          class="p-3 bg-white text-black rounded-lg font-bold hover:bg-blue-200 transition-colors duration-200"
        >
          LOGIN
        </button>

        <button
          type="button"
          @click="goToSignUp"
          class="p-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors duration-200"
        >
          Sign up
        </button>

        <div class="relative flex items-center my-4">
          <div class="flex-grow border-t border-gray-500"></div>
          <span class="flex-shrink mx-4 text-gray-400">Or sign in with</span>
          <div class="flex-grow border-t border-gray-500"></div>
        </div>

				<!-- 匯入第三方登入功能請修改~ -->
        <button
          type="button"
          class="flex items-center justify-center p-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors duration-200">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" alt="Google Logo" class="w-5 h-5 mr-2">
          Google
        </button>
      </form>
    </main>

    <div v-if="showError" class="space-y-2 w-full max-w-sm mt-4">
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
      class="w-full max-w-sm bg-blue-800 text-white border border-blue-700 px-4 py-3 rounded-md mt-4"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import axios from 'axios';
	import {jwtDecode} from "jwt-decode";
	
	const TOKEN_NAME = 'user_token'
	const email = ref('')
	const password = ref('')
	const isLoggedIn = ref(false)
	const showError = ref(false)
	const errorMessage = ref('')

	const navLinks = [
  { name: '行程安排', path: '/schedule' },
  { name: '探索', path: '/explore' },
  { name: '評論', path: '/reviews' },
  { name: '關於我們', path: '/about' },
	];
	
	const clearText = () => {
		email.value = ''
		password.value = ''
	}
	
	const login = async () => {
		if (email.value === '' || password.value === '') {
		showError.value = true
		errorMessage.value = '請輸入 Email 和密碼'
		return
	}
		const userData = {
		email: email.value,
		password: password.value
	}
	
		try {
			const res = await axios.post('http://localhost:3000/api/login'
, userData)
		const token = res.data.token
		localStorage.setItem(TOKEN_NAME, token)
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
		
		const decoed = jwtDecode(token)
		localStorage.setItem('memberId', decoed.id)


		isLoggedIn.value = true
		showError.value = false
		clearText()
		} catch (err) {
			showError.value = true
			errorMessage.value = err.response?.data?.message || '登入失敗，請檢查郵件與密碼'
		}
	}
	
	const logout = async () => {
		const token = localStorage.getItem(TOKEN_NAME)
		if (!token) return
	

		localStorage.removeItem(TOKEN_NAME)
		localStorage.removeItem('memberId')
		isLoggedIn.value = false
		clearText()
		
	}
	
	onMounted(() => {
		const token = localStorage.getItem(TOKEN_NAME)
		if (!token) return

		try {
			const payload = JSON.parse(atob(token.split('.')[1]))
			const exp = payload.exp
			const now = Math.floor(Date.now() / 1000)

			if (exp > now) {
				isLoggedIn.value = true
				axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
			} else {
				localStorage.removeItem(TOKEN_NAME)
				isLoggedIn.value = false
			}
			} catch (err) {
				console.error("❌ Token 驗證失敗", err)
				localStorage.removeItem(TOKEN_NAME)
				isLoggedIn.value = false
			}
		})

</script>
	
<style scoped>
	.main-convex-effect {
		/* background-color: #A2A2A2; */
		box-shadow: -8px -8px 16px rgba(255, 255, 255, 0.2),
		8px 8px 16px rgba(0, 0, 0, 0.3), /* 右下外凸 */
		-4px 0px 8px rgba(0, 0, 0, 0.1); 
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
	