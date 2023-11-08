<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import { onMounted, onUnmounted, reactive } from 'vue'
import OTable from '@/components/OTable.vue'
import { useRouter } from 'vue-router'
import OModal from '@/components/OModal.vue'
import UsersSidebarForm from '@/views/users/UsersSidebarForm.vue'

const router = useRouter()
const state = reactive({
  columns: {},
  rows: [],
  openConfirmation: false,
  openUpdating: false,
  selectedId: '',
  openCreation: false
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

const deleteOrder = async (id: string) => {
  try {
    await axiosInstance.delete(`/users/${id}`).then(() => {
      state.openConfirmation = false
      state.selectedId = ''
      getOrders()
    })
  } catch (e: any) {
    throw e
  }
}

const OpenConfirmationModal = (order: any) => {
  state.openConfirmation = true
  state.selectedId = order.id
}

const openUpdatingDrawer = (order: any) => {
  state.openUpdating = true
  state.selectedId = order.id
}

const closeUpdatingDrawer = () => {
  state.openUpdating = false
  state.selectedId = ''
  getOrders()
}
const closeCreationDrawer = () => {
  state.openCreation = false
  getOrders()
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
            @click="state.openCreation = true"
            type="button"
            class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Ajouter une commande
          </button>
        </div>
      </div>
      <OTable
        :rows="state.rows"
        :columns="state.columns"
        @deleteRow="OpenConfirmationModal"
        @updateRow="openUpdatingDrawer"
        @showRow="(row: any) => router.push({ name: 'order', params: { id: row.id } })"
      />
    </div>
    <UsersSidebarForm
      v-if="state.openCreation"
      :open="state.openCreation"
      @closeCreationDrawer="closeCreationDrawer"
    />
    <UsersSidebarForm
      :open="state.openUpdating"
      :id="state.selectedId"
      @closeUpdatingDrawer="closeUpdatingDrawer"
    />
    <OModal
      v-if="state.openConfirmation"
      :open="state.openConfirmation"
      @closeModal="state.openConfirmation = false"
      @confirm="deleteOrder(state.selectedId)"
      title="Supprimer un utilisateur"
      confirmButton="Supprimer"
      content="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    />
  </AuthenticatedLayout>
</template>
