<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import {onMounted, onUnmounted, reactive} from 'vue'
import OTable from '@/components/OTable.vue'
import {useRouter} from 'vue-router'
import OModal from '@/components/OModal.vue'
import UsersSidebarForm from '@/views/users/UsersSidebarForm.vue'
import {CloudArrowDownIcon} from '@heroicons/vue/24/outline'

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
const getUsers = async () => {
  try {
    await axiosInstance.get('/users').then((res) => {
      state.columns = ['firstname', 'lastname', 'email', 'role']
      state.rows = res.data
      // remove user from table if account is disabled
      state.rows = state.rows.filter((row: any) => !row.disabled)
    })
  } catch (e: any) {
    throw e
  }
}

const deleteUser = async (id: string) => {
  try {
    await axiosInstance.delete(`/users/${id}`).then(() => {
      state.openConfirmation = false
      state.selectedId = ''
      getUsers()
    })
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
      })
  } catch (e: any) {
    throw e
  }
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
  getUsers()
}
const closeCreationDrawer = () => {
  state.openCreation = false
  getUsers()
}

onMounted(() => {
  getUsers()
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
          <h1 class="text-base font-semibold leading-6 text-gray-900">Utilisateurs</h1>
          <p class="mt-2 text-sm text-gray-700">Liste des utilsateurs</p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            @click="exportUsers"
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
            Ajouter un utilisateur
          </button>
        </div>
      </div>
      <OTable
        :rows="state.rows"
        :columns="state.columns"
        @deleteRow="OpenConfirmationModal"
        @updateRow="openUpdatingDrawer"
        @showRow="(row: any) => router.push({ name: 'user', params: { id: row.id } })"
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
      @confirm="deleteUser(state.selectedId)"
      title="Supprimer un utilisateur"
      confirmButton="Supprimer"
      content="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    />
  </AuthenticatedLayout>
</template>
