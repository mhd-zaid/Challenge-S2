<script setup lang="ts">
import axiosInstance from '@/utils/axiosInstance'
import {reactive, watch} from 'vue'
import ODrawer from "@/components/ODrawer.vue";

const props = defineProps({
  open: {
    required: true,
    type: Boolean,
    default: false
  },
  id: {
    required: false,
    type: String,
  },
})

const state = reactive({
  form: {
    name: '',
    gender: '',
    description: '',
    BrandId: '',
    CategoryId: '',
  } as any,
  gender: [
    {
      value: 'male',
      name: 'Male'
    },
    {
      value: 'female',
      name: 'Female'
    }
  ],
  brands: [] as any,
  categories: [] as any,
  errors: {}
})

watch(() => props.id, async () => {
  if (props.id) {
    try {
      const response = await axiosInstance.get(`/models/${props.id}`)
      state.form = response.data
    } catch (e: any) {
      throw e
    }
  }
})

const init = async () => {
  try {
    const categories = await axiosInstance.get('/categories')
    const brands = await axiosInstance.get('/brands')
    state.categories = categories.data
    state.brands = brands.data
  } catch (e: any) {
    throw e
  }
}

const submitCreation = async () => {
  try {
    await axiosInstance.post('/models', state.form).then(
        () => {
          emit('closeCreationDrawer')
        })
  } catch (e: any) {
    state.errors = e.response.data.errors
  }
}
const submitUpdating = async () => {
  try {
    await axiosInstance.patch(`/models/${props.id}`, state.form).then(
        () => {
          emit('closeUpdatingDrawer')
        })
  } catch (e: any) {
    state.errors = e.response.data.errors
  }
}

const emit = defineEmits(['closeCreationDrawer', 'closeUpdatingDrawer'])

init()
</script>

<template>
  <ODrawer :open="props.open" @closeDrawer="!props.id ? emit('closeCreationDrawer') : emit('closeUpdatingDrawer')"
           :title="!props.id ? 'Ajout d\'un nouveau model' : `Modifier le model ${ props.id }`">
    <div>
      <form method="POST" class="space-y-6" @submit.prevent="!props.id ? submitCreation() : submitUpdating()">
        <div>
          <FormKit
              v-model="state.form.name"
              type="text"
              label="name"
              validation="required"
              placeholder="name"
              :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          />
        </div>

        <div>
          <FormKit
              v-model="state.form.gender"
              type="select"
              label="gender"
              validation="required|gender"
              placeholder="Select a gender"
              :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          >
            <optgroup label="Gender">
              <option v-for="gender in state.gender" :value="gender.value">
                {{ gender.name }}
              </option>
            </optgroup>
          </FormKit>
        </div>

        <div>
          <FormKit
              v-model="state.form.BrandId"
              type="select"
              label="brand"
              validation="required|brands"
              placeholder="Select a brand"
              :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          >
            <optgroup label="Brand">
              <option v-for="brand in state.brands" :value="brand.id">{{ brand.name }}</option>
            </optgroup>
          </FormKit>
        </div>

        <div>
          <FormKit
              v-model="state.form.CategoryId"
              type="select"
              label="category"
              validation="required|categories"
              placeholder="Select a category"
              :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          >
            <optgroup label="Category">
              <option v-for="category in state.categories" :value="category.id">{{ category.name }}</option>
            </optgroup>
          </FormKit>
        </div>

        <div>
          <FormKit
              v-model="state.form.description"
              type="textarea"
              label="description"
              validation="required"
              placeholder="Write a description"
              :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          />
        </div>

        <div>
          <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {{ !props.id ? 'Crée' : 'Modifier ' }}
          </button>
        </div>
      </form>
    </div>
  </ODrawer>
</template>
