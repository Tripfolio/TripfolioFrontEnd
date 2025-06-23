<template>
  <div class="add-comment flex bg-[#d2e8b8] ">
    <input
      v-model="input"
      placeholder="寫下你的留言..."
      rows="1"
      class="comment-input"
      :disabled="isSubmitting"
    />
    <button
      @click="handleSubmit"
      :disabled="!input.trim() || isSubmitting"
      class="submit-btn"
    >
      {{ isSubmitting ? "送出中..." : "發表留言" }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

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
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}
.comment-input:focus {
  outline: none;
  border-color: #007bff;
}
.submit-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}
.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
