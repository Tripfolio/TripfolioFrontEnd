<template>
  <div class="max-w-md mx-auto mt-24 text-center font-sans px-4">
    <h1 class="text-4xl font-bold text-red-600 mb-6">付款失敗</h1>
    <p class="text-lg mb-8">抱歉，您的付款未成功。請稍後再試或聯絡客服。</p>
    <router-link
      to="/payment"
      class="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
    >
      返回付款頁面
    </router-link>
  </div>
</template>