<template>
  <div class="px-4 py-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">社群主頁</h1>

    <!-- 貼文列表 -->
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="post in posts"
        :key="post.postId"
        class="bg-white rounded-[24px] overflow-hidden shadow hover:shadow-lg transition cursor-pointer flex flex-col"
        @click="openPostDetail(post)"
      >
        <!-- Header -->
        <div class="flex items-center gap-2 p-4">
          <div
            class="w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xs"
          >
            {{ post.authorName?.[0] || "U" }}
          </div>
          <span class="text-sm font-semibold">{{
            post.authorName || "User Name"
          }}</span>
        </div>

        <!-- Image -->
        <img
          :src="
            post.previewImage ||
            post.coverURL ||
            post.imageUrl ||
            'https://picsum.photos/400/300?random'
          "
          alt="post image"
          class="w-full aspect-square object-cover"
        />

        <!-- Footer -->
        <div class="p-4 flex flex-col justify-between flex-grow">
          <p class="text-gray-800 font-medium truncate">{{ post.content }}</p>
          <div
            class="mt-2 flex items-center justify-end text-gray-600 text-sm gap-4"
          >
            <div class="flex items-center gap-1">
              <span>❤️</span>
              <span>{{ post.favoriteCount || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span>💬</span>
              <span>{{ post.commentCount || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="scrollTrigger" class="h-10"></div>

    <!-- Skeleton loading（載入中顯示） -->
    <div
      v-if="isLoading"
      class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="animate-pulse border-none rounded-xl p-4 shadow"
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

    <PostPopup
      v-if="showModal"
      :post="selectedPost"
      :is-visible="showModal"
      @close="closeModal"
      @update-post="updatePost"
    />

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
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import PostPopup from "../components/PostPopup.vue";

const posts = ref([]);
const page = ref(1);
const limit = 15;
const isLoading = ref(false);
const hasMore = ref(true);
const scrollTrigger = ref(null);
const router = useRouter();
const token = localStorage.getItem("token");
const showModal = ref(false);
const selectedPost = ref(null);
let observer = null;
const defaultImage = `https://picsum.photos/`;

// 分頁載入貼文，append 並保留互動欄位
const fetchPosts = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/allposts?page=${page.value}&limit=${limit}`,
    );
    const fetched = res.data.posts || [];
    if (fetched.length < limit) {
      hasMore.value = false;
    }
    // append 並保留互動欄位
    posts.value.push(
      ...fetched.map((post) => ({
        ...post,
        isEditing: false,
        previewImage: null,
        imageFile: null,
      })),
    );
    page.value++;
    console.log(posts.value);
  } catch (err) {
    alert("載入貼文失敗");
  } finally {
    isLoading.value = false;
  }
};

const updatePost = (updatedPost) => {
  const index = posts.value.findIndex((p) => p.postId === updatedPost.postId);
  if (index !== -1) {
    posts.value[index] = { ...posts.value[index], ...updatedPost };
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedPost.value = null;
};

const openPostDetail = (post) => {
  selectedPost.value = post;
  showModal.value = true;
};

const goToCreatePost = () => {
  router.push("/community/post");
};

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
console.log("communityList mounted");
</script>
