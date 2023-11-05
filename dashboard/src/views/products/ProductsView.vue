<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance';
import {onMounted, onUnmounted, reactive} from 'vue';
import OTable from "@/components/OTable.vue";
import {useRouter} from "vue-router";
import OModal from "@/components/OModal.vue";

const router = useRouter()
const state = reactive({
  columns: {},
  rows: [],
  openConfirmation: false,
  openUpdating: false,
  selectedId: "",
  openCreation: false
})
const abortController = new AbortController
const getProducts = async () => {
  try {
    await axiosInstance.get('/products').then((res) => {
      state.columns = Object.keys(res.data[0]).splice(1, 6)
      state.rows = res.data
    })
  } catch (e: any) {
    throw e;
  }
}

const deleteProduct = async (id: string) => {
  try {
    await axiosInstance.delete(`/products/${id}`).then(() => {
      state.openConfirmation = false
      state.selectedId = ""
      getProducts()
    })
  } catch (e: any) {
    throw e;
  }
}

const OpenConfirmationModal = (product: any) => {
  state.openConfirmation = true
  state.selectedId = product.id
}

onMounted(() => {
  getProducts()
})

onUnmounted(() => {
  abortController.abort()
})

</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Produits</h1>
          <p class="mt-2 text-sm text-gray-700">
            Liste des produits
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <RouterLink :to="{name : 'create-product'}" class="font-semibold text-indigo-600 hover:text-indigo-500">
            <button
                type="button"
                class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Ajouter un produit
            </button>
          </RouterLink>
        </div>
      </div>
      <OTable :rows="state.rows" :columns="state.columns" @deleteRow="OpenConfirmationModal"
              @updateRow="((row: any) => router.push({name : 'edit-product', params: { id : row.id}}))"
              @showRow="((row: any) => router.push({name : 'product', params: { id : row.id}}))"/>
    </div>
    <OModal v-if="state.openConfirmation" :open="state.openConfirmation" @closeModal="state.openConfirmation = false"
            @confirm="deleteProduct(state.selectedId)" title="Supprimer un produit"
            confirmButton="Supprimer" content="Êtes-vous sûr de vouloir supprimer ce produit ?"/>
  </AuthenticatedLayout>
</template>
