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
          :src="
            localPost.coverURL ||
            localPost.imageUrl ||
            'https://picsum.photos/400/400?random'
          "
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
                authorAvatar ||
                localPost.authorAvatar ||
                'https://picsum.photos/40/40?random=1'
              "
              class="avatar w-10 h-10 rounded-full mr-3"
              @error="
                $event.target.src = 'https://picsum.photos/40/40?random=1'
              "
            />
            <div>
              <div class="font-semibold">
                {{ localPost.authorName || "匿名使用者" }}
              </div>
              <div class="text-sm text-gray-600">
                {{ scheduleTitle || "未命名行程" }}
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
              {{ localPost.content || "沒有內容" }}
            </p>
          </div>

          <CommentSection
            :post="localPost"
            @comment-added="handleCommentUpdate"
            class="overflow-scroll w-full"
          />

          <FavoriteButton
            :postId="localPost.postId"
            :memberId="getCurrentUserId()"
            :favoriteCount="localPost.favoriteCount"
            @favorite-toggled="handleFavoriteToggle"
            class="absolute bottom-5 right-10"
          />
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
import AddComment from "../components/AddComment.vue";

const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      imageUrl: "",
      authorName: "",
      authorAvatar: "",
      content: "",
    }),
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "update-post"]);

const comments = ref([]);
const newComment = ref("");
const liked = ref(false);
const isSubmitting = ref(false);
const isLoading = ref(false);
const selectedPost = ref(null);
const scheduleTitle = ref("未命名行程");
const authorAvatar = ref("");

// 本地 post 狀態，會隨著操作而更新
const localPost = ref({ ...props.post });

const close = () => {
  emit("close");
};

const toTravelPage = () => {
  console.log("跳轉到行程頁面");
};

// 獲取行程 title
const fetchScheduleTitle = async () => {
  console.log("fetchScheduleTitle 被調用");
  console.log("props.post:", props.post);
  console.log("props.post.title:", props.post.title);

  if (props.post.title) {
    try {
      console.log(`正在獲取行程 ${props.post.title} 的標題`);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/travelSchedule/${props.post.title}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      console.log("行程 API 回應:", res.data);
      scheduleTitle.value = res.data.title || "未命名行程";
      console.log("設置的 scheduleTitle:", scheduleTitle.value);
    } catch (error) {
      console.error("獲取行程標題失敗", error);
      scheduleTitle.value = "未命名行程";
    }
  } else {
    console.log("沒有 title，使用預設標題");
    scheduleTitle.value = "未命名行程";
  }
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

// 切換按讚
// const toggleLike = async () => {
//   try {
//     liked.value = !liked.value;
//     const newLikes = liked.value
//       ? (props.post.likes || 0) + 1
//       : (props.post.likes || 0) - 1;

//     emit("update-post", { ...props.post, likes: newLikes });
//     console.log("按讚狀態切換:", liked.value);
//   } catch (error) {
//     console.error("按讚失敗:", error);
//   }
// };
// const submitComment = async () => {
//   if (!newComment.value.trim()) return;

//   isSubmitting.value = true;

//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/post/${props.post.postId}/comments`,
//       {
//         content: newComment.value.trim(),
//         memberId: getCurrentUserId(),
//       }
//     );

//     // 成功後更新留言列表（加到頂部）
//     comments.value.unshift(response.data);
//     newComment.value = "";
//     console.log("留言發表成功", response.data);
//   } catch (error) {
//     console.error("留言發表失敗:", error);
//   } finally {
//     isSubmitting.value = false;
//   }
// };

const refreshPost = async () => {
  try {
    // 嘗試獲取最新的貼文資訊
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/allposts/${props.post.postId}`,
    );

    // 通知父組件更新列表中顯示的計數
    emit("update-post", res.data.post || res.data);
  } catch (error) {
    console.error("更新貼文資訊失敗，嘗試手動更新計數", error);

    // 如果 API 端點不存在，我們可以手動更新計數
    // 這裡可以根據實際情況調整
    const updatedPost = {
      postId: props.post.postId,
      commentCount: props.post.commentCount,
      favoriteCount: props.post.favoriteCount,
    };
    emit("update-post", updatedPost);
  }
};

const getCurrentUserId = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.userId || payload.memberId || null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

const handleFavoriteToggle = (favoriteData) => {
  // 更新本地計數
  if (favoriteData && favoriteData.postId === localPost.value.postId) {
    // 更新本地狀態
    localPost.value = {
      ...localPost.value,
      favoriteCount: favoriteData.favoriteCount,
    };

    // 通知父組件更新
    emit("update-post", localPost.value);

    console.log(`收藏計數更新: ${favoriteData.favoriteCount}`);
  }
};

const handleCommentUpdate = (commentData) => {
  // 更新本地計數
  if (commentData && commentData.postId === localPost.value.postId) {
    // 更新本地狀態
    localPost.value = {
      ...localPost.value,
      commentCount: commentData.commentCount,
    };

    // 通知父組件更新
    emit("update-post", localPost.value);

    console.log(`留言計數更新: ${commentData.commentCount}`);
  }
};

// 監聽 post 變化，重新獲取行程 title
watch(
  () => props.post,
  (newPost) => {
    // 更新本地 post 狀態
    localPost.value = { ...newPost };
    fetchScheduleTitle();
    // 獲取發文者頭貼
    if (newPost.memberId || newPost.authorId || newPost.userId) {
      fetchAuthorAvatar(newPost.memberId || newPost.authorId || newPost.userId);
    }
  },
  { immediate: true },
);

onMounted(() => {
  fetchScheduleTitle();
  // 獲取發文者頭貼
  if (props.post.memberId || props.post.authorId || props.post.userId) {
    fetchAuthorAvatar(
      props.post.memberId || props.post.authorId || props.post.userId,
    );
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
