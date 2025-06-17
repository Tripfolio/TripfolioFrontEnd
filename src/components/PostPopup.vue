<template>
  <div class="popup-overlay" @click.self="close">
    <div class="popup-content flex relative">
      <!-- 關閉按鈕 -->
      <button
        @click="close"
        class="absolute top-4 right-4 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100"
      >
        ✕
      </button>

      <!-- 左側圖片 -->
      <div
        class="post-image bg-[#0ff376] flex items-center justify-center w-[55%]"
      >
        <img
          :src="post.imageUrl || 'https://via.placeholder.com/400x600'"
          alt="貼文照片"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- 右側內容 -->
      <div class="post-info w-[45%] flex flex-col">
        <!-- 貼文標題 -->
        <div
          class="post-header bg-amber-300 h-20 border-b border-yellow-900 flex justify-between items-center px-4"
        >
          <div class="flex items-center flex-1">
            <img
              :src="post.authorAvatar || 'https://via.placeholder.com/40'"
              class="avatar w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div class="font-semibold">
                {{ post.authorName || "匿名使用者" }}
              </div>
              <div class="text-sm text-gray-600">
                {{ post.scheduleTitle || "未命名行程" }}
              </div>
            </div>
          </div>
          <button
            class="cursor-pointer bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition-colors"
            @click="toTravelPage"
          >
            <p class="text-white text-sm">行程參考</p>
          </button>
        </div>

        <!-- 內容與留言區域 -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- 貼文內容 -->
          <div class="post-body p-4 border-b">
            <p class="break-words whitespace-pre-wrap">
              {{ post.content || "沒有內容" }}
            </p>
          </div>

          <!-- 留言列表 -->
          <div class="comments-section flex-1 overflow-y-auto p-4">
            <div v-if="isLoading" class="text-center py-4">載入中...</div>
            <div
              v-else-if="comments.length === 0"
              class="text-center py-4 text-gray-500"
            >
              還沒有留言，成為第一個留言的人吧！
            </div>
            <div
              v-else
              v-for="comment in comments"
              :key="comment.id"
              class="comment mb-3 flex items-start gap-2"
            >
              <img
                :src="comment.userAvatar || 'https://via.placeholder.com/32'"
                class="avatar-small w-8 h-8 rounded-full"
              />
              <div class="flex-1">
                <span class="comment-user font-semibold">{{
                  comment.userName
                }}</span>
                <span class="comment-content ml-2">{{ comment.content }}</span>
                <div class="text-xs text-gray-500 mt-1">
                  {{ formatTime(comment.createdAt) }}
                </div>
              </div>
              <button
                @click="deleteComment(comment.id)"
                class="delete-btn text-red-500 text-sm hover:text-red-700"
              >
                刪除
              </button>
            </div>
          </div>

          <!-- 底部輸入區 -->
          <div
            class="comment-input-area border-t bg-white p-3 flex items-center gap-2"
          >
            <input
              v-model="newComment"
              placeholder="留言..."
              class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="submitComment"
              :disabled="isSubmitting"
            />
            <button
              @click="submitComment"
              :disabled="!newComment.trim() || isSubmitting"
              class="btn-submit bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              {{ isSubmitting ? "送出中..." : "送出" }}
            </button>
            <button
              @click="toggleLike"
              class="like-btn text-2xl hover:scale-110 transition-transform"
            >
              {{ liked ? "❤️" : "🤍" }} {{ post.likes || 0 }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

// Props
const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      imageUrl: "",
      authorName: "",
      authorAvatar: "",
      content: "",
      likes: 0,
    }),
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["close", "update-post"]);

// 響應式資料
const comments = ref([]);
const newComment = ref("");
const liked = ref(false);
const isSubmitting = ref(false);

const close = () => {
  emit("close");
};

const toTravelPage = () => {
  console.log("跳轉到行程頁面");
};

// 取得留言
const fetchComments = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/posts/${props.post.id}/comments`
    );
    comments.value = response.data;
  } catch (error) {
    console.error("取得留言失敗:", error);
  }
};

// 送出留言
const submitComment = async () => {
  if (!newComment.value.trim() || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    const response = await axios.post(`/api/posts/${props.post.id}/comments`, {
      content: newComment.value.trim(),
      // memberId: currentMemberId // 從登入狀態取得
    });

    // 新增留言到列表
    comments.value.push(response.data);
    newComment.value = "";
  } catch (error) {
    console.error("送出留言失敗:", error);
    alert("送出失敗，請重試");
  } finally {
    isSubmitting.value = false;
  }
};

// 刪除留言
const deleteComment = async (commentId) => {
  if (!confirm("確定要刪除這則留言嗎？")) return;

  try {
    await axios.delete(`/api/comments/${commentId}`);
    comments.value = comments.value.filter(
      (comment) => comment.id !== commentId
    );
  } catch (error) {
    console.error("刪除留言失敗:", error);
    alert("刪除失敗");
  }
};

// 切換按讚
const toggleLike = async () => {
  try {
    const response = await axios.post(`/api/posts/${props.post.id}/like`);
    liked.value = response.data.liked;
    emit("update-post", { ...props.post, likes: response.data.likes });
  } catch (error) {
    console.error("按讚失敗:", error);
  }
};

// 組件掛載時載入留言
onMounted(() => {
  if (props.isVisible) {
    fetchComments();
  }
});
watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue && props.post.id) {
      fetchComments();
    }
  }
);
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
