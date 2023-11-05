<script setup lang="ts">
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  EllipsisHorizontalIcon
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { columns } from '@/utils/OTableColumns'

const props = defineProps({
  columns: {
    required: true,
    type: Object,
    default: []
  },
  rows: {
    required: true,
    type: Array<any>,
    default: [] as unknown
  }
})

const emit = defineEmits(['showRow', 'updateRow', 'deleteRow'])

const hoveredRow = ref<number | null>(null)

const formatDate = (date: string) => {
  const dateObject = new Date(date)
  const year = dateObject.getFullYear()
  const month = String(dateObject.getMonth() + 1).padStart(2, '0')
  const day = String(dateObject.getDate()).padStart(2, '0')
  const hours = String(dateObject.getHours()).padStart(2, '0')
  const minutes = String(dateObject.getMinutes()).padStart(2, '0')
  const seconds = String(dateObject.getSeconds()).padStart(2, '0')

  return `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`
}

const getValue = (row: any, col: any) => {
  switch (col) {
    case 'createdAt':
      return formatDate(row[col])
    case 'role':
      return row[col] === 'ROLE_ADMIN'
        ? 'Administrateur'
        : row[col] === 'ROLE_STORE_KEEPER'
        ? 'Magasinier'
        : 'Utilisateur'
    case 'disabled':
      return row[col] ? 'Inactif' : 'Actif'
    case 'gender':
      return row[col] === 'male' ? 'Homme' : 'Femme'
    default:
      return row[col]
  }
}
</script>

<template>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="col in props.columns"
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  {{ columns[col] ? columns[col] : col }}
                  <i class="bi bi-sort-alpha-down" aria-label="Sort Icon"></i>
                </th>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-6 text-right text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-if="props.rows.length"
                v-for="(row, index) in props.rows"
                :key="index"
                @mouseenter="hoveredRow = index"
                @mouseleave="hoveredRow = null"
              >
                <td
                  v-for="col in props.columns"
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                >
                  {{ getValue(row, col) }}
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-end"
                >
                  <div class="w-24 flex justify-end items-center space-x-2">
                    <button @click="emit('showRow', row)" v-show="hoveredRow === index">
                      <EyeIcon class="w-5 h-5 text-gray-900 hover:text-gray-950" />
                    </button>
                    <button @click="emit('updateRow', row)" v-show="hoveredRow === index">
                      <PencilSquareIcon class="w-5 h-5 text-orange-500 hover:text-orange-600" />
                    </button>
                    <button @click="emit('deleteRow', row)" v-show="hoveredRow === index">
                      <TrashIcon class="w-5 h-5 text-red-600 hover:text-red-500" />
                    </button>
                    <button @click="emit('showRow', row)" v-show="hoveredRow !== index">
                      <EllipsisHorizontalIcon class="w-5 h-5 text-gray-900" />
                    </button>
                  </div>
                </td>
              </tr>

              <div v-else>
                <p class="text-center text-gray-500 text-sm font-semibold py-6">
                  Aucune donnée disponible
                </p>
              </div>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
