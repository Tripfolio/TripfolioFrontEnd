<template>
  <div class="comment-section">
    <h4>留言區</h4>

    <!-- 顯示現有留言 -->
    <div v-if="comments.length > 0" class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <img
            :src="comment.author.avatar"
            :alt="comment.author.name"
            class="avatar"
          />
          <span class="author-name">{{ comment.author.name }}</span>
          <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>

    <!-- 新增留言表單 -->
    <div class="add-comment">
      <textarea
        v-model="newComment"
        placeholder="寫下你的留言..."
        rows="3"
        class="comment-input"
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

// Props
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

// 響應式資料
const newComment = ref("");
const comments = ref([]);
const isSubmitting = ref(false);

// 假的留言資料
const fakeComments = [
  {
    id: 1,
    content: "很棒的分享！我也想去台北玩",
    author: {
      id: 201,
      name: "旅遊愛好者",
      avatar: "https://via.placeholder.com/40",
    },
    createdAt: "2025-06-15T11:00:00Z",
  },
  {
    id: 2,
    content: "請問有推薦的住宿嗎？",
    author: {
      id: 202,
      name: "背包客小李",
      avatar: "https://via.placeholder.com/40",
    },
    createdAt: "2025-06-15T12:30:00Z",
  },
];

// 提交留言
const submitComment = async () => {
  if (!newComment.value.trim()) return;

  isSubmitting.value = true;

  try {
    // 實際的 API 呼叫
    const response = await axios.post(`/api/posts/${props.post.id}/comments`, {
      content: newComment.value.trim(),
      // memberId: currentMemberId // 從登入狀態取得
    });

    // 成功後更新留言列表
    comments.value.push(response.data);
    newComment.value = "";
    console.log("留言發表成功", response.data);
  } catch (error) {
    console.error("留言發表失敗:", error);

    // 開發階段：使用假資料模擬成功
    const fakeNewComment = {
      id: Date.now(),
      content: newComment.value.trim(),
      author: {
        id: 999,
        name: "目前使用者",
        avatar: "https://via.placeholder.com/40",
      },
      createdAt: new Date().toISOString(),
    };

    comments.value.push(fakeNewComment);
    newComment.value = "";
    alert("留言發表成功（開發模式）");
  } finally {
    isSubmitting.value = false;
  }
};

// 格式化時間
const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleString("zh-TW");
};

// 載入留言
const loadComments = async () => {
  try {
    // 實際的 API 呼叫
    const response = await axios.get(`/api/posts/${props.post.id}/comments`);
    comments.value = response.data;
  } catch (error) {
    console.error("載入留言失敗:", error);
    // 開發階段：使用假資料
    comments.value = fakeComments;
  }
};

// 組件掛載時載入留言
onMounted(() => {
  loadComments();
});
</script>

<style scoped>
.comment-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.comments-list {
  margin-bottom: 20px;
}

.comment-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.author-name {
  font-weight: bold;
  margin-right: 10px;
}

.comment-time {
  color: #666;
  font-size: 12px;
}

.comment-content {
  margin: 0;
  line-height: 1.5;
}

.add-comment {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.submit-btn {
  align-self: flex-end;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
