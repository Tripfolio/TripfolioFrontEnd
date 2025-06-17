<template>
    <div class="relative max-w-xl mx-auto p-4 border rounded bg-white">
        <button type="button" @click="handleClose" class="absolute top-2 right-2 text-xl"><font-awesome-icon :icon="['fas', 'xmark']" /></button>
        <form @submit.prevent="scheduleSubmit" class="space-y-4 p-4 rounded max-w-xl mx-auto">
            <span class="text-2xl font-bold">行程設定</span>

            <div class="relative">
                <img :src="coverPreviewUrl || defaultCover" class="w-full h-48 object-cover rounded-xl shadow" alt="封面圖片">
                <div class="absolute op-0 right-0 size-40">
                    <button type="button" @click="uploadFile" class="bg-white px-3 py-1 rounded-full shadow flex items-center gap-1"><font-awesome-icon :icon="['fas', 'pen-to-square']" />上傳圖片</button>
                </div>
                <input ref="fileInput" type="file" accept="image/*" @change="handleFile" class="hidden">
            </div>

            <div v-if="showCropper" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                <div class="bg-white p-4 rounded-lg max-w-md w-full">
                    <cropper ref="cropperRef" :src="cropImage" :stencil-props="{ aspect: 2 }" :autoZoom="true" :resizeImage="true" class="w-full h-64" />
                    <div class="flex justify-end gap-2 mt-4">
                        <button @click="showCropper = false" class="bg-gray-300 px-4 py-2 rounded">取消</button>
                        <button type="button" @click="applyCrop" class="bg-blue-500 text-white px-4 py-2 rounded">裁切</button>                   
                    </div>
                </div>
            </div>

            <div>
                <label class="block mb-1">行程名稱<span class="text-red-500">*</span></label>
                <input type="text" v-model="title" class="border p-2 w-full rounded" placeholder="幫行程取個名字⸜(*ˊᗜˋ*)⸝">
            </div>

            <div>
                <label class="block mb-1">行程日期<span class="text-red-500">*</span></label>
                <div>
                    <input type="date" v-model="startDate" class="border p-2 rounded"/>
                    <span> - </span>
                    <input type="date" v-model="endDate" :min="startDate" class="border p-2 rounded"/>
                    <span v-if="days > 0" class="text-sm text-gray-500 mt-1"> 共 {{ days }} 天</span>
                </div>
            </div>

            <div>
                <label class="block mb-1">行程描述(可選填)</label>
                <textarea v-model="description" class="border p-2 w-full h-24 rounded" placeholder="請簡單記錄一下自己的行程吧~(ﾉ˶>ᗜ​<˵)ﾉ"></textarea>
            </div>

            <div class="flex justify-end gap-2">
                <button type="button" @click="scheduleCancel" class="bg-gray-300 hover:bg-gray-200 px-4 py-2 rounded">取消</button>
                <button type="submit" class="bg-blue-400 hover:bg-blue-300 text-white px-4 py-2 rounded">建立</button>
            </div>
        </form>
    </div>
</template>



<script setup>
import{ ref, watch } from 'vue';
import axios from 'axios'; 
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

/* global defineEmits */
const emit = defineEmits(['close'])

//狀態
const file = ref(null)
const title = ref('')
const startDate = ref('')
const endDate = ref('')
const days = ref(0)
const description = ref('')
const isDirty = ref(false)
const showCropper = ref(false)
const cropImage = ref(null)
const cropperRef = ref(null)


//預覽封面圖片
const coverPreviewUrl = ref('')
const defaultCover = 'https://fakeimg.pl/800x400/?text=行程封面&font=noto'

//DOM元素參考
const fileInput = ref(null)

//點上傳圖片按鈕時觸發Input
const uploadFile = () => {
    fileInput.value.click()
};

//圖片一上傳進入裁切模式
const handleFile = (event) => {
    file.value = event.target.files[0]
    if(file.value) {
        cropImage.value = URL.createObjectURL(file.value)
        showCropper.value = true
    }
};

//處理裁切的圖
const applyCrop = () => {
    const canvas = cropperRef.value?.getResult()?.canvas
    if(canvas){
        canvas.toBlob((blob) => {
            file.value = new File([blob],`cropper-image.png`, { type: 'image/png'})
            coverPreviewUrl.value = URL.createObjectURL(file.value)
            showCropper.value = false
        }, 'image/png' )
    }
};


//自動計算行程天數
watch([startDate, endDate], () => {
    if(startDate.value && endDate.value) {
        const start = new Date(startDate.value)
        const end = new Date(endDate.value)
        const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
        days.value = diff > 0 ? diff : 0
    } else {
        days.value = 0
    }
});


//監視表單欄位改變
watch([title, startDate, endDate, description, file], () => {
    isDirty.value = true
});


//點X確認是否離開
const handleClose = () => {
    if(isDirty.value){
        const confirmExit = confirm('您有尚未儲存的內容，確定要離開嗎?')
        if(!confirmExit)return       
    }
    emit('close')
};


//點取消清空表單
const scheduleCancel = () => {
    file.value = null
    coverPreviewUrl.value = ''
    title.value = ''
    startDate.value = ''
    endDate.value = ''
    days.value = 0
    description.value = ''
    isDirty.value = false
};

//點儲存打包成formData送到後端
const scheduleSubmit = async() => {
    if(!title.value || !startDate.value || !endDate.value){
        alert('請填寫行程名稱及行程開始/結束日期');
        return;
    }

    const token = localStorage.getItem('token');

    const formData = new FormData();
    if(file.value)
        formData.append('cover', file.value);
        formData.append('title', title.value);
        formData.append('startDate', startDate.value);
        formData.append('endDate', endDate.value);
        formData.append('description', description.value);

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/travelSchedule`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });

        alert('已儲存');
        isDirty.value = false;
        emit('close');
    } catch (err) {
        alert('儲存失敗，請稍後再試');
    }
};


</script>