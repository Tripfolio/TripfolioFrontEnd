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
          <img
            :src="post.authorAvatar || 'https://picsum.photos/36/36?random=1'"
            :alt="post.authorName || 'User'"
            class="w-9 h-9 rounded-full object-cover"
            @error="$event.target.src = 'https://picsum.photos/36/36?random=1'"
          />
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
          <!-- <p class="text-gray-800 font-medium truncate">{{ post.content }}</p> -->
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
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import dayjs from "dayjs";
import PostPopup from "../components/PostPopup.vue";

const route = useRoute();
const router = useRouter();
const posts = ref([]);
const page = ref(1);
const limit = 15;
const isLoading = ref(false);
const hasMore = ref(true);
const scrollTrigger = ref(null);
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

    // 檢查 API 回應的資料結構
    console.log("API 回應的原始資料:", fetched);
    if (fetched.length > 0) {
      console.log("第一個貼文的完整資料:", fetched[0]);
      console.log("發文者相關欄位:", {
        authorName: fetched[0].authorName,
        authorAvatar: fetched[0].authorAvatar,
        author: fetched[0].author,
        user: fetched[0].user,
        member: fetched[0].member,
      });
      console.log("行程相關欄位:", {
        scheduleId: fetched[0].scheduleId,
        scheduleTitle: fetched[0].scheduleTitle,
        schedule: fetched[0].schedule,
        travelScheduleId: fetched[0].travelScheduleId,
        travelSchedule: fetched[0].travelSchedule,
        tripId: fetched[0].tripId,
        trip: fetched[0].trip,
      });
      console.log("所有欄位名稱:", Object.keys(fetched[0]));
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
    // 只更新有值的欄位，避免覆蓋原有的計數
    const updateData = { ...posts.value[index] };

    // 只更新有值的計數欄位
    if (updatedPost.commentCount !== undefined) {
      updateData.commentCount = updatedPost.commentCount;
    }
    if (updatedPost.favoriteCount !== undefined) {
      updateData.favoriteCount = updatedPost.favoriteCount;
    }

    // 更新其他欄位（如果有）
    Object.keys(updatedPost).forEach((key) => {
      if (
        key !== "commentCount" &&
        key !== "favoriteCount" &&
        updatedPost[key] !== undefined
      ) {
        updateData[key] = updatedPost[key];
      }
    });

    posts.value[index] = updateData;

    console.log(`更新貼文 ${updatedPost.postId} 的計數:`, {
      commentCount: updateData.commentCount,
      favoriteCount: updateData.favoriteCount,
    });
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedPost.value = null;
};

const openPostDetail = (post) => {
  selectedPost.value = post;
  showModal.value = true;
  router.push("/community");
};

//動態追蹤用監聽網址變化
watch(
  () => route.query.postId,
  (newPostId) => {
    if (!newPostId) {
      closeModal();
      return;
    }

    const tryOpen = () => {
      const foundPost = posts.value.find((p) => p.postId == newPostId);
      if (foundPost) {
        selectedPost.value = foundPost;
        showModal.value = true;
      }
    };

    if (posts.value.length) {
      tryOpen();
    } else {
      // 沒資料時，強制呼叫 fetchPosts
      fetchPosts().then(() => {
        tryOpen();
      });
    }
  },
  { immediate: true }
);

onMounted(fetchPosts);
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
