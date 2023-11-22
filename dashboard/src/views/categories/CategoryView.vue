<script lang="ts" setup>
import axiosInstance from '@/utils/axiosInstance'
import { reactive } from 'vue'
import type { CategoryType } from '@/types/CategoryTypes'
import EntityDetailsTable from '@/components/EntityDetailsTable.vue'

const id = window.location.pathname.split('/')[2]
const state = reactive({
  category: {} as CategoryType
})

const getCategory = async () => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`)
    state.category = response.data
  } catch (error) {
    console.log(error)
  }
}

getCategory()
</script>
<template>
  <EntityDetailsTable :data="state.category" entityType="category" />
</template>
