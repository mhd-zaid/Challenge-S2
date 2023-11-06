<script lang="ts" setup>
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import axiosInstance from "@/utils/axiosInstance";
import { reactive } from "vue";

const id = window.location.pathname.split("/")[2];
const state = reactive({
brand: {},
})

const getBrand = async () => {
  try {
    const response = await axiosInstance.get(`/brands/${id}`);
    state.brand = response.data
  } catch (error) {
      console.log(error)
  }
}

getBrand();

</script>
<template>
  <AuthenticatedLayout>
    <h1>Brand Details</h1>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <RouterLink :to="{name : 'brands'}" class="font-semibold text-gray-900 hover:text-gray-700">
        <button
            type="button"
            class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            return to brands
        </button>
        </RouterLink>
    </div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ state.brand.name }}</td>
          <td>{{ state.brand.createdAt }}</td>
          <td>{{ state.brand.updatedAt }}</td>
        </tr>
      </tbody>
    </table>

    <h3>All Models Of {{state.brand.name}}</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody
        v-for="model in state.brand.models"
        :key="model.id"
      >
        <tr>
          <td>{{ model.name }}</td>
          <td>{{ model.gender }}</td>
        </tr>
      </tbody>
    </table>
  </AuthenticatedLayout>
</template>
