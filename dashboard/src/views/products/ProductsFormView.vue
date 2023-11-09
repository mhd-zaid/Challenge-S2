<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const state = reactive({
  form: {
    name: '',
    price: '',
    quantity: '',
    vat: '',
    size: '',
    color: '',
    sku: '',
    discount: '',
    model: '' as any
  },
  errors: {},
  models: [] as any,
  images: [] as any,
  currentFile: ''
})
const id = router.currentRoute.value.params.id
const init = async () => {
  const response = await axiosInstance.get('/models')
  state.models = response.data.map((model: any) => {
    return {
      label: model.name + ' (' + model.gender + ')',
      value: model.id
    }
  })
  if (id) {
    const response = await axiosInstance.get(`/products/${id}`)
    state.form = response.data
  }
}

const createProduct = async () => {
  try {
    const response = await axiosInstance.post('/products', state.form)
    let images = new FormData()
    state.images.forEach((fileItem: any) => {
      images.append('image', fileItem.file)
    })
    await axiosInstance.post('/products/upload/' + response.data.id, images)
    await router.push('/products')
  } catch (e) {
    console.error(e)
  }
}

const updateProduct = async () => {
  console.log(state.form, state.image, 'update')
  try {
    const body = new FormData()
    state.image.forEach((fileItem: any) => {
      body.append('image', fileItem.file)
      state.form.url = `/images/${fileItem.file.name}`
    })
    await axiosInstance.patch('/products', state.form)
    await axiosInstance.post('/products/upload', body)
    await router.push('/products')
  } catch (e) {
    console.error(e)
  }
}
init()
</script>

<template>
  <AuthenticatedLayout>
    <div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        <h2 class="text-base font-semibold leading-7 text-gray-900">Produits</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">Ajouter un produit</p>
      </div>
      <FormKit
        type="form"
        id="registration-example"
        @submit="createProduct"
        enctype="multipart/form-data"
        :action="false"
        :classes="{
          form: 'bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2',
          actions: 'hidden'
        }"
      >
        <div class="px-4 py-6 sm:p-8">
          <div class="flex flex-col space-y-4">
            <div class="w-full">
              <FormKit
                v-model="state.form.name"
                type="text"
                name="name"
                label="Nom du produit"
                placeholder="Air force 1"
                :classes="{
                  label: 'block text-sm font-medium leading-6 text-gray-900',
                  input:
                    'block w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
            </div>
            <div class="flex space-x-3">
              <FormKit
                v-model="state.form.price"
                type="number"
                step="0.01"
                name="price"
                label="Prix du produit"
                placeholder="109.99"
                :classes="{
                  label: 'flex flex-1 w-full text-sm font-medium leading-6 text-gray-900',
                  input:
                    'flex flex-1 w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
              <FormKit
                v-model="state.form.vat"
                type="number"
                name="vat"
                label="TVA"
                placeholder="10"
                :classes="{
                  label: 'block text-sm font-medium leading-6 text-gray-900',
                  input:
                    'block w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
              <FormKit
                v-model="state.form.size"
                type="number"
                name="size"
                label="Taille du produit"
                placeholder="43"
                :classes="{
                  label: 'block text-sm font-medium leading-6 text-gray-900',
                  input:
                    'block w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
            </div>
            <div class="flex space-x-3">
              <FormKit
                v-model="state.form.quantity"
                type="number"
                name="quantity"
                label="Quantité du produit"
                placeholder="100"
                :classes="{
                  label: 'flex flex-1 w-full text-sm font-medium leading-6 text-gray-900',
                  input:
                    'flex flex-1 w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
              <FormKit
                v-model="state.form.sku"
                type="text"
                name="sku"
                label="SKU du produit"
                placeholder="4225-776-3234"
                :classes="{
                  label: 'block text-sm font-medium leading-6 text-gray-900',
                  input:
                    'block w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
              <FormKit
                v-model="state.form.discount"
                type="text"
                name="discount"
                label="Promotion pour produit"
                placeholder="10"
                :classes="{
                  label: 'block text-sm font-medium leading-6 text-gray-900',
                  input:
                    'block w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
            </div>
            <div class="flex flex-1 w-full space-x-3">
              <FormKit
                v-model="state.form.color"
                type="select"
                name="color"
                label="Couleur du produit"
                :options="{
                  red: 'Rouge',
                  blue: 'Bleu',
                  green: 'Vert',
                  yellow: 'Jaune',
                  black: 'Noir',
                  white: 'Blanc'
                }"
                :classes="{
                  label: 'block text-sm font-medium leading-6 text-gray-900',
                  input:
                    'block w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
              <FormKit
                v-model="state.form.model"
                type="select"
                name="modelId"
                label="Model du produit"
                :options="state.models"
                :classes="{
                  label: 'block text-sm font-medium leading-6 text-gray-900',
                  input:
                    'block w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
            </div>
            <div class="w-full">
              <FormKit
                v-model="state.images"
                type="file"
                name="images"
                label="Images du produit"
                accept=".img, .png, .jpg, .jpeg, .svg, .webp"
                multiple
                :classes="{
                  label: 'block text-sm font-medium leading-6 text-gray-900',
                  input:
                    'block w-full mt-1 pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                }"
              />
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
        >
          <button type="button" class="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </FormKit>
    </div>
  </AuthenticatedLayout>
</template>
