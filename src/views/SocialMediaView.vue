<template>
  <div class="post-all flex flex-wrap">
    <div
      class="post w-30 h-60 m-5 flex bg-amber-700 rounded-xl relative"
      v-for="post in posts"
      :key="post.id"
      @click="openPopup(post)"
    ></div>
  </div>
  <div class="pop-post" v-if="showPopup">
    <PostPopup :post="selectedPost" @close="showPopup = false" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PostPopup from "../components/PostPopup.vue";
const posts = ref(10);

const showPopup = ref(false);
const selectedPost = ref(null);

function openPopup(post) {
  selectedPost.value = post;
  showPopup.value = true;
}
</script>
