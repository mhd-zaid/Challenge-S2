<script setup lang="ts">
import LayoutComponent from "@/layout/LayoutComponent.vue";
import {reactive, watch} from 'vue'
import {useCartStore} from "@/stores/cart";
import {useRouter} from "vue-router";
import type {ProductType} from "@/types/ProductType";
import {CheckIcon} from "@heroicons/vue/24/outline";
import {showToast} from "@/utils/toast";

const cartStore = useCartStore()
const router = useRouter();

const state = reactive({
  products: [] as ProductType[],
})

const clearCart = async () => {
  await cartStore.clearCart()
  showToast('Paiement effectué avec succès', 'success')
}

const downloadInvoice = async () => {
  // TODO:: download invoice
}

watch(() => cartStore.cart, async () => {
  state.products = await cartStore.fetchCart()
})
clearCart()
</script>

<template>
  <LayoutComponent>
    <div class="relative isolate overflow-hidden bg-gray-900">
      <div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500 mb-10">
            <CheckIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Commande en cours</h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Votre paiement a été effectué avec succès, nous vous remercions pour votre achat, Vous pouvez maintenant accéder à votre espace personnel, vous pourrez y retrouver vos factures dans la section "Mon historique". dans votre espace profile.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a href="/" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Retour à l'accueil</a>
            <button @click="downloadInvoice" class="text-sm font-semibold leading-6 text-white">Télécharger la facture <span aria-hidden="true">→</span></button>

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
