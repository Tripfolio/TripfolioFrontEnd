<template>
  <div class="homepage-bg min-h-screen relative bg-cover bg-center">
    <div class="member-center w-[70%] mx-auto">
      <main class="navbar-style mt-25 rounded-2xl min-h-140">
        <header class="header rounded-tl-2xl rounded-tr-2xl">
          <h5>{{ $t("memberHub.memberCenter") }}</h5>
        </header>

        <!-- 使用者頭像與名稱 -->
        <section class="user-info">
          <img
            :src="user.avatar + '?t=' + avatarTimestamp"
            alt="使用者頭像"
            class="avatar"
          />
          <div class="info">
            <h1>{{ user.name }}</h1>
            <a
              class="text-gray"
              href="#"
              @click.prevent="showMemberProfile = true"
              >{{ $t("memberHub.edit") }}</a
            >
            <hr />
            <a class="text-gray" href="#" @click.prevent="goToLogin">{{
              $t("memberHub.logout")
            }}</a>
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
          <template v-if="activeTab === 'posts'">
            <CardGrid :items="posts" @click-card="goToPost" />
          </template>
          <template v-else-if="activeTab === 'collected'">
            <CardGrid :items="collected" @click-card="goToPost" />
          </template>
          <template v-else-if="activeTab === 'notifications'">
            <EmailSettings />
          </template>
          <template v-else-if="activeTab === 'language'">
            <Language />
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
            @close-modal="showMemberProfile = false"
            @update-profile="
              fetchData();
              avatarTimestamp.value = Date.now();
              showMemberProfile = false;
            "
            @profile-updated="handleProfileUpdated"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import CardGrid from "@/components/CardGrid.vue";
import MemberProfile from "../views/MemberProfile.vue";
import EmailSettings from "../views/EmailSettings.vue";
import { useI18n } from "vue-i18n";
import Language from "./Language.vue";
const { t, locale } = useI18n();

const router = useRouter();
const route = useRoute();

const user = ref({ name: "", avatar: "" });
const travels = ref([]);
const posts = ref([]);
const collected = ref([]);
const showMemberProfile = ref(false);
const avatarTimestamp = ref(Date.now());

const tabs = computed(() => [
  { key: "travels", label: t('memberHub.myTravels') },
  { key: "posts", label: t('memberHub.myPosts') },
  { key: "collected", label: t('memberHub.collectedPosts') },
  { key: "notifications", label: t('memberHub.notifications') },
  { key: "language", label: t('memberHub.language') },
]);
const activeTab = ref("travels");

const fetchData = async () => {
  const token = localStorage.getItem("token");
  if (!token) return alert(t("memberHub.pleaseLogin"));

  const decoded = jwtDecode(token);
  const memberId = decoded.id;

  try {
    const [userRes, travelRes, postRes, collectRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${import.meta.env.VITE_API_URL}/api/travelSchedule/user`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(
        `${import.meta.env.VITE_API_URL}/api/allposts?page=1&limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
      axios.get(
        `${import.meta.env.VITE_API_URL}/api/favorites/user/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    ]);
    user.value = {
      name: userRes.data.name || "訪客",
      avatar: userRes.data.avatar || "http://picsum.photos/300/200",
    };

    travels.value = travelRes.data.schedules.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.coverURL,
    }));

    posts.value = postRes.data.posts
      .filter((item) => item.id === memberId)
      .map((item) => ({
        id: item.postId,
        title: item.content || t("memberHub.unnamedPost"),
        coverImage: item.imageUrl,
      }));

    collected.value = collectRes.data.map((item) => ({
      id: item.postId,
      title: item.postTitle || t("memberHub.unnamedPost"),
      coverImage: item.postImageUrl,
    }));
  } catch (err) {
    console.warn("取得資料失敗", err);
  }
};
const handleProfileUpdated = (newData) => {
  user.value.name = newData.name;
  user.value.avatar = newData.avatar;
};

onMounted(fetchData);
watch(() => route.fullPath, fetchData);

const goToTravel = () => {
  router.push({ path: "/schedule" });
};

const goToPost = (id) =>
  router.push({ path: "/community", query: { postId: id } });

const goToLogin = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("login-status-changed"));
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
