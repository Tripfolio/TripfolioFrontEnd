<template>
  <div class="popup-overlay" @click.self="close">
    <div class="popup-content flex relative">
      <div
        class="post-image bg-[#0ff376] flex items-center justify-center w-[55%]"
      >
        <img :src="post.imageUrl" alt="貼文照片" />
      </div>
      <div class="post-info w-[45%] overflow-hidden">
        <div
          class="post-header bg-amber-300 h-20 w-[100%] border-b-yellow-900 flex justify-between"
        >
          <div class="flex items-center">
            <img :src="post.authorAvatar" class="avatar" />
            <span class="author px-5">{{ post.authorName }}postAythor</span>
          </div>
          <button class="cursor-pointer bg-blue-500 m-2">
            <p class="text-lg">行程參考</p>
          </button>
        </div>
        <div
          class="scroll-area max-w-[100%] h-[100%] overflow-hidden overflow-y-scroll"
        >
          <div class="post-body m-5 w-[90%]">
            <p class="break-words whitespace-pre-wrap w-[100%]">
              {{ post.content }}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse
              suscipit natus molestias eum aperiam ea nemo est deleniti minus
              aut? Distinctio ipsa officiis vel quo consequuntur, a aspernatur
              accusantium
              nobis.vd;anvj;danvjdo;ancdjao;vnfdjae;vn;rdja;vcndjra;vnrdja;cvndarejfc;ndaerjfrnaejfk;rdanfjd;raeifnrdai;fbdeaji
            </p>
          </div>
          <hr />
          <div class="comments-section h-[100%]">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="comment m-y-5"
            >
              <img :src="comment.userAvatar" class="avatar-small" />
              <span class="comment-user">{{ comment.userName }}</span>
              <span class="comment-content">{{ comment.content }}</span>
            </div>
          </div>
          <div
            class="absolute w-[45%] bottom-0 flex justify-between items-center bg-blue-200 h-[8%]"
          >
            <form @submit.prevent="addComment">
              <input
                v-model="newComment"
                placeholder="留言..."
                class="h-[80%]"
              />
              <button type="submit">送出</button>
            </form>
            <div class="post-actions">
              <button @click="toggleLike" class="text-2xl">
                {{ liked ? "❤️" : "🤍" }} {{ post.likes }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({ postId: Number, onClose: Function });

const post = ref({});
const comments = ref([]);
const liked = ref(false);
const newComment = ref("");

async function fetchPost() {
  const res = await axios.get(`/api/posts/${props.postId}`);
  post.value = res.data;
  liked.value = res.data.liked;
}
async function fetchComments() {
  const res = await axios.get(`/api/posts/${props.postId}/comments`);
  comments.value = res.data;
}
async function toggleLike() {
  await axios.post(`/api/posts/${props.postId}/like`);
  liked.value = !liked.value;
  post.value.likes += liked.value ? 1 : -1;
}
async function addComment() {
  if (!newComment.value.trim()) return;
  await axios.post(`/api/posts/${props.postId}/comments`, {
    content: newComment.value,
  });
  newComment.value = "";
  fetchComments();
}
function close() {
  props.onClose && props.onClose();
}

onMounted(() => {
  fetchPost();
  fetchComments();
});
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(202, 111, 111, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.popup-content {
  background: #d2e8b8;
  border-radius: 10px;
  /* display: flex; */
  width: 70%;
  height: 70%;
  border-radius: 2%;
}
/* .post-header {
  width: 100%;
  height: 10px;
  background-color: red;
} */
/* .post-image {
  flex: 1;
  background: #0ff376;
  display: flex;
  align-items: center;
  justify-content: center;
} */
/* .post-image img {
  max-width: 90%;
  max-height: 90%;
} */
.post-info {
  /* background-color: bisque;
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column; */
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.comment {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}
.comment-user {
  font-weight: bold;
  margin-right: 6px;
}
.comments-section {
  margin-top: 20px;
  flex: 1;
}
</style>
