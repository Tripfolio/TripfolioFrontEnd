<!--模擬金流-->
<template>
    <div class="p-10 max-w-md mx-auto text-center">
        <h1 class="text-2xl font-bold mb-4">模擬付款頁</h1>
        <p class="text-gray-600 mb-6">這是假付款頁，點下去會升級為付款會員</p>
        <button @click="handleFakePay" class="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded shadow">模擬付款完成</button>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleFakePay = async () => {
    const token = localStorage.getItem('token');

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/confirm`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        alert('付款完成，您已升級為付費會員！');
        router.push('/travel');
    } catch (err) {
        console.error('付款錯誤', err);
        alert('付款失敗，請稍後再試');
    }
};

</script>