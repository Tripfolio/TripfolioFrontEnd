<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-xl w-[500px]">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">分享行程</h2>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <!-- 權限選擇 -->
      <div class="mb-4">
        <label class="block mb-1 font-medium">權限設定</label>
        <select
          v-model="selectedPermission"
          class="w-full border rounded px-3 py-2"
        >
          <option value="viewer">僅可檢視</option>
          <option value="editor">可編輯</option>
        </select>
      </div>

      <button
        @click="generateShareLink"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        :disabled="isLoading"
      >
        產生分享連結
      </button>

      <!-- 分享結果區塊 -->
      <div v-if="shareUrl" class="mt-6">
        <label class="block mb-1 font-medium">分享連結</label>
        <div class="flex items-center space-x-2">
          <input
            :value="shareUrl"
            readonly
            class="flex-1 border rounded px-2 py-1"
          />
          <button @click="copyToClipboard" class="text-sm text-blue-500">
            複製
          </button>
        </div>

        <div class="mt-4 flex justify-center">
          <qrcode-vue :value="shareUrl" :size="160" />
        </div>

        <div class="text-sm text-gray-500 mt-2">
          到期時間：{{ formattedExpire }}
        </div>
      </div>

      <!-- 共享者清單區塊 -->
      <div v-if="sharedUsers.length" class="mt-6">
        <h3 class="font-bold mb-2">目前共享的使用者</h3>
        <div class="space-y-2">
          <div
            v-for="user in sharedUsers"
            :key="user.id"
            class="flex items-center justify-between border px-3 py-2 rounded"
          >
            <div>
              <div class="font-medium">{{ user.name }}</div>
              <div class="text-sm text-gray-500">{{ user.email }}</div>
            </div>

            <div class="flex items-center space-x-2">
              <span
                v-if="user.role === 'owner'"
                class="text-sm text-blue-500 font-semibold"
                >建立者</span
              >

              <template v-else>
                <select
                  v-if="isOwner"
                  v-model="user.role"
                  @change="updatePermission(user.id, user.role)"
                  class="text-sm border rounded px-2 py-1"
                >
                  <option value="viewer">檢視者</option>
                  <option value="editor">編輯者</option>
                </select>

                <span v-else class="text-sm text-gray-500">{{
                  user.role
                }}</span>

                <button
                  v-if="isOwner"
                  @click="removeUser(user.id)"
                  class="text-red-500 hover:text-red-700"
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
  console.log("發送的 Token:", token);
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
    console.log("發送的資料:", data);
    shareUrl.value = res.data.shareUrl;
    expiresAt.value = res.data.expiresAt;

    // 更新共享名單
    // fetchSharedUsers();
  } catch (err) {
    alert("建立分享連結失敗");
    console.error(err);
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
    alert("權限已更新");
  } catch (err) {
    alert("權限更新失敗");
    console.error(err);
  }
};

const removeUser = async (targetUserId) => {
  if (!confirm("確定要取消共享這位使用者嗎？")) return;
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
    alert("已取消共享");
  } catch (err) {
    alert("取消共享失敗");
    console.error(err);
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
  alert("已複製分享連結");
};

const formattedExpire = computed(() =>
  new Date(expiresAt.value).toLocaleString("zh-TW"),
);
</script>
