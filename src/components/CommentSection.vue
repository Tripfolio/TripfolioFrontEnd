<template>
  <div class="comment-section">
    <h4>留言區</h4>

    <div v-if="isLoading" class="text-center py-4">載入留言中...</div>

    <!-- 現有留言 -->
    <div v-else-if="comments.length > 0" class="comments-list overflow-y-auto">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <img
            :src="
              comment.author?.avatar ||
              comment.userAvatar ||
              'https://picsum.photos/40/40?random=1'
            "
            :alt="comment.author?.name || comment.userName || '匿名使用者'"
            class="avatar"
          />
          <span class="author-name">
            {{ comment.author?.name || comment.userName || "匿名使用者" }}
          </span>
          <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <button
          v-if="canDeleteComment(comment)"
          @click="deleteComment(comment.id)"
          class="delete-btn"
          :disabled="isDeletingComment === comment.id"
        >
          {{ isDeletingComment === comment.id ? "刪除中..." : "🗑️" }}
        </button>
      </div>
    </div>

    <div v-else class="text-center py-4 text-gray-500">
      還沒有留言，成為第一個留言的人吧！
    </div>

    <!-- 新增留言表單 -->
    <div class="add-comment">
      <textarea
        v-model="newComment"
        placeholder="寫下你的留言..."
        rows="3"
        class="comment-input"
        :disabled="isSubmitting"
      ></textarea>
      <button
        @click="submitComment"
        :disabled="!newComment.trim() || isSubmitting"
        class="submit-btn"
      >
        {{ isSubmitting ? "送出中..." : "發表留言" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const newComment = ref("");
const comments = ref([]);
const isSubmitting = ref(false);
const isLoading = ref(false);
const isDeletingComment = ref(null); // 追蹤正在刪除的留言 ID

// 假的留言資料（開發用）
// const fakeComments = [
//   {
//     id: 1,
//     content: "很棒的分享！我也想去台北玩",
//     author: {
//       id: 201,
//       name: "旅遊愛好者",
//       avatar: "https://picsum.photos/40/40?random=1",
//     },
//     createdAt: "2025-06-15T11:00:00Z",
//   },
//   {
//     id: 2,
//     content: "請問有推薦的住宿嗎？",
//     author: {
//       id: 202,
//       name: "背包客小李",
//       avatar: "https://picsum.photos/40/40?random=2",
//     },
//     createdAt: "2025-06-15T12:30:00Z",
//   },
// ];

// 取得目前使用者 ID
const getCurrentUserId = () => {
  // 實際應用中應該從登入狀態或 localStorage 取得
  return 1;
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

// 提交留言
const submitComment = async () => {
  if (!newComment.value.trim()) return;

  isSubmitting.value = true;

  try {
    // 修正 API 路徑，統一使用 post
    const response = await axios.post(
      `http://localhost:3000/api/post/${props.post.postId}/comments`,
      {
        content: newComment.value.trim(),
        memberId: getCurrentUserId(), //就是1
      }
    );

    // 成功後更新留言列表（加到頂部）
    comments.value.unshift(response.data);
    newComment.value = "";
    console.log("留言發表成功", response.data);
  } catch (error) {
    console.error("留言發表失敗:", error);

    // 開發階段：使用假資料模擬成功
    // const fakeNewComment = {
    //   id: Date.now(),
    //   content: newComment.value.trim(),
    //   author: {
    //     id: 999,
    //     name: "目前使用者",
    //     avatar: "https://picsum.photos/40/40?random=3",
    //   },
    //   createdAt: new Date().toISOString(),
    // };

    // comments.value.unshift(fakeNewComment);
    // newComment.value = "";
    // alert("留言發表成功（開發模式）");
  } finally {
    isSubmitting.value = false;
  }
};

// 載入留言
const loadComments = async () => {
  if (!props.post.postId) {
    console.warn("沒有貼文 ID");
    return;
  }

  // isLoading.value = true;
  try {
    console.log(`正在載入貼文 ${props.post.postId} 的留言`);

    const response = await axios.get(
      `http://localhost:3000/api/post/${props.post.postId}/comments`
    );
    comments.value = response.data;
    console.log("載入留言成功:", response.data);
  } catch (error) {
    console.error("載入留言失敗:", error);
  } finally {
    isLoading.value = false;
  }
};

// 檢查是否可以刪除留言
const canDeleteComment = (comment) => {
  const currentUserId = getCurrentUserId();
  // 只有留言者本人可以刪除自己的留言
  return comment.memberId === currentUserId;
};

// 刪除留言函數
const deleteComment = async (commentId) => {
  if (!confirm("確定要刪除這則留言嗎？")) {
    return;
  }

  isDeletingComment.value = commentId;

  try {
    console.log(`正在刪除留言 ${commentId}`);

    await axios.delete(
      `http://localhost:3000/api/posts/${props.post.id}/comments/${commentId}`
    );

    // 從本地陣列中移除已刪除的留言
    comments.value = comments.value.filter(
      (comment) => comment.id !== commentId
    );

    console.log("留言刪除成功");
    // 可選：顯示成功訊息
    // alert('留言已刪除');
  } catch (error) {
    console.error("刪除留言失敗:", error);

    if (error.response?.status === 403) {
      alert("您沒有權限刪除此留言");
    } else if (error.response?.status === 404) {
      alert("留言不存在或已被刪除");
      // 從本地陣列中移除不存在的留言
      comments.value = comments.value.filter(
        (comment) => comment.id !== commentId
      );
    } else {
      alert("刪除失敗，請稍後再試");
    }
  } finally {
    isDeletingComment.value = null;
  }
};

onMounted(() => {
  loadComments();
});
</script>

<style scoped>
.comment-section {
  padding: 16px;
}

.comment-item {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  margin-right: 8px;
}

.comment-time {
  font-size: 12px;
  color: #666;
}

.comment-content {
  margin: 0;
  line-height: 1.5;
}

.add-comment {
  margin-top: 16px;
}

.comment-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}

.comment-input:focus {
  outline: none;
  border-color: #007bff;
}

.submit-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
