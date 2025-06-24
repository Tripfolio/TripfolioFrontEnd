<template>
  <Swiper
    :modules="modules"
    :slides-per-view="1.2"
    :space-between="20"
    :loop="true"
    :centered-slides="true" 
    :autoplay="{ delay: 3000 }"
    class="w-full px-4 overflow-visible"
  >
    <SwiperSlide v-for="(block, index) in blocks" :key="index">
      <section
        class="mt-10 w-[80vw] bg-gray-300 rounded-[3rem] h-[300px] md:h-[400px] shadow-inner flex items-center justify-center text-2xl font-bold"
      >
        {{ block.text }}
      </section>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'

const modules = [Autoplay]
const blocks = [
  { text: '輪播區塊 1' },
  { text: '輪播區塊 2' },
  { text: '輪播區塊 3' },
  { text: '輪播區塊 4' },
  { text: '輪播區塊 5' },
]
</script>

<style scoped>
.swiper {
  overflow: visible !important;
}
</style>
