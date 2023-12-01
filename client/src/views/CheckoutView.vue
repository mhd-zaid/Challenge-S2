<script setup lang="ts">
import LayoutComponent from "@/layout/LayoutComponent.vue";
import {onMounted, reactive, watch} from 'vue'
import {TrashIcon} from '@heroicons/vue/20/solid'
import {useCartStore} from "@/stores/cart";
import {getProductPrice, getTotalProductsPrice, ProductType} from "@/types/ProductType";
import {getProductImage} from "@/types/ProductImageType";

const cartStore = useCartStore()

const state = reactive({
  products: [] as ProductType[],
})

onMounted(async () => {
  state.products = await cartStore.fetchCart()
})

watch(() => cartStore.cart, async () => {
  state.products = await cartStore.fetchCart()
})

const products = [
  {
    id: 1,
    title: 'Basic Tee',
    href: '#',
    price: '$32.00',
    color: 'Black',
    size: 'Large',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/checkout-page-02-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
]

</script>

<template>
  <LayoutComponent>
    <div class="bg-gray-50">
      <div class="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 class="sr-only">Checkout</h2>
        <form class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div class="pt-10">
              <h2 class="text-lg font-medium text-gray-900">Information de livraison</h2>

              <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label for="first-name" class="block text-sm font-medium text-gray-700">Nom</label>
                  <div class="mt-1">
                    <input type="text" id="first-name" name="first-name" autocomplete="given-name"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div>
                  <label for="last-name" class="block text-sm font-medium text-gray-700">Prénom</label>
                  <div class="mt-1">
                    <input type="text" id="last-name" name="last-name" autocomplete="family-name"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label for="address" class="block text-sm font-medium text-gray-700">Adresse</label>
                  <div class="mt-1">
                    <input type="text" name="address" id="address" autocomplete="street-address"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label for="apartment" class="block text-sm font-medium text-gray-700">Appartement, suite,
                    etc.</label>
                  <div class="mt-1">
                    <input type="text" name="apartment" id="apartment"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div>
                  <label for="postal-code" class="block text-sm font-medium text-gray-700">Code postal</label>
                  <div class="mt-1">
                    <input type="text" name="postal-code" id="postal-code" autocomplete="postal-code"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
                  <div class="mt-1">
                    <input type="text" name="city" id="city" autocomplete="address-level2"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label for="phone" class="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                  <div class="mt-1">
                    <input type="text" name="phone" id="phone" autocomplete="tel"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order summary -->
          <div class="mt-10 lg:mt-0">
            <h2 class="text-lg font-medium text-gray-900">Résumé de la commande</h2>

            <div class="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 class="sr-only">Items in your cart</h3>
              <ul role="list" class="divide-y divide-gray-200">
                <li v-for="product in state.products" :key="product.id" class="flex px-4 py-6 sm:px-6">
                  <div class="flex-shrink-0">
                    <img :src="getProductImage(product)" :alt="product.name" class="w-20 rounded-md"/>
                  </div>

                  <div class="ml-6 flex flex-1 flex-col">
                    <div class="flex">
                      <div class="min-w-0 flex-1">
                        <h4 class="text-sm">
                          <a :href="`/products/${product.id}`"
                             class="font-medium text-gray-700 hover:text-gray-800">{{ product.name }}</a>
                        </h4>
                        <p class="mt-1 text-sm text-gray-500">{{ product.color }}</p>
                        <p class="mt-1 text-sm text-gray-500">{{ product.size }}</p>
                      </div>

                      <div class="ml-4 flow-root flex-shrink-0">
                        <button
                            @click="cartStore.removeFromCart(product)"
                            type="button"
                            class="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500">
                          <span class="sr-only">Remove</span>
                          <TrashIcon class="h-5 w-5" aria-hidden="true"/>
                        </button>
                      </div>
                    </div>

                    <div class="flex flex-1 items-end justify-between pt-2">
                      <div class="flex flex-col">
                        <p class="mt-1 text-sm font-medium text-gray-900">{{ getProductPrice(product) }}</p>
                        <p class="text-sm font-medium text-gray-900 flex flex-col">
                        <span v-if="parseInt(product.discount)" class="text-sm font-medium text-red-600 line-through">
                          {{ product.price }}€
                        </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <dl class="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div class="flex items-center justify-between">
                  <dt class="text-sm">Total</dt>
                  <dd class="text-sm font-medium text-gray-900">{{getTotalProductsPrice(state.products)}} €</dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt class="text-sm">Livraison</dt>
                  <dd class="text-sm font-medium text-gray-900">Offerte</dd>
                </div>
                <div class="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt class="text-base font-medium">Total</dt>
                  <dd class="text-base font-medium text-gray-900">{{getTotalProductsPrice(state.products)}} €</dd>
                </div>
              </dl>

              <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                <button type="submit"
                        class="w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                  Payer
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </LayoutComponent>
</template>
