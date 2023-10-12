<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axios from "axios";
import { reactive,ref } from 'vue';

const models = reactive([]);
try {
  const response = await axios.get('http://localhost:3000/models')
  models.values =  response.data;

} catch (e: any) {
  throw e;
}

const state = reactive({
  form: {
    name: '',
    price: '',
    quantity: '',
    vat: '',
    size: '',
    color: '',
    models: ref([]),
  },
  errors: {},
})

const submit = async () => {
  try {
    
  } catch (e: any) {
    state.errors = e.response.data.errors
  }
}
</script>

<template>
  <AuthenticatedLayout>
    <h3>Create product</h3>
    <div>
      <form method="POST" class="space-y-6" @submit.prevent="submit">
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
            label="model"
            validation="required|models"
            placeholder="Select a model"
            :classes="{
              label: 'block text-sm font-medium leading-6 text-gray-900',
              input:
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
            :options=models
          />
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </AuthenticatedLayout>
</template>
