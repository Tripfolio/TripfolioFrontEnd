<template>
		<nav class="fixed left-1/2 -translate-x-1/2 w-[80vw] 
		mx-auto bg-[#A2A2A2]/30 text-white rounded-full p-3 padding-bottom 
		box-border z-50 top-4 nav-convex-effect">
      <div class="flex items-center justify-between">
        <button class="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full hover:bg-gray-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>

        <div class="flex flex-wrap justify-center md:flex items-center gap-2 sm:gap-4 md:gap-6">
          <router-link v-for="link in navLinks" :key="link.name" :to="link.path" class="flex items-center gap-1 sm:gap-2 text-gray-800 hover:text-white transition-colors text-xs sm:text-sm md:text-base">
            <span class="font-medium">{{ link.name }}</span>
          </router-link>
        </div>

        <button>
          <img class="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-colors" src="https://images.unsplash.com/photo-1529570058547-733204bf87e5?q=80&w=1362&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="使用者頭像">
        </button>
      </div>
    </nav>
</template>

<script setup>

const navLinks = [
	{ name: '首頁', path: '/' },
  { name: '行程安排', path: '/schedule' },
  { name: '探索', path: '/map' },
  { name: '社群', path: '/community' },
  { name: '評論', path: '/reviews' },
  { name: '關於我們', path: '/about' },
];

</script>

<style scoped>
.nav-convex-effect {
		background-color: rgba(33, 28, 28, 0.3);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px); /* Safari 支援 */
    box-shadow:
      /* 整體外凸陰影 (浮起效果) */
      -6px -6px 12px rgba(255, 255, 255, 0.2),  /* 左上 */
      6px 6px 12px rgba(0, 0, 0, 0.3),           /* 右下 */
      -3px 0px 6px rgba(0, 0, 0, 0.1),           /* 左側 */
  
      /* Neumorphism 紋理 */
      inset 1.5px 1.5px 4px rgba(0, 0, 0, 0.1),     
      inset -1.5px -1.5px 4px rgba(255, 255, 255, 0.1); 
  
    transition: all 0.2s ease-in-out; 
  }

	/* .nav-convex-effect:hover { 
    box-shadow:
      /* hover 時整體外凸陰影微調 */
      /* -4px -4px 8px rgba(255, 255, 255, 0.15),
      4px 4px 8px rgba(0, 0, 0, 0.25),
      -1.5px 0px 4px rgba(0, 0, 0, 0.08),
   */
      /* hover 時表面陰影紋理微調 
      inset 1px 1px 3px rgba(0, 0, 0, 0.08),
      inset -1px -1px 3px rgba(255, 255, 255, 0.08);
  
    transform: translateY(1px); 
  } */
	
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
</style>

