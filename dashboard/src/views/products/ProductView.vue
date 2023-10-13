<script lang="ts" setup>
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import axiosInstance from "@/utils/axiosInstance";
import { reactive } from "vue";

const id = window.location.pathname.split("/")[2];
const state = reactive({
product: {
  models:[
    {}
  ]
},
})

const getProduct = async () => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    state.product = response.data
  } catch (error) {
      console.log(error)
  }
}

getProduct();

</script>
<template>
  <AuthenticatedLayout>
    <h1>Product Details</h1>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <RouterLink :to="{name : 'products'}" class="font-semibold text-indigo-600 hover:text-indigo-500">
        <button
            type="button"
            class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            return to products
        </button>
        </RouterLink>
    </div>
    <table>
      <thead>
        <tr>
          <th>Model</th>
          <th>Model Gender</th>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>VAT</th>
          <th>Size</th>
          <th>Color</th>
          <th>Image</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ state.product.models[0].name }}</td>
          <td>{{ state.product.models[0].gender }}</td>
          <td>{{ state.product.name }}</td>
          <td>{{ state.product.price }}</td>
          <td>{{ state.product.quantity }}</td>
          <td>{{ state.product.vat }}</td>
          <td>{{ state.product.size }}</td>
          <td>{{ state.product.color }}</td>
          <td v-if="state.product.url"><img :src="'/src/uploads'+ state.product.url" alt=""></td>
          <td v-else></td>
          <td>{{ state.product.createdAt }}</td>
          <td>{{ state.product.updatedAt }}</td>
        </tr>
      </tbody>
    </table>
    
  </AuthenticatedLayout>
</template>
