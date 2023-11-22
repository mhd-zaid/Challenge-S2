<script setup lang="ts">
import axiosInstance from '@/utils/axiosInstance'
import { reactive, watch } from 'vue'
import ODrawer from '@/components/ODrawer.vue'
import { productSchema } from '@/utils/validations/productSchema'
import type { ProductType } from '@/types/ProductType'

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
  product: {} as ProductType,
  models: [] as any[],
  images: [] as any[],
  errors: ''
})

const emit = defineEmits(['closeCreationDrawer', 'closeUpdatingDrawer'])

const validateAndSubmit = async (isCreation: boolean) => {
  const productToSubmit: any = { ...state.product }
  productToSubmit.price = parseFloat(productToSubmit.price);
  productToSubmit.vat = parseFloat(productToSubmit.vat);
  productToSubmit.size = parseFloat(productToSubmit.size);
  productToSubmit.quantity = parseInt(productToSubmit.quantity);
  productToSubmit.discount = parseFloat(productToSubmit.discount);
  productToSubmit.alertQuantity = parseInt(productToSubmit.alertQuantity);


  const schema = productSchema.pick({ ...productToSubmit })

  const result = schema.safeParse(productToSubmit)

  if (!result.success) {
    state.errors = JSON.parse(result.error.message)[0].message
    return
  }

  try {
    if (isCreation) {
      await axiosInstance.post('/products', productToSubmit).then(() => {
        state.errors = ''
        emit('closeCreationDrawer')
      })
    } else {
      await axiosInstance
        .patch(`/products/${props.id}`, productToSubmit)
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
        const response = await axiosInstance.get(`/products/${props.id}`)
        state.product = response.data
        const modelsRes = await axiosInstance.get('/models')
        state.models = modelsRes.data
      } catch (e: any) {
        throw e
      }
    }
  }
)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    state.images = Array.from(input.files)
  }
}
</script>

<template>
  <ODrawer
    :open="props.open"
    @closeDrawer="!props.id ? emit('closeCreationDrawer') : emit('closeUpdatingDrawer')"
    :title="!props.id ? `Ajout d'un nouveau produit` : `Modifier le produit`"
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
            v-model="state.product.name"
            type="text"
            id="name"
            name="name"
            placeholder="Nom"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="price" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Prix' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.product.price"
            type="number"
            step="0.01"
            id="price"
            name="price"
            placeholder="Prix"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="vat" class="block text-sm font-medium leading-6 text-gray-900">{{
            'TVA' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.product.vat"
            type="number"
            id="vat"
            step="0.01"
            name="vat"
            placeholder="TVA"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="size" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Taille' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.product.size"
            type="number"
            id="size"
            name="size"
            placeholder="41"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="quantity" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Quantité' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.product.quantity"
            type="number"
            id="quantity"
            name="quantity"
            placeholder="100"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="sku" class="block text-sm font-medium leading-6 text-gray-900">{{
            'SKU' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.product.sku"
            type="text"
            id="sku"
            name="sku"
            placeholder="4225-213-9823"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="discount" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Remise' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.product.discount"
            type="number"
            id="discount"
            name="discount"
            placeholder="10"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label for="color" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Couleur' + (!props.id ? '*' : '')
          }}</label>
          <select
            v-model="state.product.color"
            id="color"
            name="color"
            placeholder="Couleur"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          >
            <option value="black">Noir</option>
            <option value="white">Blanc</option>
            <option value="red">Rouge</option>
            <option value="blue">Bleu</option>
            <option value="green">Vert</option>
            <option value="yellow">Jaune</option>
            <option value="orange">Orange</option>
            <option value="purple">Violet</option>
            <option value="pink">Rose</option>
            <option value="brown">Marron</option>
            <option value="gray">Gris</option>
          </select>
        </div>
        <div>
          <label for="model" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Modèle' + (!props.id ? '*' : '')
          }}</label>
          <select
            v-model="state.product.model"
            id="model"
            name="model"
            placeholder="Modèle"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          >
            <option v-for="model in state.models" :key="model.id" :value="model.id">
              {{ model.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="images" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Images' + (!props.id ? '*' : '')
          }}</label>
          <input
            @change="handleFileChange"
            type="file"
            id="images"
            name="images"
            placeholder="Images"
            accept=".img, .png, .jpg, .jpeg, .svg, .webp"
            :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
            }"
            multiple
          />
        </div>
        <div>
          <label for="alertQuantity" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Quantité d\'alerte' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.product.alertQuantity"
            type="number"
            id="alertQuantity"
            name="alertQuantity"
            placeholder="Quantité d'alerte"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
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
