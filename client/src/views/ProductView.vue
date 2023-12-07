<script setup lang="ts">
import LayoutComponent from '@/layout/LayoutComponent.vue'
import {reactive} from 'vue'
import {useRouter} from 'vue-router'
import {useWishlistStore} from '@/stores/wishlist'
import axiosInstance from '@/utils/axiosInstance'
import type {ProductType} from '@/types/ProductType'
import {getProductColor, getProductPrice} from '@/types/ProductType'
import {getProductImage} from '@/types/ProductImageType'
import {useCartStore} from '@/stores/cart'
import RedirectModal from '@/components/RedirectModal.vue'
import checkAuthentication from '@/utils/checkAuthentication'
import {ExclamationCircleIcon} from '@heroicons/vue/24/outline'

const Host = import.meta.env.VITE_HOST_API
const product = {
  highlights: [
    'Chaussure 100% originale',
    'Livraison gratuite',
    'Retour gratuit',
    'Paiement sécurisé',
    'Garantie 2 ans'
  ],
  description: `La nike Air max 90 est une chaussure de sport de la marque Nike, sortie en 1990. Elle est appelée Air Max III jusqu'en 2000, année où Nike change le nom en Air Max 90, pour faire référence à l'année de sa sortie. Avec son unité Air visible et son style audacieux.`,
  details:
    "Dans votre commande vous recevrez une paire de lacets supplémentaire. La Nike Air Max 90 est une chaussure de sport de la marque Nike, sortie en 1990. Elle est appelée Air Max III jusqu'en 2000, année où Nike change le nom en Air Max 90, pour faire référence à l'année de sa sortie. Avec son unité Air visible et son style audacieux, la chaussure Nike Air Max 90 Essential pour Homme remet au goût du jour le modèle emblématique. Elle assure un confort durable et une bonne aération avec des matériaux de qualité supérieure."
}

const state = reactive({
  product: {} as ProductType,
  products: {} as ProductType[],
  openModal: false
})
const router = useRouter()
const isAuthenticated = checkAuthentication()
const wishStore = useWishlistStore()
const cartStore = useCartStore()

const getProduct = async (id: string) => {
  const product = await axiosInstance.get(`/products/${id}`)
  state.product = product.data
}

const getProducts = async () => {
  const products = await axiosInstance.get('/products')
  state.products = products.data.products.splice(0, 4)
}

const init = async () => {
  await getProduct(router.currentRoute.value.params.id.toString())
  await getProducts()
}

const addProductToWishlist = async (productId: string) => {
  await wishStore.addToWishlist(productId)
}

const addProductToCart = async (productId: string) => {
  await cartStore.addToCart(productId)
}
init()
</script>

<template>
  <LayoutComponent>
    <RedirectModal :open="state.openModal" @close="state.openModal = false" />
    <div v-show="state.product.model" class="pt-10 sm:pt-16">
      <!-- Image gallery -->
      <div
        class="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-4 lg:px-8"
      >
        <div
          v-for="image in state.product.productImages"
          :key="image.url"
          class="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg"
        >
          <img
            :src="`${Host}/images/${image.url}`"
            :alt="state.product.name"
            class="h-full w-full object-cover object-center"
          />
        </div>
      </div>

      <!-- Product info -->
      <div
        class="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16"
      >
        <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {{ state.product.name }}
          </h1>
        </div>

        <!-- Options -->
        <div class="mt-4 lg:row-span-3 lg:mt-0">
          <h2 class="sr-only">Product information</h2>
          <p class="text-3xl tracking-tight text-gray-900">
            {{ getProductPrice({ product: state.product, quantity: 1 }) }}
          </p>
          <p
            v-if="parseInt(state.product.discount)"
            class="ml-1 font-medium text-red-600 line-through"
          >
            {{ state.product.price }} €
          </p>

          <div class="mt-10">
            <!-- Colors -->
            <div>
              <h3 class="text-sm font-medium text-gray-900">Couleur</h3>
              <div
                :class="[
                  getProductColor(state.product.color),
                  'h-8 w-8 rounded-full border border-black border-opacity-10 mt-2'
                ]"
              />
            </div>

            <!-- Sizes -->
            <div class="mt-10">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900">Pointure</h3>
              </div>
              <div
                class="mt-2 w-12 h-12 ring-2 ring-primary-500 cursor-pointer bg-white text-gray-900 shadow-sm relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
              >
                <span>{{ state.product.size }}</span>
              </div>
            </div>
            <div class="mt-10">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900">SKU</h3>
              </div>
              <span class="text-sm text-gray-500 mt-2">{{ state.product.sku }}</span>
            </div>
            <!-- affiche le nombre de produits restants -->
            <div class="mt-10" v-if="state.product.quantity < 20">
              <div class="flex items-center bg-red-50 rounded-md p-4">
                <ExclamationCircleIcon class="h-6 w-6 text-red-400 mr-3" aria-hidden="true" />
                <h3 class="text-sm text-lg text-red-400">
                  Attention, il ne reste plus que {{ state.product.quantity }} produits en stock
                </h3>
              </div>
            </div>

            <button
              @click="
                isAuthenticated
                  ? addProductToCart(router.currentRoute.value.params.id.toString())
                  : (state.openModal = true)
              "
              class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Ajouter au panier
            </button>
            <button
              @click="
                isAuthenticated
                  ? addProductToWishlist(router.currentRoute.value.params.id.toString())
                  : (state.openModal = true)
              "
              class="flex mt-2 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Ajouter à la liste d'envie
            </button>
          </div>
        </div>

        <div
          class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6"
        >
          <div>
            <h3 class="sr-only">Description</h3>

            <div class="space-y-6">
              <p class="text-base text-gray-900">{{ product.description }}</p>
            </div>
          </div>

          <div class="mt-10">
            <h3 class="text-sm font-medium text-gray-900">Highlights</h3>

            <div class="mt-4">
              <ul role="list" class="list-disc space-y-2 pl-4 text-sm">
                <li v-for="highlight in product.highlights" :key="highlight" class="text-gray-400">
                  <span class="text-gray-600">{{ highlight }}</span>
                </li>
              </ul>
            </div>
          </div>

          <section aria-labelledby="shipping-heading" class="mt-10">
            <h2 id="shipping-heading" class="text-sm font-medium text-gray-900">Details</h2>

            <div class="mt-4 space-y-6">
              <p class="text-sm text-gray-600">{{ product.details }}</p>
            </div>
          </section>
        </div>
      </div>
      <section aria-labelledby="related-products-heading" class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 id="related-products-heading" class="text-xl font-bold tracking-tight text-gray-900">
            Produits similaires
          </h2>

          <div
            class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
          >
            <div v-for="product in state.products" :key="product.id" class="group relative">
              <div
                class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
              >
                <img
                  :src="getProductImage(product)"
                  :alt="product.name"
                  class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-between">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <a :href="`/products/${product.id}`">
                      <span aria-hidden="true" class="absolute inset-0" />
                      {{ product.name }}
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">{{ product.color }}</p>
                </div>
                <p class="text-sm font-medium text-gray-900 flex flex-col">
                  {{ getProductPrice({ product: product, quantity: 1 }) }}
                  <span
                    v-if="parseInt(state.product.discount)"
                    class="text-sm font-medium text-red-600 line-through"
                  >
                    {{ state.product.price }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </LayoutComponent>
</template>
