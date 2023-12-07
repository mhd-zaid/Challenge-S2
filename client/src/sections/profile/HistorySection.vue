<script setup lang="ts">
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {EllipsisVerticalIcon, MagnifyingGlassIcon} from '@heroicons/vue/24/outline'
import axiosInstance from '@/utils/axiosInstance'
import {getProductImage} from '@/types/ProductImageType'
import {computed, onMounted, reactive, ref} from 'vue'
import OrderPdf from '@/components/profile/OrderPdf.vue'
import {useCartStore} from '@/stores/cart'

const html2pdf = require('html2pdf.js')

const cartStore = useCartStore()

const token = localStorage.getItem('token')
const isAuthenticated = !!token
let userId = ''
if (isAuthenticated) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  userId = payload.userId
}
const search = ref('')
const orders = reactive(<any>[])

const getUserOrders = async () => {
  const { data } = await axiosInstance.get(`/orders/user/${userId}`)
  data.forEach((order: any) => {
    order.products.forEach((product: any) => {
      product.imageSrc = getProductImage(product)
      product.imageAlt = product.name
      product.price = (
        (product.Orders_Products.price / 100) *
        product.Orders_Products.quantity
      ).toFixed(2)
      product.href = `/products/${product.id}`
    })
    order.total = () => {
      let total = 0.0
      order.products.forEach((product: any) => {
        total += parseFloat(product.price)
      })

      return total.toFixed(2)
    }
  })

  data.filter(
    (order: any) => order.status !== 'payment pending' && order.status !== 'payment failed'
  )

  orders.splice(0, orders.length)
  orders.push(...data)
}

const filteredOrders = computed(() => {
  return orders.filter((order: any) => {
    return (
      order.id.toLowerCase().includes(search.value.toLowerCase()) ||
      order.products.some((product: any) =>
        product.name.toLowerCase().includes(search.value.toLowerCase())
      )
    )
  })
})

onMounted(async () => {
  await getUserOrders()
})

const downloadInvoice = async (orderId: string) => {
  const template = document.getElementById('invoice-template')
  if (template) {
    template.style.display = 'block'
    await html2pdf(template, {
      margin: [1, 1],
      filename: `facture-${orderId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    })
    template.style.display = 'none'
  }
}
</script>

<template>
  <!-- barre de recherche -->
  <div class="mx-auto max-w-7xl sm:px-2 lg:px-8">
    <form @submit.prevent="getUserOrders">
      <div class="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
        <div class="relative flex items-center w-full text-gray-600">
          <input
            type="search"
            name="search"
            v-model="search"
            placeholder="Rechercher une commande"
            class="w-full py-3 px-4 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:bg-white focus:text-gray-900"
          />
          <button
            type="submit"
            class="absolute top-1 right-1 bottom-1 flex items-center justify-center w-10 text-white bg-primary-600 rounded-md focus:outline-none hover:bg-primary-700"
          >
            <MagnifyingGlassIcon class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
  </div>

  <section aria-labelledby="recent-heading" class="mt-16">
    <h2 id="recent-heading" class="sr-only">Commandes récentes</h2>
    <div class="mx-auto max-w-7xl sm:px-2 lg:px-8">
      <div class="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
        >
          <h3 class="sr-only">
            Commande passée le
            <time :datetime="order.createdAt">{{ order.createdAt }}</time>
          </h3>

          <div
            class="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6"
          >
            <dl
              class="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2"
            >
              <div>
                <dt class="font-medium text-gray-900">N° de commande</dt>
                <dd class="mt-1 text-gray-500">{{ order.id }}</dd>
              </div>
              <div>
                <dt class="font-medium text-gray-900"></dt>
                <dd class="mt-1 font-medium text-gray-900"></dd>
              </div>
              <div>
                <dt class="font-medium text-gray-900">Prix total</dt>
                <dd class="mt-1 font-medium text-gray-900">{{ order.total() }} €</dd>
              </div>
            </dl>

            <Menu as="div" class="relative flex justify-end lg:hidden">
              <div class="flex items-center">
                <MenuButton class="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                  <span class="sr-only">Options pour la commande {{ order.id }}</span>
                  <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a
                        :href="order.href"
                        :class="[
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        ]"
                        >View</a
                      >
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a
                        :href="order.invoiceHref"
                        :class="[
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        ]"
                        >Invoice</a
                      >
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>

            <div class="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
              <button
                v-on:click="downloadInvoice(order.id)"
                class="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span>Facture</span>
                <span class="sr-only">for order {{ order.id }}</span>
              </button>
              <!-- template PDF -->
              <div id="invoice-template" style="display: none">
                <OrderPdf :data="order" />
              </div>
            </div>
          </div>

          <!-- Products -->
          <h4 class="sr-only">Items</h4>
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="product in order.products" :key="product.id" class="p-4 sm:p-6">
              <div class="flex items-center sm:items-start">
                <div
                  class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40"
                >
                  <img
                    :src="product.imageSrc"
                    :alt="product.imageAlt"
                    class="h-full w-full object-cover object-center"
                  />
                </div>
                <div class="ml-6 flex-1 text-sm">
                  <div class="font-medium text-gray-900 sm:flex sm:justify-between">
                    <h5>{{ product.name }}</h5>
                    <p class="mt-2 sm:mt-0">{{ product.price }} €</p>
                  </div>
                  <p class="hidden text-gray-500 sm:mt-2 sm:block">{{ product.description }}</p>
                </div>
              </div>

              <div class="mt-6 sm:flex sm:justify-between">
                <div
                  class="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0"
                >
                  <div class="flex flex-1 justify-center">
                    <a
                      :href="product.href"
                      class="whitespace-nowrap text-primary-600 hover:text-primary-500"
                      >Voir le produit</a
                    >
                  </div>
                  <div class="flex flex-1 justify-center pl-4">
                    <a
                      href="#"
                      class="whitespace-nowrap text-primary-600 hover:text-primary-500"
                      @click.prevent="cartStore.addToCart(product.id)"
                      >Commander à nouveau</a
                    >
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
