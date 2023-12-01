<script setup lang="ts">
import LayoutComponent from '../layout/LayoutComponent.vue'
import CategorySection from '../sections/home/CategorySection.vue'
import FeaturedSection from '../sections/home/FeaturedSection.vue'
import FavoriteSection from '../sections/home/FavoriteSection.vue'
import CtaSection from '../sections/home/CtaSection.vue'
import HeroSection from '@/sections/home/HeroSection.vue'
import {onMounted, reactive} from 'vue'
import CookiesModal from '@/components/cookies/CookiesModal.vue'
import type {ProductType} from "@/types/ProductType";
import axiosInstance from "@/utils/axiosInstance";

const state = reactive({
  cookiesAccepted: false as boolean,
  products: [] as ProductType[]
})

onMounted(async () => {
  const cookiesAccepted = localStorage.getItem('accept-cookies')
  axiosInstance.get('/products')
    .then(response => {
      state.products = response.data.splice(0, 3)
    })
    .catch(error => {
      console.log(error)
    })
  state.cookiesAccepted = cookiesAccepted === 'true';
})

</script>

<template>
  <LayoutComponent>
    <CookiesModal
      v-if="!state.cookiesAccepted"
      @acceptCookies="state.cookiesAccepted = true"
      @declineCookies="state.cookiesAccepted = true"
    />
    <HeroSection />
    <CategorySection />
    <FeaturedSection />
    <FavoriteSection :favorites="state.products" />
    <CtaSection />
  </LayoutComponent>
</template>
