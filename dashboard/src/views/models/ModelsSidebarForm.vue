<script setup lang="ts">
import axiosInstance from '@/utils/axiosInstance'
import { reactive, watch } from 'vue'
import ODrawer from '@/components/ODrawer.vue'
import type { BrandType } from '@/types/BrandType'
import type { ModelType } from '@/types/ModelType'
import type { CategoryType } from '@/types/CategoryTypes'
import { modelSchema } from '@/utils/validations/modelSchema'
import { onMounted } from 'vue'

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
  model: {} as ModelType,
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
  brands: [] as BrandType[],
  categories: [] as CategoryType[],
  errors: ''
})

const emit = defineEmits(['closeCreationDrawer', 'closeUpdatingDrawer'])

const validateAndSubmit = async (isCreation: boolean) => {
  const modelToSubmit: any = { ...state.model }

  const schema = modelSchema.pick({ ...modelToSubmit })

  const result = schema.safeParse(modelToSubmit)

  if (!result.success) {
    state.errors = JSON.parse(result.error.message)[0].message
    return
  }

  try {
    if (isCreation) {
      await axiosInstance.post('/models', modelToSubmit).then(() => {
        state.errors = ''
        emit('closeCreationDrawer')
      })
    } else {
      await axiosInstance
        .patch(`/models/${props.id}`, modelToSubmit)
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
        const response = await axiosInstance.get(`/models/${props.id}`)
        state.model = response.data
      } catch (e: any) {
        throw e
      }
    }
  }
)

onMounted(() => {
  axiosInstance.get('/brands').then((response) => {
    state.brands = response.data
  })
  axiosInstance.get('/categories').then((response) => {
    state.categories = response.data
  })
})
</script>

<template>
  <ODrawer
    :open="props.open"
    @closeDrawer="!props.id ? emit('closeCreationDrawer') : emit('closeUpdatingDrawer')"
    :title="!props.id ? 'Ajout d\'un nouveau modèle' : `Modifier le modèle`"
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
            v-model="state.model.name"
            type="text"
            id="name"
            name="name"
            placeholder="Nom"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Genre' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.model.gender"
            type="text"
            id="gender"
            name="gender"
            placeholder="Genre"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>

        <div>
          <label for="brand" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Marque' + (!props.id ? '*' : '')
          }}</label>
          <select
            v-model="state.model.BrandId"
            id="brand"
            name="brand"
            placeholder="Select a brand"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option v-for="brand in state.brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="category" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Catégorie' + (!props.id ? '*' : '')
          }}</label>
          <select
            v-model="state.model.CategoryId"
            id="category"
            name="category"
            placeholder="Select a category"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option v-for="category in state.categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="description" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Description' + (!props.id ? '*' : '')
          }}</label>
          <textarea
            v-model="state.model.description"
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
