<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance';
import axios from "axios";
import { ref,onMounted,onUnmounted } from 'vue';

const categories = ref([]);
const keys = ref([]);
const abortController = new AbortController
const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories')
    const data = response.data;
    const keys = ["name","description"];

    return { keys,data};
  } catch (e: any) {
    throw e;
  }
}

const deleteCategory = async (id: number) => {
    try {
        await axiosInstance.delete(`/categories/${id}`)
    } catch (e: any) {
        throw e;
    }
}

onMounted(() => {
  getCategories().then((res) => {
        categories.value = res.data;
        keys.value = res.keys;
    })

})

onUnmounted(() => {
  abortController.abort()
})

</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Categories</h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all the categories.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <RouterLink :to="{name : 'create-category'}" class="font-semibold text-indigo-600 hover:text-indigo-500">
            <button
                type="button"
                class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Add category
            </button>
            </RouterLink>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300" >
              <thead>
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" v-for="key in keys">
                    {{key}}
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span class="sr-only">Edit</span>
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span class="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white" >
                <tr  v-if="categories.length !== 0" v-for="category in categories">
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900">{{ category.name }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900">{{ category.description }}</div>
                  </td>
                  <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <RouterLink :to="{name : 'category', params: {id: category.id}}" class="text-indigo-600 hover:text-indigo-900"
                      >View
                    </RouterLink >
                  </td>
                  <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <RouterLink :to="{name : 'edit-category', params: {id: category.id}}" class="text-indigo-600 hover:text-indigo-900"
                      >Edit
                    </RouterLink >

                  </td>
                  <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <a href="" class="text-indigo-600 hover:text-indigo-900" @click="deleteCategory(category.id)"
                      >Delete</a
                    >
                  </td>
                </tr>

               <div v-else>
                    No data available, please add a category.
               </div>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
