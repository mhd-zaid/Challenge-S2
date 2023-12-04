<script setup lang="ts">
import LayoutComponent from '@/layout/LayoutComponent.vue'
import axiosInstance from '@/utils/axiosInstance'
import { onMounted, ref } from 'vue'
import { getProductImage } from '@/types/ProductImageType'
import { useWishlistStore } from '@/stores/wishlist'
import { getProductPrice } from '@/types/ProductType'
import { useCartStore } from '@/stores/cart'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const token = localStorage.getItem('token')
const isAuthenticated = !!token
let userId = ''
if (isAuthenticated) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  userId = payload.userId
}

const getUserWishes = async (userId: string) => {
  try {
    const wishes = await axiosInstance.get(`/wishes/${userId}`).then((res) => res.data)
    const products: any[] = wishes.products // Adjust the type accordingly
    return products
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste de souhaits :', error)
    return []
  }
}

const removeFromWishlist = async (productId: string) => {
  try {
    await wishlistStore.removeFromWishlist(productId)
    products.value = products.value.filter((product: any) => product.id !== productId)
  } catch (error) {
    console.error('Erreur lors de la suppression du produit de la liste de souhaits :', error)
  }
}

const addToCart = async (productId: string) => {
  await cartStore.addToCart(productId)
}

const products = ref<any[]>([])

onMounted(async () => {
  products.value = await getUserWishes(userId)
})
</script>

<template>
  <LayoutComponent>
    <div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8">
      <div class="max-w-7xl">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Vos coups de cœur</h1>
        <p class="mt-2 text-sm text-gray-500">
          Ne perdez pas de vue vos articles préférés, ajoutez-les à votre panier
        </p>
      </div>

      <div class="mt-12 space-y-4 sm:mt-16">
        <div
          v-for="product in products"
          :key="product.id"
          class="p-6 sm:flex border-[1px] border-gray-200 rounded-2xl shadow-sm"
        >
          <div class="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
            <img
              :src="getProductImage(product)"
              :alt="product.name"
              class="h-20 w-20 flex-none rounded-md object-cover object-center sm:h-48 sm:w-48"
            />
            <div class="min-w-0 flex-1 pt-1.5 sm:pt-0">
              <h3 class="text-sm font-medium text-gray-900">
                <a :href="product.href">{{ product.name }}</a>
              </h3>
              <p class="truncate text-sm text-gray-500">
                <span>{{ product.color }}</span>
                {{ ' ' }}
                <span class="mx-1 text-gray-400" aria-hidden="true">&middot;</span>
                {{ ' ' }}
                <span>{{ product.size }}</span>
              </p>
              <p class="mt-1 font-medium text-gray-900">{{ getProductPrice({product, quantity: 1}) }} €</p>
            </div>
          </div>
          <div class="mt-6 space-y-4 sm:ml-6 sm:mt-0 sm:w-40 sm:flex-none">
            <button
              type="button"
              class="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-2.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
              @click="addToCart(product.id)"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
              @click="removeFromWishlist(product.id)"
            >
              Retirer des favoris
            </button>
          </div>
        </div>
      </div>
    </div>
  </LayoutComponent>
</template>
