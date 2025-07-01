<template>
  <div class="homepage-bg min-h-screen relative bg-cover bg-center">
    <div class="member-center w-[70%] mx-auto">
      <main class="navbar-style mt-25 rounded-2xl min-h-140">
        <header class="header rounded-tl-2xl rounded-tr-2xl">
          <h5>會員中心</h5>
        </header>

        <!-- 使用者頭像與名稱 -->
        <section class="user-info">
          <img :src="user.avatar" alt="使用者頭像" class="avatar" />
          <div class="info">
            <h1>{{ user.name }}</h1>
            <a
              class="text-gray"
              href="#"
              @click.prevent="showMemberProfile = true"
              >編輯</a
            >
            <hr />
            <a class="text-gray" href="#" @click.prevent="goToLogin">登出</a>
          </div>
        </section>

        <!-- Tab 切換 -->
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="{ active: activeTab === tab.key }"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 各分頁內容 -->
        <section class="tab-content">
          <template v-if="activeTab === 'travels'">
            <CardGrid :items="travels" @click-card="goToTravel" />
          </template>
          <template v-else-if="activeTab === 'collected'">
            <CardGrid :items="collectedPosts" @click-card="goToPost" />
          </template>
          <template v-else-if="activeTab === 'notifications'">
            <div class="notice">通知設定區塊</div>
          </template>
        </section>
      </main>

      <!-- 彈出視窗 -->
      <div
        v-if="showMemberProfile"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        @click.self="showMemberProfile = false"
      >
        <div class="relative">
          <MemberProfile
            @close-modal="
              showMemberProfile = false;
              console.log('close-modal 被觸發了');
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import CardGrid from "@/components/CardGrid.vue"; // 你需自行建立
import MemberProfile from "../views/MemberProfile.vue";

const router = useRouter();
const route = useRoute();

const user = ref({ name: "", avatar: "" });
const travels = ref([]);
const posts = ref([]);
const collectedPosts = ref([]);
const showMemberProfile = ref(false);

const tabs = [
  { key: "travels", label: "我建立的行程" },
  { key: "collected", label: "我收藏的貼文" },
  { key: "notifications", label: "通知設定" },
];
const activeTab = ref("travels");

const fetchData = async () => {
  const token = localStorage.getItem("token");
  if (!token) return alert("請先登入會員");

  const decoded = jwtDecode(token);
  const memberId = decoded.id;

  try {
    const [userRes, travelRes, favRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${import.meta.env.VITE_API_URL}/api/travelSchedule/user`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      //   axios.get(
      //     `${import.meta.env.VITE_API_URL}/api/favorites/user/${memberId}`,
      //     {
      //       headers: { Authorization: `Bearer ${token}` },
      //     },
      //   ),
    ]);
    // console.log(favRes);

    user.value = {
      name: userRes.data.name || "訪客",
      avatar: userRes.data.avatar || "http://picsum.photos/300/200",
    };

    travels.value = travelRes.data.schedules.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.coverURL,
    }));

    // posts.value = travelRes.data.posts.map((item) => ({
    //   id: item.id,
    //   title: item.title,
    //   image: item.imageUrl,
    // }));

    // collectedPosts.value = collectRes.data.map((item) => ({
    //   id: item.postId,
    //   title: item.postTitle,
    //   image: item.postImageUrl,
    // }));
  } catch (err) {
    console.warn("取得資料失敗", err);
  }
};

onMounted(fetchData);
watch(() => route.fullPath, fetchData);

const goToTravel = (id) =>
  router.push({ path: `/schedule/${id}`, query: { from: "tracker" } });

const goToPost = (id) =>
  router.push({ path: "/community", query: { postId: id } });

const goToLogin = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style scoped>
.member-center {
  padding: 2rem;
}

.header {
  background: #666;
  padding: 1rem;
  font-weight: bold;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  object-fit: cover;
}
.tabs {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}
.tabs button.active {
  border-bottom: 2px solid #60a5fa;
  color: white;
}
.tab-content {
  padding: 1rem;
}
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}
</style>
