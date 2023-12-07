<script lang="ts" setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { ProductType } from '@/types/ProductType'
import { columnNames, getValue } from '@/utils/valuesUpdater'
import {
  ArchiveBoxIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ExclamationCircleIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const state = reactive({
  product: {} as ProductType,
  history: [] as any[],
  addStockModal: false as boolean,
  quantity: 0 as number,
  error: '' as string
})

const productId = router.currentRoute.value.params.id

const getProduct = async () => {
  try {
    await axiosInstance.get(`/products/${productId}`).then((res) => {
      state.product = res.data
    })
  } catch (e: any) {
    throw e
  }
}

const getProductHistory = async () => {
  try {
    await axiosInstance.get(`/stocks/${productId}`).then((res) => {
      state.history = res.data
    })
  } catch (e: any) {
    throw e
  }
}

const updateStock = async (addition: boolean = true) => {
  try {
    if (state.quantity === 0) {
      state.error = 'Veuillez entrer une quantité'
      return
    }

    await axiosInstance
      .patch(`/stocks/${productId}`, {
        quantity: state.quantity,
        isAddition: addition
      })
      .then(() => {
        closeAddStockModal()
        getProduct()
        getProductHistory()
      })
  } catch (e: any) {
    if (e.response.data.message === "Quantity can't be negative") {
      state.error = 'La quantité ne peut pas être négative'
      return
    }
    state.error = e.response.data.message
    console.log(e)
  }
}

const closeAddStockModal = () => {
  state.addStockModal = false
  state.error = ''
  state.quantity = 0
}

onMounted(() => {
  getProduct()
  getProductHistory()
})
</script>
<template>
  <AuthenticatedLayout>
    <div
      v-if="state.addStockModal"
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div class="flex items-center">
                  <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <ArchiveBoxIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>

                  <h3 class="text-lg leading-6 font-medium text-gray-900 ml-3" id="modal-headline">
                    Gérer le stock
                  </h3>
                </div>
                <div
                  class="mt-6 mb-4 text-sm text-red-500 bg-red-50 rounded-md p-2 flex"
                  v-if="state.error"
                >
                  <ExclamationCircleIcon class="h-5 w-5 flex-shrink-0 self-center mr-2" />
                  {{ state.error }}
                </div>
                <div :class="{ 'mt-6': !state.error, 'mt-2': state.error }">
                  <p class="text-sm text-gray-500">
                    Veuillez entrer la
                    <span class="font-semibold">quantité</span>
                    de stock à ajouter ou à retirer.
                  </p>
                  <input
                    v-model="state.quantity"
                    type="number"
                    class="mt-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-green-500 shadow-sm px-4 py-2 bg-white text-base font-medium text-green-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="updateStock(true)"
            >
              <PlusIcon class="h-4 w-4 flex-shrink-0 self-center text-green-500 mr-1" />
              Ajouter
            </button>
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-red-500 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="updateStock(false)"
            >
              <MinusIcon class="h-4 w-4 flex-shrink-0 self-center text-red-500 mr-1" />
              Retirer
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              @click="closeAddStockModal"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="px-4">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">
            Gestion du stock de {{ state.product.name }}
          </h1>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            class="block rounded-md bg-red-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex"
            @click="state.addStockModal = true"
          >
            <ArchiveBoxIcon class="h-4 w-4 flex-shrink-0 self-center mr-2" />
            Gérer le stock
          </button>
        </div>
        <div class="mt-4 sm:ml-4 sm:mt-0 sm:flex-none">
          <RouterLink
            :to="{ name: 'products' }"
            class="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            <button
              type="button"
              class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Retour à la liste
            </button>
          </RouterLink>
        </div>
      </div>
      <div class="mt-8">
        <div class="mt-2 text-sm text-gray-700">
          <p class="font-semibold mb-2">Stock actuel</p>
          <p class="mt-1 text-lg text-gray-900 bg-gray-100 rounded-md p-2 w-24 text-right">
            {{ state.product.quantity }}
          </p>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <div class="text-sm text-gray-700 mb-2">
          <p class="font-semibold">Historique du stock</p>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="history of state.history" :key="history">
              <td class="px-6 py-4 text-sm font-medium text-gray-500">
                Le {{ getValue(history, 'createdAt') }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 flex items-center">
                <span
                  class="font-semibold bg-gray-100 px-2 py-1 rounded-md mr-3 flex w-12 justify-center"
                  :class="
                    history.isAddition ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                  "
                  >{{ history.quantityChange }}
                  <ArrowUpIcon
                    v-if="history.isAddition"
                    class="h-3 w-3 flex-shrink-0 self-center text-green-500 ml-1"
                  />
                  <ArrowDownIcon
                    v-else
                    class="h-3 w-3 flex-shrink-0 self-center text-red-500 ml-1"
                  />
                </span>
                produits ont été
                {{ history.isAddition ? 'ajoutés' : 'retirés' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
