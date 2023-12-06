<script setup lang="ts">
import LayoutComponent from "@/layout/LayoutComponent.vue";
</script>

<template>
  <LayoutComponent>
    <div class="bg-white px-6 py-10 lg:px-8">
      <div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-10">Mentions légales</h1>
        
      </div>
    </div>
  </LayoutComponent>
</template>


<style scoped>
p {
  @apply
  text-gray-700
  leading-7
  max-w-3xl
  mx-auto
  mb-3
}
li {
  @apply
  text-gray-700
  leading-7
  text-xl
  max-w-3xl
  mx-auto
  mb-1
  font-bold
}
</style>
