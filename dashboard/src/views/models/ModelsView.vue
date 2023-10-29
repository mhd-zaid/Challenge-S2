<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance';
import ModelsSidebarForm from "@/views/models/ModelsSidebarForm.vue";
import OModal from "@/components/OModal.vue";
import OTable from "@/components/OTable.vue";
import {onUnmounted, reactive} from "vue";
import type {ModelType} from "@/types/ModelTypes";
import {useRouter} from "vue-router";

const state = reactive({
  openCreation: false,
  openUpdating: false,
  openConfirmation: false,
  selectedId: "",
  columns: {},
  rows: []
})

const router = useRouter()

const abortController = new AbortController
const getModels = async () => {
  try {
    await axiosInstance.get('/models').then((res) => {
      state.columns = Object.keys(res.data[0]).splice(1, 3)
      state.rows = res.data
    })
  } catch (e: any) {
    throw e;
  }
}

const deleteModel = async (id: string) => {
  try {
    await axiosInstance.delete(`/models/${id}`).then(() => {
      state.openConfirmation = false
      state.selectedId = ""
      getModels()
    })
  } catch (e: any) {
    throw e;
  }
}

const OpenConfirmationModal = (model: ModelType) => {
  state.openConfirmation = true
  state.selectedId = model.id
}

onUnmounted(() => {
  abortController.abort()
})

const openCreationDrawer = () => {
  state.openCreation = true
}

const openUpdatingDrawer = (model: ModelType) => {
  state.openUpdating = true
  state.selectedId = model.id
}

const closeUpdatingDrawer = () => {
  state.openUpdating = false
  state.selectedId = ""
  getModels()
}
const closeCreationDrawer = () => {
  state.openCreation = false
  getModels()
}

getModels()

</script>

<template>
  <AuthenticatedLayout>
    <div class="px-2">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Modèles</h1>
          <p class="mt-2 text-sm text-gray-700">
            Liste des modèles de chaussures disponibles
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              @click="openCreationDrawer"
              type="button"
              class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Ajouter un modèle
          </button>
        </div>
      </div>
      <OTable :rows="state.rows" :columns="state.columns" @deleteRow="OpenConfirmationModal"
              @updateRow="openUpdatingDrawer"
              @showRow="((row: any) => router.push({name : 'model', params: { id : row.id}}))"/>
    </div>
    <ModelsSidebarForm v-if="state.openCreation" :open="state.openCreation" @closeCreationDrawer="closeCreationDrawer"/>
    <ModelsSidebarForm :open="state.openUpdating" :id="state.selectedId" @closeUpdatingDrawer="closeUpdatingDrawer"/>
    <OModal v-if="state.openConfirmation" :open="state.openConfirmation" @closeModal="state.openConfirmation = false"
            @confirm="deleteModel(state.selectedId)" title="Delete model"
            content="Are you sure you want to delete this model?" confirmButton="Delete"/>
  </AuthenticatedLayout>
</template>
