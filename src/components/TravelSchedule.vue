<template>
  <div class="relative max-w-xl mx-auto p-4 border rounded bg-white">
    <button
      type="button"
      @click="handleClose"
      class="absolute top-2 right-2 text-xl"
    >
      <font-awesome-icon :icon="['fas', 'xmark']" />
    </button>
    <form
      @submit.prevent="scheduleSubmit"
      class="space-y-4 p-4 rounded max-w-xl mx-auto"
    >
      <span class="text-2xl font-bold">{{ $t('travelSchedule.title') }}</span>

      <div class="relative">
        <img
          :src="coverPreviewUrl || defaultCover"
          class="w-full h-48 object-cover rounded-xl shadow"
          alt="封面圖片"
        />
        <div class="absolute op-0 right-0 size-40">
          <button
            type="button"
            @click="uploadFile"
            class="bg-white px-3 py-1 rounded-full shadow flex items-center gap-1"
          >
            <font-awesome-icon :icon="['fas', 'pen-to-square']" />{{ $t('travelSchedule.uploadImage') }}
          </button>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFile"
          class="hidden"
        />
      </div>

      <div
        v-if="showCropper"
        class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      >
        <div class="bg-white p-4 rounded-lg max-w-md w-full">
          <cropper
            ref="cropperRef"
            :src="cropImage"
            :stencil-props="{ aspect: 2 }"
            :autoZoom="true"
            :resizeImage="true"
            class="w-full h-64"
          />
          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="showCropper = false"
              class="bg-gray-300 px-4 py-2 rounded"
            >
              {{ $t('travelSchedule.cancel') }}
            </button>
            <button
              type="button"
              @click="applyCrop"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {{ $t('travelSchedule.crop') }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label class="block mb-1"
          >{{ $t('travelSchedule.name') }}<span class="text-red-500">*</span></label
        >
        <input
          type="text"
          v-model="title"
          class="border p-2 w-full rounded"
          :placeholder="$t('travelSchedule.namePlaceholder')"
        />
      </div>

      <div>
        <label class="block mb-1"
          >{{ $t('travelSchedule.date') }}<span class="text-red-500">*</span></label
        >
        <div>
          <input type="date" v-model="startDate" class="border p-2 rounded" />
          <span> - </span>
          <input
            type="date"
            v-model="endDate"
            :min="startDate"
            class="border p-2 rounded"
          />
          <span v-if="days > 0" class="text-sm text-gray-500 mt-1">
            {{ $t('travelSchedule.totalDays', { days }) }}</span
          >
        </div>
      </div>

      <div>
        <label class="block mb-1">{{ $t('travelSchedule.descLabel') }}</label>
        <textarea
          v-model="description"
          class="border p-2 w-full h-24 rounded"
          :placeholder="$t('travelSchedule.descPlaceholder')"
        ></textarea>
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="scheduleCancel"
          class="bg-gray-300 hover:bg-gray-200 px-4 py-2 rounded"
        >
          {{ $t('travelSchedule.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="isLoading"
          class="bg-blue-400 hover:bg-blue-300 text-white px-4 py-2 rounded"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            {{ $t('travelSchedule.saving') }}<span
              class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"
            ></span>
          </span>
          <span v-else> {{ $t('travelSchedule.create') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { Cropper } from "vue-advanced-cropper";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
const router = useRouter();
import "vue-advanced-cropper/dist/style.css";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const emit = defineEmits(["close", "submitted"]);

const file = ref(null);
const title = ref("");
const startDate = ref("");
const endDate = ref("");
const days = ref(0);
const description = ref("");
const isDirty = ref(false);
const showCropper = ref(false);
const cropImage = ref(null);
const cropperRef = ref(null);
const createdScheduleId = ref(null);
const isLoading = ref(false);

const coverPreviewUrl = ref("");
const defaultCover = "https://fakeimg.pl/800x400/?text=行程封面&font=noto";

const fileInput = ref(null);

const uploadFile = () => {
  fileInput.value.click();
};

const handleFile = (event) => {
  file.value = event.target.files[0];
  if (file.value) {
    cropImage.value = URL.createObjectURL(file.value);
    showCropper.value = true;
  }
};

const applyCrop = () => {
  const canvas = cropperRef.value?.getResult()?.canvas;
  if (canvas) {
    canvas.toBlob((blob) => {
      file.value = new File([blob], `cropper-image.png`, { type: "image/png" });
      coverPreviewUrl.value = URL.createObjectURL(file.value);
      showCropper.value = false;
    }, "image/png");
  }
};

watch([startDate, endDate], () => {
  if (startDate.value && endDate.value) {
    const diff = dayjs(endDate.value).diff(dayjs(startDate.value), "day") + 1;
    days.value = diff > 0 ? diff : 0;
  } else {
    days.value = 0;
  }
});

watch([title, startDate, endDate, description, file], () => {
  isDirty.value = true;
});

const handleClose = () => {
  if (isDirty.value) {
    const confirmExit = const confirmExit = confirm(t('travelSchedule.confirmExit'));;
    if (!confirmExit) return;
  }
  emit("close");
};

const scheduleCancel = () => {
  file.value = null;
  coverPreviewUrl.value = "";
  title.value = "";
  startDate.value = "";
  endDate.value = "";
  days.value = 0;
  description.value = "";
  isDirty.value = false;
};

const scheduleSubmit = async () => {
  if (!title.value || !startDate.value || !endDate.value) {
    alert(t('travelSchedule.alertFill'));
    return;
  }

  const token = localStorage.getItem("token");
  const formData = new FormData();
  if (file.value) formData.append("cover", file.value);
  formData.append("title", title.value);
  formData.append("startDate", startDate.value);
  formData.append("endDate", endDate.value);
  formData.append("description", description.value);

  try {
    isLoading.value = true;
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/travelSchedule`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const newId = res.data.schedule.id;
    createdScheduleId.value = newId;

    alert(t('travelSchedule.alertSuccess'));
    isDirty.value = false;
    emit("submitted", newId);
  } catch (err) {
    alert(t('travelSchedule.alertFail'));
  } finally {
    isLoading.value = false;
  }
};
</script>