<template>
  <div class="relative h-[500px] w-100">
    <!-- Swiper 輪播本體 -->
    <Swiper
      :modules="[Pagination]"
      direction="vertical"
      :pagination="{ el: '.swiper-pagination', clickable: true }"
      class="h-full"
    >
      <SwiperSlide v-for="(place, index) in places" :key="index">
        <div
          class="relative rounded-3xl overflow-hidden h-[150px] bg-cover bg-center"
          :style="{ backgroundImage: `url(${place.img})` }"
        >
          <div class="absolute bottom-3 left-3 bg-black/40 text-white text-sm px-3 py-1 rounded-full">
            {{ place.name }}　｜　{{ place.time }}
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- 自訂灰點（在左邊） -->
    <div class="swiper-pagination absolute top-1/2 left-0 -translate-y-1/2 flex flex-col space-y-2 pl-3"></div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const places = [
  { name: '台北101', time: '10:30', img: '/mapIcons/bar.svg' },
  { name: '士林夜市', time: '12:00', img: '/mapIcons/bar.svg' },
  { name: '中正紀念堂', time: '14:00', img:'/mapIcons/bar.svg'}
]
</script>
