<script setup lang="ts">
import LayoutComponent from "@/layout/LayoutComponent.vue";
import {onMounted, reactive, watch} from 'vue'
import {TrashIcon} from '@heroicons/vue/20/solid'
import {useCartStore} from "@/stores/cart";
import {getProductPrice, getTotalProductsPrice, ProductType} from "@/types/ProductType";
import {getProductImage} from "@/types/ProductImageType";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type {UserType} from "@/types/UserType";


const cartStore = useCartStore()

const state = reactive({
  user: {} as UserType,
  products: [] as ProductType[],
  address: {},
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
        price: '' as any
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
  state.order.products = state.products.map(e => {
    return {
      id: e.id,
      quantity: 1,
      price: e.price
    }
  })
  let OrderId = ''
  axiosInstance.post('/orders', state.order).then(res => {
    OrderId = res.data.id
  }).then(() => {
    axiosInstance.post('payments', {orderId: OrderId}).then(res => {
      if (res.data.error) {
        alert(res.data.error)
        return
      }
      state.sessionId = res.data.id
    })
  })
}

const getSession = (sessionId) => {
  axiosInstance.get(`/payments/session/${sessionId}`).then(res => {
    window.location.href = res.data.url
  })
}

const checkAddress = (e) => {
  const address = encodeURIComponent(e.target.value);
  state.addresses = []
  if (address.length > 10) {
    axios.get(`https://api-adresse.data.gouv.fr/search/?q=${address}&type=housenumber&autocomplete=1&limit=5`)
        .then((response) => {
          response.data.features.map(e => {
            state.addresses.push(
                {
                  label: e.properties.label,
                  value: e.properties,
                }
            )
          })
        })
    }
}

watch(() => state.address, (newVal) => {
  state.street = newVal.name
  state.postcode = newVal.postcode
  state.country = newVal.city
})

onMounted(async () => {
  state.products = await cartStore.fetchCart()
  axiosInstance.get('/auth/me').then(res => {
    state.user = res.data
  })
})

watch(() => cartStore.cart, async () => {
  state.products = await cartStore.fetchCart()
})
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
                  <label for="first-name" class="block text-sm font-medium text-gray-700">Nom</label>
                  <div class="mt-1">
                    <input v-model="state.user.firstname" type="text" id="first-name" name="first-name"
                           autocomplete="given-name"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div>
                  <label for="last-name" class="block text-sm font-medium text-gray-700">Prénom</label>
                  <div class="mt-1">
                    <input v-model="state.user.lastname" type="text" id="last-name" name="last-name"
                           autocomplete="family-name"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label for="search" class="block text-sm font-medium text-gray-700">Rechercher votre adresse</label>
                  <div class="mt-1">
                    <input @blur="checkAddress" type="text" name="search" id="search"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label for="address" class="block text-sm font-medium text-gray-700">Séléctionner votre
                    adresse</label>
                  <div class="mt-1">
                    <select
                        v-model="state.address"
                        id="address"
                        name="address"
                        :disabled="state.addresses.length === 0"
                        class="disabled:bg-gray-200 mt-2 block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option v-for="address in state.addresses" :key="address.value" :value="address.value">
                        {{ address.label }}
                      </option>
                    </select>
                    <pre class="text-blue-500">{{  }}</pre>
                  </div>
                </div>
                <div v-if="Object.keys(state.address).length > 0" class="sm:col-span-2">
                  <label for="apartment" class="block text-sm font-medium text-gray-700">Rue</label>
                  <div class="mt-1">
                    <input v-model="state.street" type="text" name="apartment" id="apartment"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div v-if="Object.keys(state.address).length > 0">
                  <label for="postal-code" class="block text-sm font-medium text-gray-700">Code postal</label>
                  <div class="mt-1">
                    <input v-model="state.postcode" type="text" name="postal-code" id="postal-code"
                           autocomplete="postal-code"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div v-if="Object.keys(state.address).length > 0">
                  <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
                  <div class="mt-1">
                    <input v-model="state.country" type="text" name="city" id="city" autocomplete="address-level2"
                           class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"/>
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label for="phone" class="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                  <div class="mt-1">
                    <input v-model="state.user.phone" type="text" name="phone" id="phone" autocomplete="tel"
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
                      <div class="ml-4">
                        <label for="quantity" class="sr-only">Quantity</label>
                        <select id="quantity" name="quantity"
                                class="rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <dl class="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div class="flex items-center justify-between">
                  <dt class="text-sm">Total</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ getTotalProductsPrice(state.products) }} €</dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt class="text-sm">Livraison</dt>
                  <dd class="text-sm font-medium text-gray-900">Offerte</dd>
                </div>
                <div class="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt class="text-base font-medium">Total</dt>
                  <dd class="text-base font-medium text-gray-900">{{ getTotalProductsPrice(state.products) }} €</dd>
                </div>
              </dl>
              <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                <button v-if="state.sessionId === ''" type="submit"
                        class="w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                  Payer
                </button>
                <button
                    v-else
                    type="button"
                    @click="getSession(state.sessionId)"
                    class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50">
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
