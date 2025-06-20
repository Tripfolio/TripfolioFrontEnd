<template>
    <div class="p-6 max-w-4xl mx-auto">
        <!-- 行程(標題/封面/筆記)-->
         <TripOverview 
            v-if="trip" :trip="trip" @back-to-list="goBack" @update-cover="updateCover" @update-title="updateTitle" @update-notes="updateNotes" />
        
        <!-- 每日行程（景點清單) -->
         <Itinerary v-if="trip" :trip-id="trip.id" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import TripOverview from '../components/TripOverview.vue';
import Itinerary from '../components/Itinerary.vue';

const route = useRoute()
const router = useRouter()
const trip = ref(null)
const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzUwMjE1ODY0fQ.jw5vw_Y6187vaYBvBpUe-LZcTbIO-cexfgaZsNUPzZ4';

onMounted(async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/travelSchedule/${route.params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        trip.value = res.data.schedule
    } catch (err) {
        alert('無法載入行程')
        router.push('/schedule')
    }
})

const goBack = () => {
    router.push('schedule')
}

const updateCover = async (blob) => {
    const formData = new FormData()
    formData.append = ('cover', blob)

    try {
        const res = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/travelSchedule/${route.params.id}/cover`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        trip.value.coverURL = res.data.coverURL
    } catch (err) {
        alert('封面更新失敗')
    }
}

const updateTitle = async (newTitle) => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/travelSchedule/${route.params.id}`, {
            title: newTitle
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        trip.value.title = newTitle
    } catch (err) {
        alert('標題更新失敗')
    }
}

const updateNotes = async (newNotes) => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/travelSchedule/${route.params.id}`, {
            description: newNotes
        }, {
            headers: { Authorization:`Bearer ${token}` }
        })
        trip.value.description = newNotes
    } catch (err) {
        alert('筆記更新失敗')
    }
}

</script>