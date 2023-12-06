<script setup lang="ts">
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  EllipsisHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { ref, watchEffect, reactive } from 'vue'
import { columnNames, getValue } from '@/utils/valuesUpdater'

const props = defineProps({
  actions: {
    required: false,
    type: Array<String>,
    default: ["show", "update", "delete"]
  },
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

const state = reactive({
  currentPage: 1,
  itemsPerPage: 10
})

const emit = defineEmits(['showRow', 'updateRow', 'deleteRow'])

const hoveredRow = ref<number | null>(null)

let displayedRows = reactive<any[]>([])

watchEffect(() => {
  const startIdx = (state.currentPage - 1) * state.itemsPerPage
  const endIdx = startIdx + state.itemsPerPage
  displayedRows = props.rows.slice(startIdx, endIdx)
})

const columnFilters = reactive<any>({})
watchEffect(() => {
  displayedRows = props.rows.filter((row) =>
    Object.keys(columnFilters).every(
      (col) =>
        !columnFilters[col] ||
        getValue(row, col).toString().toLowerCase().includes(columnFilters[col].toLowerCase())
    )
  )
})

const showSearch = reactive<any>({})
const toggleSearch = (col: string) => {
  showSearch[col] = !showSearch[col]
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
                  v-if="props.columns.length"
                  v-for="col in props.columns"
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 relative"
                >
                  <span class="flex items-center space-x-1">
                    {{ columnNames[col] ? columnNames[col] : col }}
                    <span @click="toggleSearch(col)">
                      <MagnifyingGlassIcon class="w-3 h-3 ml-2 text-gray-900 cursor-pointer" />
                    </span>
                  </span>
                  <input
                    v-if="col !== props.columns[props.columns.length] && showSearch[col]"
                    v-model="columnFilters[col]"
                    class="w-full px-2 py-1 mt-1 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Rechercher"
                  />
                </th>
                <th
                  v-if="props.actions && props.actions.length"
                  scope="col"
                  class="py-3.5 pl-4 pr-6 text-right text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-if="displayedRows.length"
                v-for="(row, index) in displayedRows"
                :key="index"
                @mouseenter="hoveredRow = index"
                @mouseleave="hoveredRow = null"
                :class="{
                  'text-secondary': hoveredRow === index,
                  'text-gray-900': hoveredRow !== index
                }"
              >
                <td
                  v-for="col in props.columns"
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 cursor-pointer"
                  @click="col !== props.columns[props.columns.length] ? emit('showRow', row) : null"
                >
                  <img
                    v-if="col === 'productImage' && getValue(row, 'productImages')"
                    class="w-16"
                    :src="getValue(row, col)"
                    alt="Image du produit"
                  />
                  <img
                    v-else-if="col === 'productImage'"
                    class="w-16"
                    src="/images/no-image.jpeg"
                    alt="Aucune image disponible"
                  />
                  <span
                    v-else
                    :class="[
                      col === 'quantity' ? 'bg-gray-100 px-2 py-1 rounded-md' : '',
                      col === 'quantity' && row['quantity'] <= row['alertQuantity']
                        ? 'bg-red-200'
                        : ''
                    ]"
                  >
                    {{ getValue(row, col) }}
                  </span>
                </td>
                <td
                  v-if="props.actions && props.actions.length"
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-end"
                >
                  <div class="w-24 flex justify-end items-center space-x-2">
                    <!-- <button @click="emit('showRow', row)" v-show="hoveredRow === index">
                      <EyeIcon class="w-5 h-5 text-gray-900 hover:text-gray-950" />
                    </button> -->
                    <button @click="emit('updateRow', row)" v-show="hoveredRow === index">
                      <PencilSquareIcon class="w-5 h-5 text-gray-900 hover:text-gray-700" />
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
        <!-- pagination -->
        <div class="flex justify-between items-center mt-4">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              type="button"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              type="button"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de
                <span class="font-medium">{{
                  (state.currentPage - 1) * state.itemsPerPage + 1
                }}</span>
                à
                <span class="font-medium">{{
                  state.currentPage * state.itemsPerPage > props.rows.length
                    ? props.rows.length
                    : state.currentPage * state.itemsPerPage
                }}</span>
                parmis
                <span class="font-medium">{{ props.rows.length }}</span>
                résultats
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{
                    'bg-gray-50': state.currentPage === 1,
                    'bg-white': state.currentPage !== 1
                  }"
                  @click="state.currentPage -= 1"
                  :disabled="state.currentPage === 1"
                >
                  <span class="sr-only">Précédent</span>
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                <button
                  type="button"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {{ state.currentPage }}
                </button>
                <button
                  type="button"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{
                    'bg-gray-50': state.currentPage >= props.rows.length / state.itemsPerPage,
                    'bg-white': state.currentPage < props.rows.length / state.itemsPerPage
                  }"
                  @click="state.currentPage += 1"
                  :disabled="state.currentPage >= props.rows.length / state.itemsPerPage"
                >
                  <span class="sr-only">Suivant</span>
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
