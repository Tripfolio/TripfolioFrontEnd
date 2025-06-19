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
          :src="post.coverURL"
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
              :src="
                post.authorAvatar || 'https://picsum.photos/400/300?random=4'
              "
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
          <!-- <div class="comments-section flex-1 overflow-y-auto p-4">
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
          </div> -->
          <CommentSection :post="post" class="overflow-scroll" />
          <FavoriteButton
            :postId="post.postId"
            :memberId="getCurrentUserId()"
          />

          <!-- 底部輸入區 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import CommentSection from "../components/CommentSection.vue";
import FavoriteButton from "../components/FavoriteButton.vue";

const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      imageUrl: "",
      authorName: "",
      authorAvatar: "",
      content: "",
      likes: 0,
      // postId: null,
      // memberId: null,
    }),
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});
console.log(props.post);

const emit = defineEmits(["close", "update-post"]);

const comments = ref([]);
const newComment = ref("");
const liked = ref(false);
const isSubmitting = ref(false);
const isLoading = ref(false);

const close = () => {
  emit("close");
};

const toTravelPage = () => {
  console.log("跳轉到行程頁面");
};

// 格式化時間
const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return "剛剛";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分鐘前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小時前`;

  return date.toLocaleDateString("zh-TW");
};

// 取得目前使用者 ID（暫時模擬）
const getCurrentUserId = () => {
  return 1;
};

// 切換按讚
const toggleLike = async () => {
  try {
    liked.value = !liked.value;
    const newLikes = liked.value
      ? (props.post.likes || 0) + 1
      : (props.post.likes || 0) - 1;

    emit("update-post", { ...props.post, likes: newLikes });
    console.log("按讚狀態切換:", liked.value);
  } catch (error) {
    console.error("按讚失敗:", error);
  }
};

// 檢查是否可以刪除留言
const canDeleteComment = (comment) => {
  const currentUserId = getCurrentUserId();
  const postAuthorId = props.post.authorId;

  // 留言者本人或貼文作者可以刪除
  return comment.userId === currentUserId || postAuthorId === currentUserId;
};

// 監聽彈窗顯示狀態
watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue && props.post.id) {
      fetchComments();
    }
  }
);

// 組件掛載時載入留言
onMounted(() => {
  if (props.isVisible && props.post.id) {
    fetchComments();
  }
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
