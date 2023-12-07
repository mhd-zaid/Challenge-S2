<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import {onMounted, onUnmounted, reactive} from 'vue'
import OTable from '@/components/OTable.vue'
import {useRouter} from 'vue-router'
import OModal from '@/components/OModal.vue'
import ProductsSidebarForm from './ProductsSidebarForm.vue'
import {CloudArrowDownIcon} from '@heroicons/vue/24/outline'

const router = useRouter()
const state = reactive({
  columns: [] as string[],
  rows: [],
  openConfirmation: false,
  openUpdating: false,
  selectedId: '',
  openCreation: false
})
const Host = import.meta.env.VITE_HOST_API
const abortController = new AbortController()
const getProducts = async () => {
  await axiosInstance.get('/products').then((res) => {
    state.columns = [
      'productImages',
      // 'sku',
      'name',
      'quantity',
      'price',
      'vat',
      'size',
      'color',
      'discount'
    ]
    state.rows = res.data.products
  })
  // change productImages to productImage to differentiate first image from others
  state.columns[0] = 'productImage'
}

const deleteProduct = async (id: string) => {
  await axiosInstance.delete(`/products/${id}`).then(() => {
    state.openConfirmation = false
    state.selectedId = ''
    getProducts()
  })
}

const OpenConfirmationModal = (user: any) => {
  state.openConfirmation = true
  state.selectedId = user.id
}

const openUpdatingDrawer = (user: any) => {
  state.openUpdating = true
  state.selectedId = user.id
}

const closeUpdatingDrawer = () => {
  state.openUpdating = false
  state.selectedId = ''
}

const closeCreationDrawer = () => {
  state.openCreation = false
}

const closeDrawerAfterCreation = () => {
  state.openCreation = false
  getProducts()
}

const closeDrawerAfterUpdating = () => {
  state.openUpdating = false
  getProducts()
}

onMounted(() => {
  if (!state.rows.length) getProducts()
})

onUnmounted(() => {
  abortController.abort()
})

const exportProducts = async () => {
  try {
    await axiosInstance
      .post('/exports/', {
        dataScope: 'products'
      })
      .then((res) => {
        const fileName = res.data.fileName

        const downloadLink = document.createElement('a')
        downloadLink.href = `${Host}/exports/${fileName}`
        downloadLink.download = fileName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      })
  } catch (e: any) {
    throw e
  }
}
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Produits</h1>
          <p class="mt-2 text-sm text-gray-700">Liste des produits</p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            @click="exportProducts"
            class="bg-white rounded-md text-gray-400 px-3 py-2 text-center text-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span class="sr-only">Télécharger l'export</span>
            <CloudArrowDownIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-4 sm:ml-3 sm:mt-0 sm:flex-none">
          <button
            @click="state.openCreation = true"
            type="button"
            class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Ajouter un produit
          </button>
        </div>
      </div>
      <OTable
        :rows="state.rows"
        :columns="state.columns"
        :actions="['quantity', 'update', 'delete']"
        @deleteRow="OpenConfirmationModal"
        @updateRow="openUpdatingDrawer"
        @showRow="(row: any) => router.push({ name: 'product', params: { id: row.id } })"
      />
    </div>
    <ProductsSidebarForm
      v-if="state.openCreation"
      :open="state.openCreation"
      @closeCreationDrawer="closeCreationDrawer"
      @productCreated="closeDrawerAfterCreation"
    />
    <ProductsSidebarForm
      :open="state.openUpdating"
      :id="state.selectedId"
      @closeUpdatingDrawer="closeUpdatingDrawer"
      @productUpdated="closeDrawerAfterUpdating"
    />
    <OModal
      v-if="state.openConfirmation"
      :open="state.openConfirmation"
      @closeModal="state.openConfirmation = false"
      @confirm="deleteProduct(state.selectedId)"
      title="Supprimer un produit"
      confirmButton="Supprimer"
      content="Êtes-vous sûr de vouloir supprimer ce produit ?"
    />
  </AuthenticatedLayout>
</template>
