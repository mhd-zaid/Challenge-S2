<script lang="ts" setup>
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import axiosInstance from "@/utils/axiosInstance";
import { reactive } from "vue";
import type {CategoryType} from "@/types/CategoryTypes";

const id = window.location.pathname.split("/")[2];
const state = reactive({
category: {} as CategoryType,
})

const getCategory = async () => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    state.category = response.data
  } catch (error) {
      console.log(error)
  }
}

getCategory();

</script>
<template>
  <AuthenticatedLayout>
    <h1>Category Details</h1>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <RouterLink :to="{name : 'categories'}" class="font-semibold text-gray-900 hover:text-gray-700">
        <button
            type="button"
            class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            return to categories
        </button>
        </RouterLink>
    </div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ state.category.name }}</td>
          <td>{{ state.category.description }}</td>
          <td>{{ state.category.createdAt }}</td>
          <td>{{ state.category.updatedAt }}</td>
        </tr>
      </tbody>
    </table>

    <h3>All Models Of {{state.category.name}}</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody
        v-for="model in state.category.models"
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
