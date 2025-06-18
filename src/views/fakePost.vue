<template>
  <div class="posts-container">
    <!-- 貼文列表 -->
    <div class="posts-grid">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card cursor-pointer"
        @click="openPostDetail(post)"
      >
        <img
          :src="post.imageUrl"
          :alt="post.scheduleTitle"
          class="post-image"
        />
        <div class="post-info">
          <h3>{{ post.scheduleTitle }}</h3>
          <p>{{ post.content.substring(0, 100) }}...</p>
          <div class="post-meta">
            <span>{{ post.authorName }}</span>
            <span>❤️ {{ post.likes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 貼文詳情彈窗 -->
    <!-- <PostPopup
      v-if="showModal"
      :post="selectedPost"
      :isVisible="showModal"
      @close="closeModal"
      @update-post="updatePost"
    /> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import PostPopup from "../components/PostPopup.vue";

// 使用假資料
// const posts = ref([
//   {
//     id: 1,
//     scheduleTitle: "台北三日遊行程",
//     content:
//       "這是一個包含台北熱門景點的三日遊行程，適合初次來訪的旅客。第一天：台北101、象山步道；第二天：故宮博物院、士林夜市；第三天：九份老街、十分瀑布。",
//     authorName: "旅遊達人小王",
//     authorAvatar: "https://picsum.photos/400/300?random=7",
//     imageUrl: "https://picsum.photos/400/300?random=4",
//     likes: 15,
//     createdAt: "2025-06-15T10:30:00Z",
//   },
//   {
//     id: 2,
//     scheduleTitle: "高雄美食之旅",
//     content:
//       "高雄必吃美食攻略！從早餐的燒餅油條到宵夜的鹽酥雞，帶你品嚐道地的高雄味。推薦六合夜市、瑞豐夜市和美麗島站周邊的隱藏美食。",
//     authorName: "美食獵人小李",
//     authorAvatar: "https://picsum.photos/400/300?random=6",
//     imageUrl: "https://picsum.photos/400/300?random=5",
//     likes: 23,
//     createdAt: "2025-06-16T14:20:00Z",
//   },
// ]);

const selectedPost = ref(null);
const showModal = ref(false);

const openPostDetail = (post) => {
  selectedPost.value = post;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedPost.value = null;
};

const updatePost = (updatedPost) => {
  const index = posts.value.findIndex((p) => p.id === updatedPost.id);
  if (index !== -1) {
    posts.value[index] = updatedPost;
  }
};
</script>

<style scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.post-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-info {
  padding: 15px;
}

.post-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
}

.post-info p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}
</style>
