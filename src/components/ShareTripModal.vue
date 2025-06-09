<template>
  <div class="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
    <!-- 分頁標籤 -->
    <div class="flex border-b mb-4">
      <button
        class="flex-1 py-2 text-center font-semibold"
        :class="
          activeTab === 'share'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500'
        "
        @click="activeTab = 'share'"
      >
        分享行程
      </button>
      <button
        class="flex-1 py-2 text-center font-semibold"
        :class="
          activeTab === 'invite'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500'
        "
        @click="activeTab = 'invite'"
      >
        邀請共編
      </button>
    </div>

    <!-- Tab: 邀請共編 -->
    <div v-if="activeTab === 'invite'">
      <!-- 權限選單 -->
      <div class="relative mb-4">
        <button
          @click="togglePermissionDropdown"
          class="w-full border border-gray-300 rounded-md py-2 px-4 text-left flex justify-between items-center hover:bg-gray-100"
        >
          {{ permission === "editor" ? "可編輯" : "僅供檢視" }}
          <svg
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <!-- Dropdown -->
        <ul
          v-if="showDropdown"
          class="absolute z-10 bg-white w-full mt-1 border border-gray-200 rounded-md shadow"
        >
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click="setPermission('viewer')"
          >
            僅供檢視
          </li>
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click="setPermission('editor')"
          >
            可編輯
          </li>
        </ul>
      </div>

      <!-- QRCode + 說明 -->
      <div v-if="shareUrl" class="flex flex-col items-center space-y-3 my-4">
        <qrcode-vue :value="shareUrl" :size="160" />
        <p class="text-sm text-gray-500 text-center leading-snug">
          手機掃描條碼，即可查看此行程<br />24 小時內有效
        </p>
      </div>

      <!-- 複製按鈕 -->
      <button
        @click="copyToClipboard"
        class="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
      >
        複製連結
      </button>

      <!-- 成員清單 -->
      <div class="mt-6">
        <h3 class="text-base font-semibold mb-2">共編成員</h3>
        <ul class="space-y-3 max-h-60 overflow-y-auto">
          <li
            v-for="member in members"
            :key="member.name"
            class="flex items-center justify-between border px-3 py-2 rounded-md"
          >
            <div class="flex items-center space-x-3">
              <img
                :src="member.avatarUrl"
                alt="avatar"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p class="font-medium">{{ member.name }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <!-- 權限下拉 -->
              <select
                v-model="member.permission"
                class="border rounded-md px-2 py-1 text-sm"
                @change="changePermission(member)"
              >
                <option value="editor">可編輯</option>
                <option value="viewer">僅供檢視</option>
              </select>

              <!-- 刪除按鈕 -->
              <button
                @click="removeMember(member)"
                class="text-red-500 hover:text-red-700 disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import QrcodeVue from "qrcode.vue";
import axios from "axios";

const props = defineProps({
  tripId: {
    type: String,
    required: true,
  },
});

const activeTab = ref("invite");
const permission = ref("editor");
const shareUrl = ref("");
const showDropdown = ref(false);
const members = ref([]);

const togglePermissionDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const setPermission = async (type) => {
  permission.value = type;
  showDropdown.value = false;
  await generateShareUrl();
};

const generateShareUrl = async () => {
  try {
    const res = await axios.post(`/api/trip-shares/${props.tripId}`, {
      permission: permission.value,
    });
    shareUrl.value = res.data.shareLink;
    await fetchMembers();
  } catch (err) {
    console.error("產生連結失敗", err);
  }
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    alert("已複製連結！");
  } catch (err) {
    alert("複製失敗");
  }
};

// 共編成員功能區

const fetchMembers = async () => {
  try {
    const res = await axios.get(`/api/trip-shares/${props.tripId}`);
    members.value = res.data.map((item) => ({
      token: item.token, // 加上 token 供後續修改/刪除用
      permission: item.permission,
      name: item.sharedWithUserId,
      // avatarUrl: "/default-avatar.png", // 頭像須從user資料取得
    }));
  } catch (err) {
    console.error("取得共編成員失敗", err);
  }
};

const changePermission = async (member) => {
  try {
    await axios.put(`/api/trip-shares/${member.token}`, {
      permission: member.permission,
    });
  } catch (err) {
    alert("變更權限失敗");
  }
};

const removeMember = async (member) => {
  if (!confirm(`確定要移除 ${member.name} 嗎？`)) return;
  try {
    await axios.delete(`/api/trip-shares/${member.token}`);
    await fetchMembers();
  } catch (err) {
    alert("移除失敗");
  }
};

onMounted(() => {
  fetchMembers();
});
</script>
