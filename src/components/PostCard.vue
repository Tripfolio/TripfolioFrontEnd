<template>
  <div
    class="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
    @click="goToPost"
  >
    <img
      :src="post.imageUrl"
      alt="post image"
      class="w-full h-60 object-cover rounded-xl mb-3"
    />
    <h2 class="text-lg font-semibold">{{ post.title }}</h2>
    <p class="text-sm text-gray-500">發文者：{{ post.authorName }}</p>
    <div class="text-sm text-gray-600 mt-1">
      💬 {{ post.commentCount }}　❤️ {{ post.favoriteCount }}
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  post: Object,
});

const router = useRouter();

const goToPost = () => {
  router.push(`/post/${props.post.id}`); // 之後需改成實際路由
};
</script>
