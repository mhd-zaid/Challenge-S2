<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import {CloudArrowDownIcon, TrashIcon} from '@heroicons/vue/24/outline'
import {reactive} from 'vue'
import {getEntityName} from '@/utils/valuesUpdater'
import OModal from '@/components/OModal.vue'

const state = reactive({
  exports: [] as any[],
  openConfirmation: false as boolean,
  selectedId: '' as string
})

const user = JSON.parse(localStorage.getItem('user') || '{}')

const getExports = async () => {
  try {
    await axiosInstance.get('/exports/').then((res) => {
      state.exports = res.data
    })
  } catch (e: any) {
    throw e
  }
}

getExports()

const OpenConfirmationModal = (exportItem: any) => {
  state.openConfirmation = true
  state.selectedId = exportItem._id
}

const downloadExport = async (fileName: string) => {
  try {
    const downloadLink = document.createElement('a')
    downloadLink.href = `${import.meta.env.VITE_HOST_API}/exports/${fileName}`
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } catch (e: any) {
    throw e
  }
}

const exportUsers = async () => {
  try {
    await axiosInstance
      .post('/exports/', {
        dataScope: 'users'
      })
      .then((res) => {
        const fileName = res.data.fileName

        const downloadLink = document.createElement('a')
        downloadLink.href = `${import.meta.env.VITE_HOST_API}/exports/${fileName}`
        downloadLink.download = fileName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        getExports()
      })
  } catch (e: any) {
    throw e
  }
}

const exportProducts = async () => {
  try {
    await axiosInstance
      .post('/exports/', {
        dataScope: 'products'
      })
      .then((res) => {
        const fileName = res.data.fileName

        const downloadLink = document.createElement('a')
        downloadLink.href = `${import.meta.env.VITE_HOST_API}/exports/${fileName}`
        downloadLink.download = fileName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        getExports()
      })
  } catch (e: any) {
    throw e
  }
}

const removeExport = async (id: string) => {
  try {
    await axiosInstance.delete(`/exports/${id}`).then(() => {
      getExports()
    })
    state.openConfirmation = false
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
          <h1 class="text-base font-semibold leading-6 text-gray-900">Exports</h1>
          <p class="mt-2 text-sm text-gray-700">Liste des exports</p>
        </div>
      </div>
      <!-- S'il n'y a aucun export -->
      <div v-if="state.exports.length === 0" class="mt-6 flex justify-center">
        <div class="max-w-7xl w-full mx-auto sm:px-6 lg:px-8">
          <div class="px-4 py-8 sm:px-0">
            <div class="border-4 border-dashed border-gray-200 rounded-lg h-96">
              <div class="flex flex-col justify-center items-center h-full">
                <div class="flex flex-col justify-center items-center">
                  <svg
                    class="w-16 h-16 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M24 8a16 16 0 1016 16A16 16 0 0024 8z"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M24 14a2 2 0 100 4 2 2 0 000-4zM24 26a2 2 0 100 4 2 2 0 000-4zM24 38a2 2 0 100 4 2 2 0 000-4z"
                      fill="currentColor"
                    />
                  </svg>
                  <h3 class="mt-8 text-lg font-medium text-gray-900">Aucun export</h3>
                  <p class="mt-4 text-sm text-gray-500">
                    Vous n'avez pas encore exporté de données.
                  </p>
                  <div class="mt-6">
                    <button
                     v-if="user.role === 'ROLE_ADMIN' "
                      @click="exportUsers"
                      type="button"
                      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      Exporter les utilisateurs
                    </button>
                    <button
                        v-else
                        @click="exportProducts"
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      Exporter les produits
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="exportItem in state.exports"
          :key="exportItem.id"
          class="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:bg-gray-50"
        >
          <div class="w-full flex items-center justify-between p-6 space-x-6">
            <div class="flex-1 truncate">
              <div class="flex items-center space-x-3">
                <h3 class="text-gray-900 text-sm font-medium truncate">
                  {{ getEntityName(exportItem.dataScope) }}
                </h3>
              </div>
              <p class="mt-1 text-gray-500 text-sm truncate">
                {{ new Date(exportItem.createdAt).toLocaleString('fr-FR') }}
              </p>
            </div>
            <button
              @click="downloadExport(exportItem.fileName)"
              class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Télécharger l'export</span>
              <CloudArrowDownIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              @click="OpenConfirmationModal(exportItem)"
              class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Supprimer l'export</span>
              <TrashIcon class="h-5 w-5 text-red-500 hover:text-red-600" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <OModal
      v-if="state.openConfirmation"
      :open="state.openConfirmation"
      @closeModal="state.openConfirmation = false"
      @confirm="removeExport(state.selectedId)"
      title="Supprimer un export"
      confirmButton="Supprimer"
      content="Êtes-vous sûr de vouloir supprimer cet export ?"
    />
  </AuthenticatedLayout>
</template>
