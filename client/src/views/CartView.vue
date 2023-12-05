<script setup lang="ts">
import LayoutComponent from '@/layout/LayoutComponent.vue'
import {useCartStore} from '@/stores/cart'
import {onMounted, reactive, watch} from 'vue'
import type {ProductType} from '@/types/ProductType'
import {getProductPrice, getTotalProductsPrice} from '@/types/ProductType'
import {getProductImage} from '@/types/ProductImageType'

const cartStore = useCartStore()

const state = reactive({
  cartItems: [] as { quantity: number; product: ProductType }[]
})

onMounted(async () => {
  state.cartItems = await cartStore.fetchCart()
})

const policies = [
  {
    name: 'Retours gratuits',
    imageUrl: 'https://tailwindui.com/img/ecommerce/icons/icon-returns-light.svg',
    description:
      "Notre politique de retour est très simple. Nous acceptons les retours non portés dans les 14 jours suivant l'achat."
  },
  {
    name: 'Livraison dans la journée',
    imageUrl: 'https://tailwindui.com/img/ecommerce/icons/icon-calendar-light.svg',
    description:
      'On vous livre dans la journée si vous commandez avant 12h. Sinon, vous serez livré le lendemain.'
  },
  {
    name: "Code promo toute l'année",
    imageUrl: 'https://tailwindui.com/img/ecommerce/icons/icon-gift-card-light.svg',
    description: "Nous offrons des codes promo toute l'année. Restez à l'affût !"
  },
  {
    name: 'Pour la planète',
    imageUrl: 'https://tailwindui.com/img/ecommerce/icons/icon-planet-light.svg',
    description: 'Nous plantons un arbre pour chaque commande passée.'
  }
]

watch(
  () => cartStore.cart,
  async () => {
    state.cartItems = await cartStore.fetchCart()
  }
)
</script>

<template>
  <LayoutComponent>
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
      <h1 class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Votre panier
      </h1>

      <div class="mt-12">
        <section aria-labelledby="cart-heading">
          <h2 id="cart-heading" class="sr-only">Items in your shopping cart</h2>
          <h2
            v-if="cartStore.cart.length === 0"
            class="text-center font-bold tracking-tight text-gray-900"
          >
            Votre panier est vide
          </h2>
          <ul role="list" class="divide-y divide-gray-200 border-b border-t border-gray-200">
            <li v-for="cartItem in state.cartItems" :key="cartItem.product.id" class="flex py-6">
              <div class="flex-shrink-0">
                <img
                  :src="getProductImage(cartItem.product)"
                  :alt="cartItem.product.name"
                  class="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                />
              </div>

              <div class="ml-4 flex flex-1 flex-col sm:ml-6">
                <div>
                  <div class="flex justify-between">
                    <h4 class="text-sm">
                      <a
                        :href="`/products/${cartItem.product.id}`"
                        class="font-medium text-gray-700 hover:text-gray-800"
                        >{{ cartItem.product.name }}</a
                      >
                    </h4>
                    <p class="ml-4 text-sm font-medium text-gray-900 flex flex-col">
                      {{ getProductPrice({product: cartItem.product, quantity: 1}) }} €
                      <span
                        v-if="parseInt(cartItem.product.discount)"
                        class="text-sm font-medium text-red-600 line-through"
                      >
                        {{ cartItem.product.price }}
                      </span>

                      <label for="quantity" class="mt-2">Quantité</label>
                      <select
                        v-model="cartItem.quantity"
                        @change="cartStore.updateQuantity(cartItem.product, cartItem.quantity)"
                        class="mt-1 block w-18 border-gray-300 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 rounded-md shadow-sm"
                      >
                        <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
                      </select>
                    </p>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">{{ cartItem.product.color }}</p>
                  <p class="mt-1 text-sm text-gray-500">{{ cartItem.product.size }}</p>
                </div>

                <div class="flex flex-1 items-end justify-end">
                  <div class="ml-4">
                    <button
                      @click="cartStore.removeFromCart(cartItem.product)"
                      type="button"
                      class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                    >
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <!-- Order summary -->
        <section v-if="cartStore.cart.length > 0" aria-labelledby="summary-heading" class="mt-10">
          <h2 id="summary-heading" class="sr-only">Order summary</h2>

          <div>
            <dl class="space-y-4">
              <div class="flex items-center justify-between">
                <dt class="text-base font-medium text-gray-900">Sous-total</dt>
                <dd class="ml-4 text-base font-medium text-gray-900">
                  {{ getTotalProductsPrice(state.cartItems) }} €
                </dd>
              </div>
            </dl>
            <p class="mt-1 text-sm text-gray-500">Livraison et taxes calculées à la caisse.</p>
          </div>

          <div class="mt-10">
            <RouterLink
              to="/checkout"
              class="block text-center w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              Passer au paiement
            </RouterLink>
          </div>

          <div class="mt-6 text-center text-sm text-gray-500">
            <p>
              or
              <a href="/products" class="font-medium text-primary-600 hover:text-primary-500">
                Continue Shopping<span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>

    <!-- Policy grid -->
    <section aria-labelledby="policies-heading" class="border-t border-gray-200 bg-gray-50">
      <h2 id="policies-heading" class="sr-only">Notre politique</h2>

      <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div
          class="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0"
        >
          <div
            v-for="policy in policies"
            :key="policy.name"
            class="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
          >
            <div class="md:flex-shrink-0">
              <div class="flow-root">
                <img class="-my-1 mx-auto h-24 w-auto" :src="policy.imageUrl" alt="" />
              </div>
            </div>
            <div class="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
              <h3 class="text-base font-medium text-gray-900">{{ policy.name }}</h3>
              <p class="mt-3 text-sm text-gray-500">{{ policy.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </LayoutComponent>
</template>
