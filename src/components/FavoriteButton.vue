<template>
  <button
    @click="toggleFavorite"
    :disabled="isLoading"
    class="favorite-btn bg-red-700"
    :class="{ favorited: isFavorited }"
  >
    {{ isFavorited ? "❤️" : "🤍" }}
    <span v-if="isLoading">...</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
  memberId: {
    type: Number,
    required: true,
  },
});

const isFavorited = ref(false);
const isLoading = ref(false);

// 檢查收藏狀態
const checkFavoriteStatus = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/favorites/check/${props.postId}/${props.memberId}`
    );
    isFavorited.value = response.data.isFavorited;

    console.log("應該檢查成功了吧");
  } catch (error) {
    console.error("檢查收藏狀態失敗:", error);
  }
};

const toggleFavorite = async () => {
  isLoading.value = true;

  try {
    if (isFavorited.value) {
      await axios.delete(
        `http://localhost:3000/api/favorites/${props.postId}`,
        {
          data: { memberId: props.memberId },
        }
      );
      isFavorited.value = false;
      console.log("已取消收藏");
    } else {
      // 新增
      await axios.post("http://localhost:3000/api/favorites", {
        postId: props.postId,
        memberId: props.memberId,
      });
      isFavorited.value = true;
    }
  } catch (error) {
    console.error("切換收藏狀態失敗:", error);
    alert("操作失敗，請稍後再試");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  checkFavoriteStatus();
});
</script>

<style scoped>
.favorite-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
