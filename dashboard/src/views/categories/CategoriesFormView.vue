<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios'
import { reactive, ref } from 'vue'

const state = reactive({
  form: {
    name: '',
    description: '',
  },
  errors: {},
})

const submit = async () => {
  try {
    await axiosInstance.post('/categories', state.form)
    window.location.href = '/categories';
  } catch (e: any) {
    state.errors = e.response.data.errors
  }
}
</script>

<template>
  <AuthenticatedLayout>
    <h3>Create category</h3>
    <div>
      <form method="POST" class="space-y-6" @submit.prevent="submit">
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
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
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
                'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            }"
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
