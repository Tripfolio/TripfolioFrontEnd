<template>
    <div>
      <button @click="$emit('back-to-list')" class="mb-4 text-gray-600 hover:text-gray-800 flex items-center text-sm">
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="w-4 h-4 mr-1" />
        返回行程總覽
      </button>
      <div class="bg-white rounded-lg shadow-md overflow-hidden p-4 mb-6">
        <div class="relative w-full h-56 rounded-md mb-4 group overflow-hidden">
          <img v-if="trip.coverURL" :src="trip.coverURL" alt="行程封面" class="w-full h-full object-cover rounded-md" />
          <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            無封面圖片
          </div>
  
          <label for="cover-upload" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
            <font-awesome-icon :icon="['fas', 'camera']" class="w-6 h-6 mr-2" />
            更改封面
          </label>
          <input type="file" id="cover-upload" class="hidden" @change="handleCoverUpload" accept="image/*">
        </div>
  
        <div class="px-2">
          <h2 v-if="!isTitleEditing" @click="isTitleEditing = true" class="text-2xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-gray-700">
            {{ trip.title }}
            <font-awesome-icon :icon="['fas', 'pen-to-square']" class="ml-2 text-gray-500 text-lg" />
          </h2>
          <input
            v-else
            v-model="editableTitle"
            @blur="saveTitle"
            @keyup.enter="saveTitle"
            class="text-2xl font-bold text-gray-900 mb-2 p-1 border border-gray-300 rounded w-full"/>
  
          <p class="text-md text-gray-600 mb-2">
            {{ trip.startDate }} - {{ trip.endDate }} (共 {{ tripDays }} 天)
          </p>
          <div class="flex items-center text-gray-500 mb-4">
            <span class="text-sm">筆記：</span>
            <textarea
              v-model="editableNotes"
              @blur="saveNotes"
              class="flex-grow ml-2 p-2 border border-gray-300 rounded-md text-sm resize-y min-h-[60px] text-gray-800"
              placeholder="點擊這裡新增或編輯行程筆記...">
            </textarea>
          </div>
        </div>
      </div>
  
      <div v-if="showCropper" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div class="bg-white p-4 rounded-lg max-w-md w-full">
          <cropper ref="cropperRef" :src="cropImage" :stencil-props="{ aspect: 2 }" :autoZoom="true" :resizeImage="true" class="w-full h-64" />
          <div class="flex justify-end gap-2 mt-4">
            <button @click="cancelCrop" class="bg-gray-300 px-4 py-2 rounded">取消</button>
            <button type="button" @click="applyCrop" class="bg-blue-500 text-white px-4 py-2 rounded">裁切</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  trip: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'back-to-list',
  'update-cover',
  'update-title',
  'update-notes'
]);

const editableTitle = ref(props.trip.title);
const editableNotes = ref(props.trip.description || '');

const isTitleEditing = ref(false);

const showCropper = ref(false);
const cropImage = ref(null);
const cropperRef = ref(null);

watch(() => props.trip.title, (newTitle) => {
  editableTitle.value = newTitle;
});

watch(() => props.trip.description, (newNotes) => {
  editableNotes.value = newNotes || '';
});

const tripDays = computed(() => {
  if (props.trip.startDate && props.trip.endDate) {
    const start = new Date(props.trip.startDate);
    const end = new Date(props.trip.endDate);

    const startDateUTC = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
    const endDateUTC = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

    const diffTime = Math.abs(endDateUTC.getTime() - startDateUTC.getTime());

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }
  return 0;
});

const handleCoverUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
    cropImage.value = e.target.result;
    showCropper.value = true;
    };
    reader.readAsDataURL(file);
  }

  if (event.target) {
    event.target.value = null;
  }
};

const applyCrop = () => {
  if (cropperRef.value) {
    const { canvas } = cropperRef.value.getResult();
    if (canvas) {
      canvas.toBlob((blob) => {
        emit('update-cover', blob);
        showCropper.value = false;
        }, 'image/jpeg');
    }
  }
};

const cancelCrop = () => {
  showCropper.value = false;
  cropImage.value = null;
};

const saveTitle = () => {
  if (editableTitle.value !== props.trip.title) {
    emit('update-title', editableTitle.value);
  }
  isTitleEditing.value = false;
};

const saveNotes = () => {
  if (editableNotes.value !== props.trip.description) {
    emit('update-notes', editableNotes.value);
  }
};
</script>

<style scoped>
.z-50 {
  z-index: 50;
}
</style>