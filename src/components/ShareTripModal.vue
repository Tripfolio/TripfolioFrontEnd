<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
  >
    <div
      class="navbar-style w-full max-w-[500px] rounded-2xl shadow-xl p-6 sm:p-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-white">
          {{ $t("shareTripModal.shareTrip") }}
        </h2>
        <button
          @click="emit('close')"
          class="text-white hover:text-gray-400 text-lg cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- 權限選擇 -->
      <div class="mb-4">
        <label class="block mb-1 text-sm text-white font-medium">
          {{ $t("shareTripModal.permissionSetting") }}
        </label>
        <select
          v-model="selectedPermission"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-white shadow-sm cursor-pointer"
        >
          <option value="viewer">{{ $t("shareTripModal.viewOnly") }}</option>
          <option value="editor">{{ $t("shareTripModal.canEdit") }}</option>
        </select>
      </div>

      <button
        @click="generateShareLink"
        class="bg-white/30 hover:bg-black/20 text-white px-4 py-2 rounded-md w-full font-medium cursor-pointer"
        :disabled="isLoading"
      >
        {{ $t("shareTripModal.copyLink") }}
      </button>

      <!-- 分享結果區塊 -->
      <div v-if="shareUrl" class="mt-6">
        <label class="block mb-1 text-sm text-white font-medium">
          {{ $t("shareTripModal.shareLink") }}
        </label>
        <div class="flex items-center gap-2">
          <input
            :value="shareUrl"
            readonly
            class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-white shadow-sm"
          />
          <button
            @click="copyToClipboard"
            class="text-sm text-white hover:text-white/20 whitespace-nowrap cursor-pointer"
          >
            {{ $t("shareTripModal.copy") }}
          </button>
        </div>

        <div class="mt-4 flex justify-center">
          <qrcode-vue :value="shareUrl" :size="160" />
        </div>

        <div class="text-sm text-white mt-2 text-center">
          {{ $t("shareTripModal.expireTime") }}：{{ formattedExpire }}
        </div>
      </div>

      <!-- 共享者清單區塊 -->
      <div v-if="sharedUsers.length" class="mt-6">
        <h3 class="text-white font-semibold text-base mb-2">
          {{ $t("shareTripModal.currentSharedUsers") }}
        </h3>
        <div class="space-y-2">
          <div
            v-for="user in sharedUsers"
            :key="user.id"
            class="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 shadow-sm"
          >
            <div>
              <div class="font-medium text-white">{{ user.name }}</div>
              <div class="text-sm text-gray-400">{{ user.email }}</div>
            </div>

            <div class="flex items-center gap-2">
              <span
                v-if="user.role === 'owner'"
                class="text-sm text-gray-200 font-semibold"
                >{{ $t("shareTripModal.owner") }}</span
              >

              <template v-else>
                <select
                  v-if="isOwner"
                  v-model="user.role"
                  @change="updatePermission(user.id, user.role)"
                  class="text-sm border border-gray-300 rounded px-2 py-1 text-gray-700"
                >
                  <option value="viewer">
                    {{ $t("shareTripModal.viewer") }}
                  </option>
                  <option value="editor">
                    {{ $t("shareTripModal.editor") }}
                  </option>
                </select>

                <span v-else class="text-sm text-gray-500">{{
                  $t("shareTripModal." + user.role)
                }}</span>

                <button
                  v-if="isOwner"
                  @click="removeUser(user.id)"
                  class="text-red-500 hover:text-red-700 text-base"
                >
                  🗑
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

import QrcodeVue from "qrcode.vue";

const props = defineProps({
  tripId: Number,
  isOpen: Boolean,
});
const emit = defineEmits(["close"]);

const selectedPermission = ref("viewer");
const shareUrl = ref("");
const expiresAt = ref("");
const isLoading = ref(false);
const sharedUsers = ref([]);
const isOwner = ref(false);

const generateShareLink = async () => {
  const token = localStorage.getItem("token");

  try {
    isLoading.value = true;
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/tripShares/create/${props.tripId}`,
      {
        permission: selectedPermission.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      },
    );

    const data = {
      permission: selectedPermission.value, // 檢查 permission
    };

    shareUrl.value = res.data.shareUrl;
    expiresAt.value = res.data.expiresAt;

    // 更新共享名單
    // fetchSharedUsers();
  } catch (err) {
    alert($t("shareTripModal.createShareLinkFail"));
  } finally {
    isLoading.value = false;
  }
};

const fetchSharedUsers = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/tripShares/list/${props.tripId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      },
    );

    sharedUsers.value = res.data.data;
    isOwner.value = res.data.isOwner;
  } catch (err) {
    console.error("取得共享者清單失敗", err);
  }
};

const updatePermission = async (targetUserId, newRole) => {
  const token = localStorage.getItem("token");
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/tripShares/permission`,
      {
        targetUserId,
        tripId: props.tripId,
        newRole,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      },
    );
    alert($t("shareTripModal.permissionUpdated"));
  } catch (err) {
    alert($t("shareTripModal.permissionUpdateFail"));
  }
};

const removeUser = async (targetUserId) => {
  if (!confirm($t("shareTripModal.confirmRemoveUser"))) return;
  const token = localStorage.getItem("token");

  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/tripShares/remove/${targetUserId}/${props.tripId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // 放在 config 裡
      },
    );
    sharedUsers.value = sharedUsers.value.filter((u) => u.id !== targetUserId);
    alert($t("shareTripModal.removed"));
  } catch (err) {
    alert($t("shareTripModal.removeFail"));
  }
};

// 開啟 Modal 時觸發
watch(
  () => props.isOpen,
  (open) => {
    if (open) fetchSharedUsers();
  },
);

const copyToClipboard = () => {
  navigator.clipboard.writeText(shareUrl.value);
  alert($t("shareTripModal.copied"));
};

const formattedExpire = computed(() =>
  new Date(expiresAt.value).toLocaleString("zh-TW"),
);
</script>
