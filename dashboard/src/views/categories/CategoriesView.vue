<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance';
import {onMounted, onUnmounted, reactive} from 'vue';
import OTable from "@/components/OTable.vue";
import {useRouter} from "vue-router";
import OModal from "@/components/OModal.vue";
import CategoriesSidebarForm from "@/views/categories/CategoriesSidebarForm.vue";

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
const getCategories = async () => {
  try {
    await axiosInstance.get('/categories').then((res) => {
      state.columns = Object.keys(res.data[0]).splice(1, 2)
      state.rows = res.data
    })
  } catch (e: any) {
    throw e;
  }
}

const deleteCategory = async (id: string) => {
  try {
    await axiosInstance.delete(`/categories/${id}`).then(() => {
      state.openConfirmation = false
      state.selectedId = ""
      getCategories()
    })
  } catch (e: any) {
    throw e;
  }
}

const OpenConfirmationModal = (category: any) => {
  state.openConfirmation = true
  state.selectedId = category.id
}

const openUpdatingDrawer = (category: any) => {
  state.openUpdating = true
  state.selectedId = category.id
}

const closeUpdatingDrawer = () => {
  state.openUpdating = false
  state.selectedId = ""
  getCategories()
}
const closeCreationDrawer = () => {
  state.openCreation = false
  getCategories()
}

onMounted(() => {
  getCategories()
})

onUnmounted(() => {
  abortController.abort()
})

</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Categories</h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all the categories.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              @click="state.openCreation = true"
              type="button"
              class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add category
          </button>
        </div>
      </div>
      <OTable :rows="state.rows" :columns="state.columns" @deleteRow="OpenConfirmationModal"
              @updateRow="openUpdatingDrawer"
              @showRow="((row: any) => router.push({name : 'category', params: { id : row.id}}))"/>
    </div>
    <CategoriesSidebarForm v-if="state.openCreation" :open="state.openCreation"
                        @closeCreationDrawer="closeCreationDrawer"/>
    <CategoriesSidebarForm :open="state.openUpdating" :id="state.selectedId" @closeUpdatingDrawer="closeUpdatingDrawer"/>
    <OModal v-if="state.openConfirmation" :open="state.openConfirmation" @closeModal="state.openConfirmation = false"
            @confirm="deleteCategory(state.selectedId)" title="Supprimer une catégorie"
            confirmButton="Supprimer" content="Êtes-vous sûr de vouloir supprimer cette catégorie ?"/>
  </AuthenticatedLayout>
</template>
