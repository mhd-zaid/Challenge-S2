<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axios from "axios";
import { ref,onMounted,onUnmounted } from 'vue';

const products = ref([]);
const keys = ref([]);
const abortController = new AbortController
const getProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/products')
    const data = response.data;
    const keys = ["name","price","quantity"];

    return { keys,data};
  } catch (e: any) {
    throw e;
  }
}

onMounted(() => {
    getProducts().then((res) => {
        products.value = res.data;
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
          <h1 class="text-base font-semibold leading-6 text-gray-900">Products</h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all the products.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <RouterLink :to="{name : 'create-product'}" class="font-semibold text-indigo-600 hover:text-indigo-500">
            <button
                type="button"
                class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Add product
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
                <tr  v-if="products.length !== 0">
                  <td v-for="product in products" class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900">{{ product.name }}</div>
                  </td>
                  <td v-for="product in products" class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900">{{ product.price }}</div>
                  </td>
                  <td v-for="product in products" class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900">{{ product.quantity }}</div>
                  </td>
                  <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <a href="#" class="text-indigo-600 hover:text-indigo-900"
                      >View</a
                    >
                  </td>
                  <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <a href="#" class="text-indigo-600 hover:text-indigo-900"
                      >Edit</a
                    >
                  </td>
                  <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <a href="#" class="text-indigo-600 hover:text-indigo-900"
                      >Delete</a
                    >
                  </td>
                </tr>

               <div v-else>
                    No data available, please add a product.
               </div>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
