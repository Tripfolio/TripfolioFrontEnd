<template>
  <div class="px-4 py-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">社群主頁</h1>

    <!-- 貼文列表 -->
    <div class="space-y-4">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <div ref="scrollTrigger" class="h-10"></div>

    <!-- Skeleton loading（載入中顯示） -->
    <div v-if="isLoading" class="space-y-4 my-4">
      <div
        v-for="n in 3"
        :key="n"
        class="animate-pulse border rounded-xl p-4 shadow"
      >
        <div class="w-full h-60 bg-gray-300 rounded-xl mb-3"></div>
        <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-300 rounded w-1/3 mb-1"></div>
        <div class="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>

    <div
      v-if="!isLoading && posts.length === 0"
      class="text-center text-gray-400 my-12"
    >
      尚無貼文，快來建立第一篇吧！
    </div>

    <div v-if="!hasMore && posts.length" class="text-center text-gray-400 my-4">
      已載入所有貼文
    </div>

    <button
      class="fixed bottom-6 right-6 bg-blue-500 text-white px-5 py-3 rounded-full shadow-xl hover:bg-blue-600 transition"
      @click="goToCreatePost"
    >
      建立貼文
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import PostCard from "@/components/PostCard.vue";

const posts = ref([]);
const page = ref(1);
const limit = 15;
const isLoading = ref(false);
const hasMore = ref(true);
const scrollTrigger = ref(null);
const router = useRouter();

let observer = null;

// API 載入貼文
const fetchPosts = async () => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    const res = await axios.get(
      `/api/allposts?page=${page.value}&limit=${limit}`,
    );
    const fetched = res.data.posts || [];
    if (fetched.length < limit) {
      hasMore.value = false;
    }
    posts.value.push(...fetched);
    page.value++;
  } catch (err) {
    alert("載入貼文失敗");
  } finally {
    isLoading.value = false;
  }
};

// 點擊右下角按鈕跳轉建立頁
const goToCreatePost = () => {
  router.push("/community/post"); // 之後需改成實際路由
};

// 初始化 IntersectionObserver
const initObserver = () => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isLoading.value && hasMore.value) {
        fetchPosts();
      }
    },
    {
      root: null,
      threshold: 0.3,
    },
  );

  if (scrollTrigger.value) {
    observer.observe(scrollTrigger.value);
  }
};

onMounted(() => {
  fetchPosts();
  initObserver();
});

onBeforeUnmount(() => {
  if (observer && scrollTrigger.value) {
    observer.unobserve(scrollTrigger.value);
  }
});
</script>
