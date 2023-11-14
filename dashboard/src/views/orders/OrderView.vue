<script lang="ts" setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import { onBeforeMount } from 'vue'
import { ref } from 'vue'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { columnNames, getValue } from '@/utils/valuesUpdater'

const route = useRoute()

const state = reactive({
  order: <any>{}
})

const orderId = ref<string | null>(null)

const getOrder = async () => {
  try {
    await axiosInstance.get(`/orders/${orderId.value}`).then((res) => {
      state.order = res.data
    })
  } catch (e: any) {
    throw e
  }
}

onBeforeMount(() => {
  if (typeof route.params.id === 'string') orderId.value = route.params.id
})

onMounted(() => {
  getOrder()
})
</script>
<template>
  <AuthenticatedLayout>
    <div class="px-4">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">
            {{
              state.order && state.order.id
                ? `Commande n°${state.order.id.toUpperCase()}`
                : 'Commande non disponible'
            }}
          </h1>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <RouterLink
            :to="{ name: 'orders' }"
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
            <tr v-for="(value, key) in state.order" :key="key">
              <td class="px-6 py-4 text-sm font-medium text-gray-500">
                {{ columnNames[key] ? columnNames[key] : key }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ getValue(state.order, key) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
