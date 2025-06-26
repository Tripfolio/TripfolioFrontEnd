<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-md py-3 px-6 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <RouterLink to="/community/posts" class="text-xl font-bold text-gray-800">社群/貼文</RouterLink>
      </div>
      <div class="flex items-center">
        <a href="#" class="text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </a>
      </div>
    </header>

    <main class="p-6 flex flex-col items-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 mt-4">建立貼文</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
            <div
                v-for="trip in trips"
                :key="trip.id"
                class="bg-white rounded-lg shadow-md p-6 h-48 flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
                <p class="font-bold text-xl text-gray-900 mb-2">{{ trip.name }}</p>
                <p class="text-gray-600">{{ trip.date }}</p>
            </div>

            </div>

        <RouterLink
            to="/community/post"
            class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[linear-gradient(45deg,#f7a751,#E1D099,#3CA2D5)] text-white flex items-center justify-center text-3xl shadow-lg hover:bg-green-600 transition-colors duration-200"
        >
            +
        </RouterLink>
    </main>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import dayjs from "dayjs";

const posts = ref([]);
const token = localStorage.getItem("token");

const fetchPosts = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/community-posts`);
    posts.value = res.data.posts.map(post => ({
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
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/community-posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
