<template>
	<h2 class="text-center text-xl font-semibold mb-4">註冊頁面</h2>

	<div v-if="showError" class="space-y-2 w-[300px] mx-auto">
		<div v-for="(msg, index) in errorMessages" :key="index"
			class="flex items-start bg-red-100 text-red-800 border border-red-200 px-4 py-3 rounded-md text-sm">
			<font-awesome-icon icon="exclamation-triangle" class="mr-2 mt-0.5 text-red-600" />
			<span>{{ msg }}</span>
		</div>
	</div>

	<div v-if="showSuccess"
		class="w-[300px] mx-auto bg-blue-100 text-black border border-blue-200 px-4 py-3 rounded-md mb-4">
		{{ successMessage }}
	</div>

	<form class="flex flex-col gap-[10px] w-[300px] mx-auto mt-2" @submit.prevent="signUp">
		<input
			v-model="name"
			placeholder="該怎麼稱呼您"
			class="p-[8px] text-[14px] border border-[#aaa] rounded"
		/>
		<input
			v-model="email"
			type="email"
			placeholder="請輸入電子郵件"
			class="p-[8px] text-[14px] border border-[#aaa] rounded"
		/>
		<input
			v-model="password"
			type="password"
			placeholder="請輸入密碼"
			class="p-[8px] text-[14px] border border-[#aaa] rounded"
		/>

		<button
			type="submit"
			class="p-[10px] bg-[#2894FF] text-white border-0 rounded cursor-pointer hover:bg-[#46A3FF]"
		>
			註冊
		</button>

		<RouterLink to="/login">
			<button
				class= "w-[100px] text-black py-2 rounded transition hover:text-[#0d4a87]"
			>
				有會員走這裡
			</button>
		</RouterLink>
	</form>
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

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/signup/`;

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
