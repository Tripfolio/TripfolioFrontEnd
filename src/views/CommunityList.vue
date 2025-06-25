<template>
  <div class="px-4 py-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">社群主頁</h1>

    <!-- 貼文列表 -->
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="post in posts"
        :key="post.postId"
        class="border p-4 rounded-lg shadow space-y-2 w-full"
        @click="openPostDetail(post)"
      >
        <div>
          <p class="font-bold text-lg">標題：{{ post.scheduleTitle }}</p>

          <textarea
            v-if="post.isEditing"
            v-model="post.content"
            class="w-full border rounded p-2"
            rows="4"
          />
          <p v-else>{{ post.content }}</p>

          <p class="text-gray-500">
            {{ dayjs(post.createdAt).format("YYYY-MM-DD HH:mm") }}
          </p>
        </div>

        <div v-if="post.isEditing">
          <input
            type="file"
            accept="image/*"
            @change="onImageChange($event, post)"
          />
        </div>

        <img
          v-if="post.previewImage || post.coverURL"
          :src="post.previewImage || post.coverURL"
          alt="封面"
          class="w-full max-w-md rounded mb-4"
        />

        <div class="flex space-x-4">
          <button
            v-if="post.isEditing"
            class="text-green-500 hover:underline"
            @click.stop="saveEdit(post)"
          >
            儲存
          </button>

          <button
            v-else
            class="text-blue-500 hover:underline"
            @click.stop="post.isEditing = true"
          >
            編輯
          </button>

          <button
            class="text-red-500 hover:underline"
            @click.stop="deletePost(post.postId)"
          >
            刪除
          </button>
        </div>
      </div>
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

// 分頁載入貼文，append 並保留互動欄位
const fetchPosts = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/community?page=${page.value}&limit=${limit}`,
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
  } catch (err) {
    alert("載入貼文失敗");
  } finally {
    isLoading.value = false;
  }
};

const deletePost = async (postId) => {
  if (!confirm("確定要刪？")) return;
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/community/community-posts/${postId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    // 移除本地 posts
    posts.value = posts.value.filter((p) => p.postId !== postId);
  } catch {
    alert("刪除失敗");
  }
};

const onImageChange = (e, post) => {
  const file = e.target?.files?.[0];
  if (!file) return;
  post.imageFile = file;
  post.previewImage = URL.createObjectURL(file);
};

const saveEdit = async (post) => {
  try {
    const formData = new FormData();
    formData.append("content", post.content);
    if (post.imageFile) {
      formData.append("cover", post.imageFile);
    } else if (post.coverURL) {
      formData.append("coverURL", post.coverURL);
    }
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/community/community-posts/${post.postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    post.isEditing = false;
    post.previewImage = null;
    post.imageFile = null;
    // 重新取得該貼文最新內容
    // 這裡可選擇只更新單一 post，或簡單做法直接重載全部
    // await fetchPosts();
    alert("更新成功！");
  } catch {
    alert("更新失敗！");
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
</script>
