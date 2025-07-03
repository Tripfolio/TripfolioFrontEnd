<template>
  <div class="comment-section">
    <!-- <h4>留言區</h4> -->

    <div v-if="isLoading" class="text-center py-4">{{ $t('commentSection.loadingComments') }}</div>

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
        <div class="flex justify-between">
          <p class="comment-content">{{ comment.content }}</p>
          <button
            v-if="canDeleteComment(comment)"
            @click="deleteComment(comment.id)"
            class="delete-btn"
            :disabled="isDeletingComment === comment.id"
          >
            {{ isDeletingComment === comment.id ? $t('commentSection.deleting') : "🗑️" }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-4">
      {{ $t('commentSection.noComments') }}
    </div>

    <AddComment
      :isSubmitting="isSubmitting"
      @submit="submitComment"
      class="mt-4 w-[90%]"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AddComment from "../components/AddComment.vue";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["comment-added"]);
const comments = ref([]);
const isSubmitting = ref(false);
const isLoading = ref(false);
const isDeletingComment = ref(null); // 追蹤正在刪除的留言 ID

// 取得目前使用者 ID
const getCurrentUserId = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // 根據實際 payload key 調整
      return payload.userId || payload.id || payload.memberId || null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

const submitComment = async (commentText) => {
  if (!commentText.trim()) return;
  isSubmitting.value = true;
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/post/${props.post.postId}/comments`,
      {
        content: commentText,
        memberId: getCurrentUserId(),
      },
    );
    comments.value.unshift(response.data);

    // 更新本地計數
    const newCommentCount = (props.post.commentCount || 0) + 1;

    // 發送詳細的更新資訊
    emit("comment-added", {
      postId: props.post.postId,
      commentCount: newCommentCount,
    });
  } catch (error) {
    console.error("留言發表失敗", error);
  } finally {
    isSubmitting.value = false;
  }
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return $t('commentSection.justNow');
  if (diff < 3600000) return `${Math.floor(diff / 60000)}${$t('commentSection.minutesAgo')}`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ${$t('commentSection.hoursAgo')}`;

  return date.toLocaleDateString("zh-TW");
};

const loadComments = async () => {
  if (!props.post.postId) {
    return;
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/post/${props.post.postId}/comments`,
    );
    comments.value = response.data;
  } catch (error) {
    console.error("載入留言失敗:", error);
  } finally {
    isLoading.value = false;
  }
};

const canDeleteComment = (comment) => {
  const currentUserId = getCurrentUserId();
  // 只有本人可以刪除
  return comment.memberId === currentUserId;
};

const deleteComment = async (commentId) => {
  if (!confirm(t('commentSection.deleteConfirm'))) {
    return;
  }

  isDeletingComment.value = commentId;

  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/post/${props.post.postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    // 從本地陣列中移除已刪除的留言
    comments.value = comments.value.filter(
      (comment) => comment.id !== commentId,
    );

    // 更新本地計數
    const newCommentCount = Math.max(0, (props.post.commentCount || 0) - 1);

    // 發送詳細的更新資訊
    emit("comment-added", {
      postId: props.post.postId,
      commentCount: newCommentCount,
    });
  } catch (error) {
    if (error.response?.status === 403) {
      alert(t('commentSection.noPermissionDelete'));
    } else if (error.response?.status === 404) {
      alert(t('commentSection.commentNotFound'));
      // 從本地陣列中移除不存在的留言
      comments.value = comments.value.filter(
        (comment) => comment.id !== commentId,
      );
    } else {
      alert(t('commentSection.deleteFail'));
    }
  }
};

onMounted(() => {
  loadComments();
});
</script>

<style scoped>
@media (max-width: 640px) {
  .comment-header {
    flex-wrap: wrap;
    gap: 4px;
  }

  .comment-time {
    width: 100%;
    margin-left: 40px; /* avatar 寬度對齊 */
  }

  .submit-btn {
    width: 100%;
  }
}
.comment-section {
  padding: 16px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.comments-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
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
