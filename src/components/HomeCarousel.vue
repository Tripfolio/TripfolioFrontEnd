<template>
  <Swiper
    :modules="[EffectCoverflow, Autoplay]"
    effect="coverflow"
    :slides-per-view="1.2"
    :space-between="90"
    :loop="true"
    :centered-slides="true" 
    :autoplay="{ delay: 2000 }"
    :coverflowEffect="{
    slideShadows: false
  }"
    class="w-full flex justify-center overflow-visible h-[550px]"
  >
    <SwiperSlide v-for="(block, index) in blocks" :key="index" >
      <section
        class="mt-25 h-[600px] flex "
      >
        <img :src="block.img" alt="輪播圖片" class=" mx-auto  w-full h-full object-cover rounded-[3rem]" loading="lazy" />
      </section>
    </SwiperSlide>
  </Swiper>
</template>

<!-- <template>
  <Swiper
    :modules=[Autoplay]
    :slides-per-view="1.2"
    :space-between="40"
    :loop="true"
    :centered-slides="true" 
    :autoplay="{ delay: 2000 }"
    class="w-full flex justify-center overflow-visible h-[550px]"
  >
    <SwiperSlide v-for="(block, index) in blocks" :key="index" >
      <section
        class="mt-25 h-[600px] flex "
      >
        <img :src="block.img" alt="輪播圖片" class=" mx-auto  w-full h-full object-cover rounded-[3rem]" loading="lazy" />
      </section>
    </SwiperSlide>
  </Swiper>
</template> -->

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay ,EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/effect-coverflow'
import img1 from '@/assets/HomePage/banner0.png'
import img2 from '@/assets/HomePage/banner2.png'
import img3 from '@/assets/HomePage/banner3.png'
import img4 from '@/assets/HomePage/banner2.png'



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
