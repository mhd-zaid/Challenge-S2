<script setup lang="ts">
import {EyeIcon, PencilSquareIcon, TrashIcon} from '@heroicons/vue/24/outline'

const props = defineProps({
  columns: {
    required: true,
    type: Object,
    default: []
  },
  rows: {
    required: true,
    type: Array,
    default: [] as unknown
  },
})

const emit = defineEmits(['showRow', 'updateRow', 'deleteRow'])
</script>
<template>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
            <tr>
              <th v-for="col in props.columns" scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{{ col }}
                <i class="bi bi-sort-alpha-down" aria-label='Sort Icon'></i>
              </th>
              <th scope="col" class="py-3.5 pl-4 pr-6 text-right text-sm font-semibold text-gray-900 sm:pl-6">
                <span>Actions</span>
              </th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="props.rows.length !== 0" v-for="(row, index ) in props.rows" :key="index">
              <td v-for="col in props.columns"
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {{ row[col] }}
              </td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-4 items-baseline">
                <button @click="emit('showRow', row)">
                  <EyeIcon class="w-6 text-gray-900 hover:text-gray-950"/>
                </button>
                <button @click="emit('updateRow', row)">
                  <PencilSquareIcon class="w-6 text-orange-500 hover:text-orange-600"/>
                </button>
                <button @click="emit('deleteRow', row)">
                  <TrashIcon class="w-6 text-red-600 hover:text-red-500"/>
                </button>
              </td>
            </tr>
            <div v-else>
              <p class="text-center text-gray-500 text-xl font-semibold py-6">Aucune donnée disponible</p>
            </div>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
