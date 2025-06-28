<template>
  <header class="frosted-style flex items-center rounded-full px-6 py-4">
    <div class="flex-none font-bold w-7 h-7">
      <router-link to="/" class="cursor-pointer block">
        <img :src="logo" alt="Logo" />
      </router-link>
    </div>

    <nav class="flex-1 flex justify-center space-x-6 items-center text-gray-700">
      <button class="flex items-center space-x-1 pr-5">
        <RouterLink to="/map">
          <font-awesome-icon :icon="['fas', 'compass']" />
          <span class="pl-2 no-underline">探索</span>
        </RouterLink>
      </button>

      <button class="flex items-center space-x-1">
        <RouterLink to="/community">
          <font-awesome-icon :icon="['fas', 'globe']" />
          <span class="pl-2 no-underline">社群</span>
        </RouterLink>
      </button>

      <slot name="mapSearch"></slot>
    </nav>

    <div class="flex-none text-gray-700">
      <template v-if="isLoggedIn">
        <button @click="logout" class="underline">登出</button>
      </template>
      <template v-else>
        <RouterLink to="/signup" class="underline">註冊</RouterLink>
        |
        <RouterLink to="/login" class="underline">登入</RouterLink>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import logo from '../assets/icons/logoIcon/logo.svg'

const TOKEN_NAME = 'user_token'
const isLoggedIn = ref(false)
const router = useRouter()

const checkAuth = () => {
  const token = localStorage.getItem(TOKEN_NAME)
  if (!token) {
    isLoggedIn.value = false
    return
  }

  try {
    const payload = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)
    isLoggedIn.value = payload.exp > now
  } catch {
    isLoggedIn.value = false
  }
}

const logout = () => {
  localStorage.removeItem(TOKEN_NAME)
  localStorage.removeItem('memberId')
  isLoggedIn.value = false
  router.push('/login')
}

onMounted(() => {
  checkAuth()
  window.addEventListener('storage', checkAuth)
})
</script>
