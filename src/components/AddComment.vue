<template>
  <div class="add-comment flex items-center gap-2">
    <input
      v-model="input"
      :placeholder="$t('addComment.placeholder')"
      rows="1"
      class="comment-input"
      :disabled="isSubmitting"
    />
    <button
      @click="handleSubmit"
      :disabled="!input.trim() || isSubmitting"
      class="submit-btn whitespace-nowrap"
    >
      {{ isSubmitting ? $t('addComment.sending') : $t('addComment.submit') }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  isSubmitting: Boolean,
});
const emits = defineEmits(["submit"]);

const input = ref("");

const handleSubmit = () => {
  if (!input.value.trim()) return;
  emits("submit", input.value.trim());
  input.value = ""; // 清空輸入框
};
</script>

<style scoped>
/* 你可以複製原本的 .add-comment、.comment-input、.submit-btn 樣式 */
.add-comment {
  margin-top: 16px;
}
.comment-input {
  width: 80%;
  height: 80%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 14px;
  resize: vertical;
  font-family: inherit;
}
.comment-input:focus {
  outline: none;
  border-color: #007bff;
}
.submit-btn {
  padding: 4px 8px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}
/* .submit-btn:disabled {
  background-color: #ccc;
} */
</style>
