<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4">{{ $t('emailSettings.title') }}</h2>
    <div v-if="loading">{{ $t('emailSettings.loading') }}</div>
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
        {{ $t('emailSettings.save') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const preferences = ref({
  onLogin: true,
  onLoginfail: true,
  onComment: true,
  onBookmark: true,
});

const labels = computed(() => ({
  onLogin: t('emailSettings.onLogin'),
  onLoginfail: t('emailSettings.onLoginfail'),
  onComment: t('emailSettings.onComment'),
  onBookmark: t('emailSettings.onBookmark'),
}));

const loading = ref(false);

const fetchPreferences = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(t('emailSettings.notLoggedInError') );
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
    alert(t('emailSettings.errorFetchingPreferences'))
  } finally {
    loading.value = false;
  }
};

const savePreferences = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(t('emailSettings.notLoggedInSaveError'));
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
    alert(t('emailSettings.preferencesUpdated'));
  } catch (err) {
    alert(t('emailSettings.saveError'));
  }
};

onMounted(() => {
  fetchPreferences();
});
</script>
