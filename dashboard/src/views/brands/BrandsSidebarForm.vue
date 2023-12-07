<script setup lang="ts">
import axiosInstance from '@/utils/axiosInstance'
import { reactive, watch } from 'vue'
import ODrawer from '@/components/ODrawer.vue'
import { brandSchema } from '@/utils/validations/brandSchema'
import type { BrandType } from '@/types/BrandType';

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
  brand: {
    name: ''
  } as BrandType,
  errors: ''
})

const emit = defineEmits(['closeCreationDrawer', 'closeUpdatingDrawer'])

const validateAndSubmit = async (isCreation: boolean) => {
  const brandToSubmit: any = { ...state.brand }

  const schema = brandSchema.pick({ ...brandToSubmit })

  const result = schema.safeParse(brandToSubmit)

  if (!result.success) {
    state.errors = JSON.parse(result.error.message)[0].message
    return
  }

  try {
    if (isCreation) {
      await axiosInstance.post('/brands', brandToSubmit).then(() => {
        state.errors = ''
        emit('closeCreationDrawer')
      })
    } else {
      await axiosInstance
        .patch(`/brands/${props.id}`, brandToSubmit)
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
        const response = await axiosInstance.get(`/brands/${props.id}`)
        state.brand = response.data
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
    :title="!props.id ? `Ajout d'une nouvelle marque` : `Modifier la marque`"
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
            v-model="state.brand.name"
            type="text"
            id="name"
            name="name"
            placeholder="Nom"
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
