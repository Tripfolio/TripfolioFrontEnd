<template>

  <div class="p-2 max-w-xl">
    <div v-if="loading">{{ $t('emailSettings.loading') }}</div>

    <div v-else>
      <div
        v-for="(_value, key) in preferences"
        :key="key"
        class="flex items-center py-3"
      >
        <input type="checkbox" v-model="preferences[key]" />
        <span>{{ labels[key] }}</span>
      </div>
      <button
        @click="savePreferences"
        class="text-gray text-sm cursor-pointer bg-black/30 rounded-full px-5 py-0.5 relative top-4"
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
