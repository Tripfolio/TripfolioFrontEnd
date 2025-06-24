<template>
  <div
    @click="$emit('click')"
    class="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
  >
    <img
      :src="post.coverURL"
      alt="post image"
      class="w-full h-60 object-cover rounded-xl mb-3"
    />
    <h2 class="text-lg font-semibold">{{ post.scheduleTitle }}</h2>
    <p class="text-sm text-gray-500">發文者：{{ post.authorName }}</p>
    <div class="text-sm text-gray-600 mt-1">
      💬 {{ post.commentCount }}　❤️ {{ post.favoriteCount }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  post: Object,
});
</script>
