<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance';
import {onMounted, onUnmounted, reactive} from 'vue';
import OTable from "@/components/OTable.vue";
import OModal from "@/components/OModal.vue";
import {useRouter} from "vue-router";
import BrandsSidebarForm from "@/views/brands/BrandsSidebarForm.vue";

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
const getBrands = async () => {
  try {
    await axiosInstance.get('/brands').then((res) => {
      state.columns = Object.keys(res.data[0]).splice(1, 2)
      state.rows = res.data
    })
  } catch (e: any) {
    throw e;
  }
}

const deleteBrand = async (id: string) => {
  try {
    await axiosInstance.delete(`/brands/${id}`).then(() => {
      state.openConfirmation = false
      state.selectedId = ""
      getBrands()
    })
  } catch (e: any) {
    throw e;
  }
}

const OpenConfirmationModal = (brand: any) => {
  state.openConfirmation = true
  state.selectedId = brand.id
}

const openUpdatingDrawer = (brand: any) => {
  state.openUpdating = true
  state.selectedId = brand.id
}

const closeUpdatingDrawer = () => {
  state.openUpdating = false
  state.selectedId = ""
  getBrands()
}

const closeCreationDrawer = () => {
  state.openCreation = false
  getBrands()
}

onMounted(() => {
  getBrands()
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
          <h1 class="text-base font-semibold leading-6 text-gray-900">Marques</h1>
          <p class="mt-2 text-sm text-gray-700">
            Liste des marques
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              @click="state.openCreation = true"
              type="button"
              class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Ajouter une marque
          </button>
        </div>
      </div>
      <OTable :rows="state.rows" :columns="state.columns" @deleteRow="OpenConfirmationModal"
              @updateRow="openUpdatingDrawer"
              @showRow="((row: any) => router.push({name : 'brand', params: { id : row.id}}))"/>
      <BrandsSidebarForm v-if="state.openCreation" :open="state.openCreation" @closeCreationDrawer="closeCreationDrawer"/>
      <BrandsSidebarForm :open="state.openUpdating" :id="state.selectedId" @closeUpdatingDrawer="closeUpdatingDrawer"/>
      <OModal v-if="state.openConfirmation" :open="state.openConfirmation" @closeModal="state.openConfirmation = false"
              @confirm="deleteBrand(state.selectedId)" title="Supprimer la marque"
              confirmButton="Supprimer" content="Êtes-vous sûr de vouloir supprimer cette marque ?"/>
    </div>
  </AuthenticatedLayout>
</template>
