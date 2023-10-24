<script setup lang="ts">
import LayoutComponent from '../layout/LayoutComponent.vue'
import CategorySection from '../sections/home/CategorySection.vue'
import FeaturedSection from '../sections/home/FeaturedSection.vue'
import FavoriteSection from '../sections/home/FavoriteSection.vue'
import CtaSection from '../sections/home/CtaSection.vue'
import HeroSection from '@/sections/home/HeroSection.vue'

const favorites = [
  {
    id: 1,
    name: "Nike Air Force 1 '07",
    price: '119,99',
    href: '#',
    imageSrc: '/images/b7d9211c-26e7-431a-ac24-b0540fb3c00f.webp'
  },
  {
    id: 2,
    name: "Nike Air Force 1 '07 LV8",
    price: '129,99',
    href: '#',
    imageSrc: '/images/b3546974-0d23-4657-a8a7-8d6abc9fc5e8.webp'
  },
  {
    id: 3,
    name: 'Nike Dunk Low Retro',
    price: '119,99',
    href: '#',
    imageSrc: '/images/d01ef37b-c14a-4edd-8787-534f5732294c.webp'
  }
]
</script>

<template>
  <LayoutComponent>
    <HeroSection />
    <CategorySection />
    <FeaturedSection />
    <FavoriteSection :favorites="favorites" />
    <CtaSection />
  </LayoutComponent>
</template>
