<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4">{{ t("emailNotify.loading") }}</h2>
    <div v-if="loading">{{ t("emailNotify.loading") }}</div>
    <div v-else>
      <div
        v-for="(_value, key) in preferences"
        :key="key"
        class="flex items-center justify-between py-2 border-b"
      >
        <span>{{ labels[key] }}</span>
        <input type="checkbox" v-model="preferences[key]" />
      </div>
      <button
        @click="savePreferences"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {{ t("emailNotify.save") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n"
const { t } = useI18n()

const preferences = ref({
  onLogin: true,
  onLoginfail: true,
  onComment: true,
  onBookmark: true,
});

const labels = {
  onLogin: t("emailNotify.onLogin"),
  onLoginfail: t("emailNotify.onLoginfail"),
  onComment: t("emailNotify.onComment"),
  onBookmark: t("emailNotify.onBookmark"),
};

const loading = ref(false);

const fetchPreferences = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(t("emailNotify.notLoggedInLoad"));
      return; // 提早結束
    }

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/email-preferences/get`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    preferences.value = data;
  } catch (err) {
    alert(t("emailNotify.loadFailed"));
  } finally {
    loading.value = false;
  }
};

const savePreferences = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(t("emailNotify.notLoggedInSave"));
      return;
    }

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/email-preferences/update`,
      { preferences: preferences.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    alert(t("emailNotify.success"));
  } catch (err) {
    alert(t("emailNotify.saveFailed"));
  }
};

onMounted(() => {
  fetchPreferences();
});
</script>
