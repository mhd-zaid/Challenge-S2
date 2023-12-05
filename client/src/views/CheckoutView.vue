<script setup lang="ts">
import LayoutComponent from '@/layout/LayoutComponent.vue'
import {onMounted, reactive, watch} from 'vue'
import {TrashIcon} from '@heroicons/vue/20/solid'
import {useCartStore} from '@/stores/cart'
import type {ProductType} from '@/types/ProductType'
import {getProductPrice, getTotalProductsPrice} from '@/types/ProductType'
import {getProductImage} from '@/types/ProductImageType'
import axios from 'axios'
import axiosInstance from '@/utils/axiosInstance'
import type {UserType} from '@/types/UserType'
import {useRouter} from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const state = reactive({
  user: {} as UserType,
  cartItems: [] as { quantity: number; product: ProductType }[],
  address: {} as any,
  search: '',
  addresses: [] as any,
  sessionId: '',
  street: '',
  postcode: '',
  country: '',
  order: {
    userId: '',
    deliveryAddress: '',
    products: [
      {
        id: '' as any,
        quantity: '' as any,
      }
    ]
  }
})

const onSubmit = () => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  let userId = ''
  if (isAuthenticated) {
    const payload = JSON.parse(atob(token.split('.')[1]))
    userId = payload.userId
  }
  state.order.userId = userId
  state.order.deliveryAddress = state.address.label
  state.order.products = state.cartItems.map((e) => {
    return {
      id: e.product.id,
      quantity: e.quantity > 0 ? e.quantity : 1
    }
  })
  let OrderId = ''
  axiosInstance
    .post('/orders', state.order)
    .then((res) => {
      OrderId = res.data.id
    })
    .then(() => {
      axiosInstance.post('payments', { orderId: OrderId }).then((res) => {
        if (res.data.error) {
          alert(res.data.error)
          return
        }
        state.sessionId = res.data.id
      })
    })
}

const getSession = (sessionId: any) => {
  axiosInstance.get(`/payments/session/${sessionId}`).then((res) => {
    window.location.href = res.data.url
  })
}

const checkAddress = (e: any) => {
  const address = encodeURIComponent(e.target.value)
  state.addresses = []
  if (address.length > 10) {
    axios
      .get(
        `https://api-adresse.data.gouv.fr/search/?q=${address}&type=housenumber&autocomplete=1&limit=5`
      )
      .then((response) => {
        response.data.features.map((e: any) => {
          state.addresses.push({
            label: e.properties.label,
            value: e.properties
          })
        })
      })
  }
}

watch(
  () => state.address,
  (newVal) => {
    state.street = newVal.name
    state.postcode = newVal.postcode
    state.country = newVal.city
  }
)

onMounted(async () => {
  state.cartItems = await cartStore.fetchCart()
  axiosInstance.get('/auth/me').then((res) => {
    state.user = res.data
  })
})

watch(
  () => cartStore.cart,
  async () => {
    state.cartItems = await cartStore.fetchCart()
  }
)
</script>

<template>
  <LayoutComponent>
    <div class="bg-gray-50">
      <div class="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 class="sr-only">Checkout</h2>
        <form class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" @submit.prevent="onSubmit">
          <div>
            <div class="pt-10">
              <h2 class="text-lg font-medium text-gray-900">Information de livraison</h2>

              <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label for="first-name" class="block text-sm font-medium text-gray-700"
                    >Nom</label
                  >
                  <div class="mt-1">
                    <input
                      v-model="state.user.firstname"
                      type="text"
                      id="first-name"
                      name="first-name"
                      autocomplete="given-name"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label for="last-name" class="block text-sm font-medium text-gray-700">Prénom</label>
                  <div class="mt-1">
                    <input
                      v-model="state.user.lastname"
                      type="text"
                      id="last-name"
                      name="last-name"
                      autocomplete="family-name"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label for="search" class="block text-sm font-medium text-gray-700">Rechercher votre adresse</label>
                  <div class="mt-1">
                    <input
                      @blur="checkAddress"
                      type="text"
                      name="search"
                      id="search"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label for="address" class="block text-sm font-medium text-gray-700"
                    >Séléctionner votre adresse</label
                  >
                  <div class="mt-1">
                    <select
                      v-model="state.address"
                      id="address"
                      name="address"
                      :disabled="state.addresses.length === 0"
                      class="disabled:bg-gray-200 mt-2 block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option
                        v-for="address in state.addresses"
                        :key="address.value"
                        :value="address.value"
                      >
                        {{ address.label }}
                      </option>
                    </select>
                    <pre class="text-blue-500">{{}}</pre>
                  </div>
                </div>
                <div v-if="Object.keys(state.address).length > 0" class="sm:col-span-2">
                  <label for="apartment" class="block text-sm font-medium text-gray-700">Rue</label>
                  <div class="mt-1">
                    <input
                      v-model="state.street"
                      type="text"
                      name="apartment"
                      id="apartment"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div v-if="Object.keys(state.address).length > 0">
                  <label for="postal-code" class="block text-sm font-medium text-gray-700"
                    >Code postal</label
                  >
                  <div class="mt-1">
                    <input
                      v-model="state.postcode"
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autocomplete="postal-code"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div v-if="Object.keys(state.address).length > 0">
                  <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
                  <div class="mt-1">
                    <input
                      v-model="state.country"
                      type="text"
                      name="city"
                      id="city"
                      autocomplete="address-level2"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label for="phone" class="block text-sm font-medium text-gray-700"
                    >Numéro de téléphone</label
                  >
                  <div class="mt-1">
                    <input
                      v-model="state.user.phone"
                      type="text"
                      name="phone"
                      id="phone"
                      autocomplete="tel"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
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
                <li
                  v-for="cartItem in state.cartItems"
                  :key="cartItem.product.id"
                  class="flex px-4 py-6 sm:px-6"
                >
                  <div class="flex-shrink-0">
                    <img
                      :src="getProductImage(cartItem.product)"
                      :alt="cartItem.product.name"
                      class="w-20 rounded-md"
                    />
                  </div>

                  <div class="ml-6 flex flex-1 flex-col">
                    <div class="flex">
                      <div class="min-w-0 flex-1">
                        <h4 class="text-sm">
                          <a
                            :href="`/products/${cartItem.product.id}`"
                            class="font-medium text-gray-700 hover:text-gray-800"
                            >{{ cartItem.product.name }}</a
                          >
                        </h4>
                        <p class="mt-1 text-sm text-gray-500">{{ cartItem.product.color }}</p>
                        <p class="mt-1 text-sm text-gray-500">{{ cartItem.product.size }}</p>
                      </div>

                      <div class="ml-4 flow-root flex-shrink-0">
                        <button
                          @click="cartStore.removeFromCart(cartItem.product)"
                          type="button"
                          class="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                        >
                          <span class="sr-only">Remove</span>
                          <TrashIcon class="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div class="flex flex-1 items-end justify-between pt-2">
                      <div class="flex flex-col">
                        <p class="mt-1 text-sm font-medium text-gray-900">
                          {{ getProductPrice({product: cartItem.product, quantity: 1}) }} €
                        </p>
                        <p class="text-sm font-medium text-gray-900 flex flex-col">
                          <span
                            v-if="parseInt(cartItem.product.discount)"
                            class="text-sm font-medium text-red-600 line-through"
                          >
                            {{ cartItem.product.price }}€
                          </span>
                        </p>
                      </div>
                      <div class="ml-4">
                        <label for="quantity" class="sr-only">Quantity</label>
                        <select
                          v-model="cartItem.quantity"
                          @change="cartStore.updateQuantity(cartItem.product, cartItem.quantity)"
                          id="quantity"
                          name="quantity"
                          class="block w-24 border-gray-300 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        >
                          <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <dl class="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div class="flex items-center justify-between">
                  <dt class="text-sm">Total</dt>
                  <dd class="text-sm font-medium text-gray-900">
                    {{ getTotalProductsPrice(state.cartItems) }} €
                  </dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt class="text-sm">Livraison</dt>
                  <dd class="text-sm font-medium text-gray-900">Offerte</dd>
                </div>
                <div class="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt class="text-base font-medium">Total</dt>
                  <dd class="text-base font-medium text-gray-900">
                    {{ getTotalProductsPrice(state.cartItems) }} €
                  </dd>
                </div>
              </dl>
              <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                <button
                  v-if="state.sessionId === ''"
                  type="submit"
                  class="w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Payer
                </button>
                <button
                  v-else
                  type="button"
                  @click="getSession(state.sessionId)"
                  class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Payer avec Stripe
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </LayoutComponent>
</template>
