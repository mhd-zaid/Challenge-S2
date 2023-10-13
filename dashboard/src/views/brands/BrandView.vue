<script lang="ts" setup>
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import axiosInstance from "@/utils/axiosInstance";
import { reactive } from "vue";

const id = window.location.pathname.split("/")[2];
const state = reactive({
brand: null
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
  </AuthenticatedLayout>
</template>
