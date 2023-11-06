<script lang="ts" setup>
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import axiosInstance from "@/utils/axiosInstance";
import { reactive } from "vue";
import {useRouter} from "vue-router";
const router = useRouter();
const id = router.currentRoute.value.params.id;
const state = reactive({
model: {
  Category: {
  },
  Brand: {
  },
},
})

const getModel = async () => {
  try {
    const response = await axiosInstance.get(`/models/${id}`);
    state.model = response.data
  } catch (error) {
      console.log(error)
  }
}

getModel();

</script>
<template>
  <AuthenticatedLayout>
    <h1>Model Details</h1>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <RouterLink :to="{name : 'models'}" class="font-semibold text-gray-900 hover:text-gray-700">
        <button
            type="button"
            class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            return to models
        </button>
        </RouterLink>
    </div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Gender</th>
          <th>Description</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ state.model.name }}</td>
          <td>{{ state.model.gender }}</td>
          <td>{{ state.model.description }}</td>
          <td>{{ state.model.Category.name }}</td>
          <td>{{ state.model.Brand.name }}</td>
          <td>{{ state.model.createdAt }}</td>
          <td>{{ state.model.updatedAt }}</td>
        </tr>
      </tbody>
    </table>

    <h3>All Products Of {{state.model.name}}</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Size</th>
          <th>Color</th>
        </tr>
      </thead>
      <tbody
        v-for="product in state.model.products"
        :key="product.id"
      >
        <tr>
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.quantity }}</td>
          <td>{{ product.size }}</td>
          <td>{{ product.color }}</td>
        </tr>
      </tbody>
    </table>

  </AuthenticatedLayout>
</template>
