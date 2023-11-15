<script lang="ts" setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import { onMounted, reactive } from 'vue'
import {useRouter} from 'vue-router'
import { columnNames, getValue } from '@/utils/valuesUpdater'
import type {UserType} from "@/types/UserType";

const route = useRouter()

const state = reactive({
  user: {} as UserType
})

const userId = route.currentRoute.value.params.id

const getUser = async () => {
  try {
    await axiosInstance.get(`/users/${userId}`).then((res) => {
      state.user = res.data
    })
  } catch (e: any) {
    throw e
  }
}

onMounted(() => {
  getUser()
})
</script>
<template>
  <AuthenticatedLayout>
    <div class="px-4">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">
            {{ `Utilisateur ${state.user.firstname} ${state.user.lastname}` }}
          </h1>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <RouterLink
            :to="{ name: 'users' }"
            class="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            <button
              type="button"
              class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Retour à la liste
            </button>
          </RouterLink>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <table class="min-w-full divide-y divide-gray-200">
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(value, key) in state.user" :key="key">
              <td class="px-6 py-4 text-sm font-medium text-gray-500">
                {{ columnNames[key] ? columnNames[key] : key }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ getValue(state.user, key) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
