<script setup lang="ts">
import axiosInstance from '@/utils/axiosInstance'
import { reactive, watch } from 'vue'
import ODrawer from '@/components/ODrawer.vue'
import type { CategoryType } from '@/types/CategoryTypes'
import { categorySchema } from '@/utils/validations/categorySchema'

const props = defineProps({
  open: {
    required: true,
    type: Boolean,
    default: false
  },
  id: {
    required: false,
    type: String
  }
})

const state = reactive({
  category: {
    name: ''
  } as CategoryType,
  errors: ''
})

const emit = defineEmits(['closeCreationDrawer', 'closeUpdatingDrawer'])

const validateAndSubmit = async (isCreation: boolean) => {
  const categoryToSubmit: any = { ...state.category }

  const schema = categorySchema.pick({ ...categoryToSubmit })

  const result = schema.safeParse(categoryToSubmit)

  if (!result.success) {
    state.errors = JSON.parse(result.error.message)[0].message
    return
  }

  try {
    if (isCreation) {
      await axiosInstance.post('/categories', categoryToSubmit).then(() => {
        state.errors = ''
        emit('closeCreationDrawer')
      })
    } else {
      await axiosInstance
        .patch(`/categories/${props.id}`, categoryToSubmit)
        .then(() => {
          state.errors = ''
          emit('closeUpdatingDrawer')
        })
        .catch((error: any) => {
          state.errors = error.response.data.message
          console.log(error)
        })
    }
  } catch (error: any) {
    state.errors = error.response.data.message
  }
}

watch(
  () => props.id,
  async () => {
    if (props.id) {
      try {
        const response = await axiosInstance.get(`/categories/${props.id}`)
        state.category = response.data
      } catch (e: any) {
        throw e
      }
    }
  }
)
</script>

<template>
  <ODrawer
    :open="props.open"
    @closeDrawer="!props.id ? emit('closeCreationDrawer') : emit('closeUpdatingDrawer')"
    :title="!props.id ? 'Ajout d\'une nouvelle catégorie' : `Modifier la catégorie ${props.id}`"
  >
    <div>
      <div class="my-5">
        <small v-if="state.errors && state.errors.length" class="text-red-600">{{
          state.errors
        }}</small>
      </div>
      <form
        method="POST"
        class="space-y-6"
        @submit.prevent="!props.id ? validateAndSubmit(true) : validateAndSubmit(false)"
      >
        <div>
          <label for="name" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Nom' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.category.name"
            type="text"
            id="name"
            name="name"
            placeholder="Nom"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Description' + (!props.id ? '*' : '')
          }}</label>
          <textarea
            v-model="state.category.description"
            id="description"
            name="description"
            placeholder="Description"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div v-if="!props.id">
          <small>* Champs obligatoires</small>
        </div>
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {{ !props.id ? 'Créer' : 'Modifier ' }}
          </button>
        </div>
      </form>
    </div>
  </ODrawer>
</template>
