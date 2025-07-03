<template>
  <div class="add-comment flex flex-wrap items-center gap-2 mt-4">
    <input
      v-model="input"
      :placeholder="$t('請輸入留言')"
      rows="1"
      class="comment-input flex-1 min-w-0 p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
      :disabled="isSubmitting"
      @keyup.enter="emitSubmit"
    />
    <button
      @click="handleSubmit"
      :disabled="!input.trim() || isSubmitting"
      class="submit-btn whitespace-nowrap px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-300"
    >
      {{ isSubmitting ? $t("正在添加留言") : $t("已發送") }}
    </button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

const emit = defineEmits(["submit"]);
const input = ref("");

function emitSubmit() {
  const trimmed = input.value.trim();
  if (trimmed) {
    emit("submit", trimmed);
    input.value = "";
  }
}

const props = defineProps({
  isSubmitting: Boolean,
});

const handleSubmit = () => {
  if (!input.value.trim()) return;
  emit("submit", input.value.trim());
  input.value = ""; // 清空輸入框
};
</script>
