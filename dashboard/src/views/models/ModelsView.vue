<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance';
import {ref, onMounted, onUnmounted, reactive} from 'vue';
import ModelsFormView from "@/views/models/ModelsFormView.vue";
import type {ModelType} from "@/types/ModelTypes";
import OModal from "@/components/OModal.vue";

const state = reactive({
  openCreation: false,
  openUpdating: false,
  openConfirmation: false,
  selectedId: "",
})

const models = ref([] as ModelType[]);
const keys = ref([]);
const abortController = new AbortController
const getModels = async () => {
  try {
    const response = await axiosInstance.get('/models')
    models.value = response.data;
    keys.value = ["name", "gender", "description"];
  } catch (e: any) {
    throw e;
  }
}

const deleteModel = async (id: string) => {
  try {
    await axiosInstance.delete(`/models/${id}`).then(() => {
      state.openConfirmation = false
      state.selectedId = ""
      getModels()
    })
  } catch (e: any) {
    throw e;
  }
}

const OpenConfirmationModal = (id: string) => {
  state.openConfirmation = true
  state.selectedId = id
}

onUnmounted(() => {
  abortController.abort()
})

const openCreationDrawer = () => {
  state.openCreation = true
}

const openUpdatingDrawer = (id: string) => {
  state.openUpdating = true
  state.selectedId = id
}

const closeUpdatingDrawer = () => {
  state.openUpdating = false
  state.selectedId = ""
  getModels()
}
const closeCreationDrawer = () => {
  state.openCreation = false
  getModels()
}

getModels()

</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Models</h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all the models.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
              @click="openCreationDrawer"
              type="button"
              class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add model
          </button>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
              <tr>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" v-for="key in keys">
                  {{ key }}
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Edit</span>
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Delete</span>
                </th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-if="models.length !== 0" v-for="model in models">
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div class="text-gray-900">{{ model.name }}</div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div class="text-gray-900">{{ model.gender }}</div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div class="text-gray-900">{{ model.description }}</div>
                </td>
                <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <RouterLink :to="{name : 'model', params: { id: model.id }}"
                              class="text-indigo-600 hover:text-indigo-900"
                  >View
                  </RouterLink>
                </td>
                <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <button @click="openUpdatingDrawer(model.id)" class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </button>
                </td>
                <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <button class="text-indigo-600 hover:text-indigo-900" @click="OpenConfirmationModal(model.id)">
                    Delete
                  </button>
                </td>
              </tr>

              <div v-else>
                No data available, please add a category.
              </div>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <ModelsFormView v-if="state.openCreation" :open="state.openCreation" @closeCreationDrawer="closeCreationDrawer"/>
    <ModelsFormView v-if="state.openUpdating" :open="state.openUpdating" :id="state.selectedId"
                    @closeUpdatingDrawer="closeUpdatingDrawer"/>
    <OModal v-if="state.openConfirmation" :open="state.openConfirmation" @closeModal="state.openConfirmation = false"
            @confirm="deleteModel(state.selectedId)" title="Delete model"
            content="Are you sure you want to delete this model?" confirmButton="Delete"/>
  </AuthenticatedLayout>
</template>
