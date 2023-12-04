<script setup lang="ts">
import LayoutComponent from "@/layout/LayoutComponent.vue";
import {reactive, watch} from 'vue'
import {useCartStore} from "@/stores/cart";
import {useRouter} from "vue-router";
import type {ProductType} from "@/types/ProductType";
import {ExclamationTriangleIcon} from "@heroicons/vue/24/outline";

const cartStore = useCartStore()
const router = useRouter();

const state = reactive({
  products: [] as ProductType[],
})

watch(() => cartStore.cart, async () => {
  state.products = await cartStore.fetchCart()
})
</script>

<template>
  <LayoutComponent>
    <div class="relative isolate overflow-hidden bg-gray-900">
      <div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500 mb-10">
            <ExclamationTriangleIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Paiement échoué</h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Votre paiement a échoué. Veuillez réessayer.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <RouterLink to="/cart" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Voir votre panier</RouterLink>
            <RouterLink to="/" class="text-sm font-semibold leading-6 text-white">Revenir a l'accueil <span aria-hidden="true">→</span></RouterLink>
          </div>
        </div>
      </div>
      <svg viewBox="0 0 1024 1024" class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]" aria-hidden="true">
        <circle cx="512" cy="512" r="512" fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fill-opacity="" />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stop-color="#FFB3C1" />
            <stop offset="1" stop-color="#C9184A" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  </LayoutComponent>
</template>
