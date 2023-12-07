<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import {onMounted, onUnmounted, reactive} from 'vue'
import OTable from '@/components/OTable.vue'
import {useRouter} from 'vue-router'
import {CloudArrowDownIcon} from '@heroicons/vue/24/outline'

const router = useRouter()
const state = reactive({
  columns: {},
  rows: [],
  selectedId: ''
})
const abortController = new AbortController()
const getOrders = async () => {
  try {
    await axiosInstance.get('/orders').then((res) => {
      state.columns = ['userId', 'createdAt', 'status']
      state.rows = res.data
    })
  } catch (e: any) {
    throw e
  }
}

const exportOrders = async () => {
  try {
    await axiosInstance
      .post('/exports/', {
        dataScope: 'orders'
      })
      .then((res) => {
        const fileName = res.data.fileName

        const downloadLink = document.createElement('a')
        downloadLink.href = `${import.meta.env.VITE_HOST_API}/exports/${fileName}`
        downloadLink.download = fileName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      })
  } catch (e: any) {
    throw e
  }
}

onMounted(() => {
  getOrders()
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
          <h1 class="text-base font-semibold leading-6 text-gray-900">Commandes</h1>
          <p class="mt-2 text-sm text-gray-700">Liste des commandes</p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              @click="exportOrders"
              class="bg-white rounded-md text-gray-400 px-3 py-2 text-center text-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Télécharger l'export</span>
              <CloudArrowDownIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
      </div>
      <OTable
        :actions=[]
        :rows="state.rows"
        :columns="state.columns"
        @showRow="(row: any) => router.push({ name: 'order', params: { id: row.id } })"
      />
    </div>
  </AuthenticatedLayout>
</template>
