<script lang="ts" setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import { reactive } from 'vue'
import type { BrandType } from '@/types/BrandType'
import { useRouter } from 'vue-router'
import EntityDetailsTableVue from '@/components/EntityDetailsTable.vue'

const router = useRouter()

const id = router.currentRoute.value.params.id

const state = reactive({
  brand: {} as BrandType
})

const getBrand = async () => {
  try {
    const response = await axiosInstance.get(`/brands/${id}`)
    state.brand = response.data
  } catch (error) {
    console.log(error)
  }
}

getBrand()
</script>
<template>
    <EntityDetailsTableVue :data="state.brand" entityType="brand" />
</template>
