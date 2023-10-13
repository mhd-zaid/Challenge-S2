<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import axios from 'axios'
import { reactive, ref } from 'vue'

const product = async () => {
  try {
    const response = await axiosInstance.get(`/products/${id}`,state.form)
    state.form = response.data
    state.form.models = response.data.models[0].id
  } catch (e: any) {
    throw e
  }
}

const state = reactive({
  form: {
    name: '',
    price: '',
    quantity: '',
    vat: '',
    size: '',
    color: '',
    url: '',
    models: [] as any
  },
  errors: {},
  models: [] as any,
  image: [] as any,
  currentFile: '',
})

const init = async () => {
  try {
    const response = await axiosInstance.get('/models')
    state.models = response.data
  } catch (e: any) {
    throw e
  }
}
const id = window.location.pathname.split('/').length > 3 ? window.location.pathname.split('/')[2] : null
let submit = null

if (!id) {
  submit = async () => {
    try {
      state.form.models = [{
        id: state.form.models
      }]

      const body = new FormData()
      state.image.forEach((fileItem) => {
        body.append('image', fileItem.file)
        state.form.url = `/images/${fileItem.file.name}`
      })

      await axiosInstance.post('/products', state.form)
      await axiosInstance.post('/products/upload', body)
      window.location.href = '/products'
    } catch (e: any) {
      console.log(e);
      state.errors = e.response.data.errors
    }
  }
}else{
  product()
  submit = async () => {
    try {
      state.form.models = [{
        id: state.form.models
      }]
      if(state.form.url == ''){
        
      }
      const body = new FormData()
      state.image.forEach((fileItem) => {
        body.append('image', fileItem.file)
        state.form.url = `/images/${fileItem.file.name}`
      })

      await axiosInstance.put(`/products/${id}`, state.form)
      await axiosInstance.post('/products/upload', body)
      window.location.href = '/products'
    } catch (e: any) {
      state.errors = e.response.data.errors
    }
  }
}

init()
</script>

<template>
  <AuthenticatedLayout>
    <h3 v-if="!id">Create product</h3>
    <h3 v-else>Edit product {{ id }}</h3>
    <div>
      <form method="POST" class="space-y-6" @submit.prevent="submit" enctype="multipart/form-data">
        <div>
          <FormKit
            v-model="state.form.name"
            type="text"
            label="name"
            validation="required|name"
            placeholder="name"
            :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          />
        </div>

        <div>
          <FormKit
            v-model="state.form.price"
            type="number"
            label="price"
            validation="required|price"
            placeholder="0"
            :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          />
        </div>

        <div>
          <FormKit
            v-model="state.form.vat"
            type="number"
            number="float"
            label="vat"
            validation="required|vat"
            placeholder="0"
            :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          />
        </div>

        <div>
          <FormKit
            v-model="state.form.quantity"
            type="number"
            label="quantity"
            validation="required|quantity"
            placeholder="0"
            :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          />
        </div>

        <div>
          <FormKit
            v-model="state.form.size"
            type="text"
            label="size"
            validation="required|size"
            placeholder="size"
            :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          />
        </div>

        <div>
          <FormKit
            v-model="state.form.color"
            type="text"
            label="color"
            validation="required|color"
            placeholder="color"
            :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          />
        </div>

        <div>
          <FormKit
            v-model="state.form.models"
            type="select"
            label="models"
            validation="required|model"
            placeholder="model"
            :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
          >
            <option v-for="model in state.models" :value="model.id" v-if="state.form.models" selected>{{ model.name }}</option>
            <option v-for="model in state.models" :value="model.id" v-else>{{ model.name }}</option>

          </FormKit>

        </div>

        <div>
          <div v-if="state.form.url">
            <img :src="'/src/uploads'+state.form.url"  alt="" />
            <button >Supprimer l'image</button>
          </div>
          <FormKit
            v-else
            v-model="state.image"
            type="file"
            label="image"
            accept=".img,.png,.jpg,.jpeg"
            help="Select a image"
          />
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            v-if="!id"
          >
            Create
          </button>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            v-else
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>
