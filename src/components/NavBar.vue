<template>
  <header
    class="flex items-center bg-gray-300 rounded-full px-6 py-2 shadow-md"
  >
    <div class="flex-none font-bold">logo</div>

    <nav
      class="flex-1 flex justify-center space-x-6 items-center text-gray-700"
    >
      <button class="flex items-center space-x-1">
        <RouterLink to="/map" class="underline">探索</RouterLink>
      </button>
      <button class="flex items-center space-x-1">
        <span>社群</span>
      </button>
      <button class="flex items-center space-x-1">
        <span>關於我們</span>
      </button>
    </nav>

    <div class="flex-none text-gray-700">
      <RouterLink to="/signup" class="underline">註冊</RouterLink>
      |
      <RouterLink to="/login" class="underline">登入</RouterLink>
    </div>
  </header>
</template>
