<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import { onMounted, onUnmounted, reactive } from 'vue'
import OTable from '@/components/OTable.vue'
import { useRouter } from 'vue-router'

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
      </div>
      <OTable
        :actions="false"
        :rows="state.rows"
        :columns="state.columns"
        @showRow="(row: any) => router.push({ name: 'order', params: { id: row.id } })"
      />
    </div>
  </AuthenticatedLayout>
</template>
