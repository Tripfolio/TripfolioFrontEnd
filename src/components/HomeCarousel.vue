<template>
  <Swiper
    :modules="modules"
    :slides-per-view="1.2"
    :space-between="40"
    :loop="true"
    :centered-slides="true" 
    :autoplay="{ delay: 3000 }"
    class="w-full flex justify-center overflow-visible h-[550px]"
  >
    <SwiperSlide v-for="(block, index) in blocks" :key="index" >
      <section
        class="mt-10 h-[550px] flex "
      >
        <img :src="block.img" alt="輪播圖片" class="w-full h-full object-cover rounded-[3rem]" loading="lazy" />
      </section>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import img1 from '@/assets/HomePage/banner1.png'
import img2 from '@/assets/HomePage/banner1.png'
import img3 from '@/assets/HomePage/banner1.png'
import img4 from '@/assets/HomePage/banner1.png'

const modules = [Autoplay]
const blocks = [
  { img: img1 },
  { img: img2 },
  { img: img3 },
  { img: img4 },
]
</script>

<style scoped>
.swiper {
  overflow: visible !important;
}
</style>
