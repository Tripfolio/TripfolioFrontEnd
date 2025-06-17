<template>
  <div class="p-6 space-y-6">
    <RouterLink to="/community/post" class="text-blue-500">新增貼文</RouterLink>
    <h1 class="text-2xl font-bold">社群貼文</h1>

    <div v-if="posts.length === 0">目前沒有任何貼文。</div>
    <PostPopup
      :post="selectedPost"
      :isVisible="showModal"
      @close="closeModal"
      @update-post="updatePost"
    />
    <div
      v-for="post in posts"
      :key="post.postId"
      class="border p-4 rounded-lg shadow space-y-2"
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
          @click="saveEdit(post)"
          class="text-green-500 hover:underline"
        >
          儲存
        </button>

        <button
          v-else
          @click="post.isEditing = true"
          class="text-blue-500 hover:underline"
        >
          編輯
        </button>

        <button
          @click="deletePost(post.postId)"
          class="text-red-500 hover:underline"
        >
          刪除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import PostPopup from "../components/PostPopup.vue";

// const posts = ref([]);
const token = localStorage.getItem("token");

const posts = ref([
  {
    id: 1,
    title: "台北一日遊攻略",
    content: "分享我的台北一日遊行程，包含必去景點和美食推薦...",
    author: {
      id: 101,
      name: "旅遊達人小王",
      avatar: "https://via.placeholder.com/50",
    },
    createdAt: "2025-06-15T10:30:00Z",
    likes: 25,
    commentsCount: 8,
    tags: ["台北", "一日遊", "美食"],
  },
  {
    id: 2,
    title: "高雄美食推薦",
    content: "來高雄必吃的在地美食，從早餐到宵夜一次滿足...",
    author: {
      id: 102,
      name: "美食探險家",
      avatar: "https://via.placeholder.com/50",
    },
    createdAt: "2025-06-16T14:20:00Z",
    likes: 18,
    commentsCount: 5,
    tags: ["高雄", "美食", "推薦"],
  },
]);

const fetchPosts = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/community-posts`
    );
    posts.value = res.data.posts.map((post) => ({
      ...post,
      isEditing: false,
      previewImage: null,
      imageFile: null,
    }));
  } catch {
    alert("取得貼文失敗");
  }
};

const deletePost = async (postId) => {
  if (!confirm("確定要刪？")) return;

  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/community-posts/${postId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await fetchPosts();
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
      `${import.meta.env.VITE_API_URL}/api/community-posts/${post.postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    post.isEditing = false;
    post.previewImage = null;
    post.imageFile = null;
    await fetchPosts();
    alert("更新成功！");
  } catch {
    alert("更新失敗！");
  }
};

onMounted(fetchPosts);
</script>
