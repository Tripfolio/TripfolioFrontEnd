<template>
	<h2 class="text-center text-xl font-semibold mb-4">註冊頁面</h2>

	<div v-if="showError" class="space-y-2 w-[300px] mx-auto">
		<div
			v-for="(msg, index) in errorMessages"
			:key="index"
			class="flex items-start bg-red-100 text-red-800 border border-red-200 px-4 py-3 rounded-md text-sm"
		>
			<font-awesome-icon
				icon="exclamation-triangle"
				class="mr-2 mt-0.5 text-red-600"
			/>
			<span>{{ msg }}</span>
		</div>
	</div>

	<div
		v-if="showSuccess"
		class="w-[300px] mx-auto bg-blue-100 text-black border border-blue-200 px-4 py-3 rounded-md mb-4"
	>
		{{ successMessage }}
	</div>

	<form
		class="flex flex-col gap-[10px] w-[300px] mx-auto mt-2"
		@submit.prevent="signUp"
	>
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
		<input
			v-model="phone"
			placeholder="請輸入手機號碼"
			class="p-[8px] text-[14px] border border-[#aaa] rounded"
		/>
		<button
			type="submit"
			class="p-[10px] bg-[#6a5acd] text-white border-0 rounded cursor-pointer hover:bg-[#483d8b]"
		>
			註冊
		</button>
		<!-- 透過google帳號註冊 -->
		<div id="google-login-btn"></div>
	</form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faExclamationTriangle);

const email = ref("");
const password = ref("");
const phone = ref("");

const router = useRouter();

const showError = ref(false);
const errorMessages = ref([]);

const showSuccess = ref(false);
const successMessage = ref("");

const clearText = () => {
	email.value = "";
	password.value = "";
	phone.value = "";
};

const signUp = async () => {
	showError.value = false;
	errorMessages.value = [];
	showSuccess.value = false;
	successMessage.value = "";

	try {
		const response = await axios.post("http://localhost:3000/api/signup", {
			email: email.value,
			password: password.value,
			phone: phone.value,
		});

		clearText();
		showSuccess.value = true;
		successMessage.value = response.data.message || "註冊成功，請重新登入";

		setTimeout(() => {
			showSuccess.value = false;
			router.push("/");
		}, 2000);
	} catch (err) {
		showError.value = true;
		if (
			err.response &&
			err.response.data &&
			Array.isArray(err.response.data.errors)
		) {
			errorMessages.value = err.response.data.errors;
		} else {
			errorMessages.value = ["註冊失敗，請稍後重試"];
		}
	}
};

// google
onMounted(() => {
	initGoogleLogin();
}); // 初始化

async function initGoogleLogin() {
	google.accounts.id.initialize({
		client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
		callback: handleCredentialResponse,
	});

	google.accounts.id.renderButton(document.getElementById("google-login-btn"), {
		theme: "outline",
		size: "large",
	});
}

async function handleCredentialResponse(response) {
	const id_token = response.credential;
	console.log("取得Google ID Token:", id_token);
	try {
		const res = await axios.post("http://localhost:3000/api/auth/google", {
		id_token,
		});
		console.log("後端回傳結果", res.data);

		if (res.data && res.data.accessToken){
			const myAppToken = res.data.accessToken;
			
			localStorage.setItem("myAppToken", myAppToken);// 儲存到 localStorage
			console.log("應用程式 Token 已儲存到 localStorage:", myAppToken);

			// 儲存後端回傳的使用者資訊
			if (res.data.user) {
				localStorage.setItem("currentUser", JSON.stringify(res.data.user)); 
				console.log("使用者資訊已儲存到 localStorage:", res.data.user);
			}
			alert("Google 登入成功");
			fetchDataWithAuth();
			router.push('/dashboard'); // 導向到會員資料頁面

		} else {
			console.warn("後端回傳資料中未找到應用程式 Token");
		}
	} catch (error) {
		console.error("Google 登入失敗", error); // 處理錯誤
		showError.value = true; // 顯示錯誤訊息
		if (error.response){
			console.error("錯誤詳情", error.response.data);
			alert(`登入失敗: ${error.response.data.message || '未知錯誤'}`)
		} else if (error.request) {
			console.error("沒有收到伺服器回應:", error.request); // 請求已發出但沒有收到回應
			alert("登入失敗: 無法連接到伺服器");
		} else {
			alert("登入失敗: 發生未知錯誤");
		}
	}
	
}

// 需要手動在 Google 登入後獲取受保護資料時，才需要保留和呼叫此函數
function fetchDataWithAuth() {
    const token = localStorage.getItem("myAppToken"); 
    if (token) { 
        axios.get("http://localhost:3000/api/protected-data", { 
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => { 
            console.log("受保護資料:", response.data);
        })
        .catch(error => { 
            console.error("獲取受保護資料失敗:", error);
            // Token 可能過期或無效，需要重新登入
        });
    } else { 
        console.warn("未找到應用程式 Token，請先登入。");
        router.push('/'); // 導向首頁
    }
}
</script>
