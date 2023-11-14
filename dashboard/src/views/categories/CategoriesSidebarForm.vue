<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance';
import {reactive, ref, watch} from 'vue'
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

const emit = defineEmits(['closeCreationDrawer', 'closeUpdatingDrawer'])


const category = async () => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`)
    state.form = response.data;
  } catch (e: any) {
    throw e;
  }
}

const state = reactive({
  form: {
    name: '',
    description: '',
  },
  errors: {},
})

const id = window.location.pathname.split('/').length > 3 ? window.location.pathname.split('/')[2] : null
const submitCreation = async () => {
  try {
    await axiosInstance.post('/categories', state.form).then(
        () => {
          emit('closeCreationDrawer')
        })
  } catch (e: any) {
    state.errors = e.response.data.errors
  }
}
const submitUpdating = async () => {
  try {
    await axiosInstance.patch(`/categories/${props.id}`, state.form).then(
        () => {
          emit('closeUpdatingDrawer')
        })
  } catch (e: any) {
    state.errors = e.response.data.errors
  }
}

watch(() => props.id, async () => {
  if (props.id) {
    try {
      const response = await axiosInstance.get(`/categories/${props.id}`)
      state.form = response.data
    } catch (e: any) {
      throw e
    }
  }
})

</script>

<template>
  <ODrawer :open="props.open" @closeDrawer="!props.id ? emit('closeCreationDrawer') : emit('closeUpdatingDrawer')"
           :title="!props.id ? 'Ajout d\'une nouvelle catégorie'  : `Modifier la catégorie ${ props.id }`">
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
              v-model="state.form.description"
              type="text"
              label="description"
              validation="required|description"
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
            {{ !props.id ? 'Crée' : 'Modifier' }}
          </button>
        </div>
      </form>
    </div>
  </ODrawer>
</template>
