<script lang="ts" setup>
import axiosInstance from '@/utils/axiosInstance'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { ProductType } from '@/types/ProductType'
import EntityDetailsTable from '@/components/EntityDetailsTable.vue'

const router = useRouter()

const state = reactive({
  product: {} as ProductType
})

const productId = router.currentRoute.value.params.id

const getProduct = async () => {
  try {
    await axiosInstance.get(`/products/${productId}`).then((res) => {
      state.product = res.data
    })
  } catch (e: any) {
    throw e
  }
}

onMounted(() => {
  getProduct()
})
</script>
<template>
  <EntityDetailsTable :data="state.product" entityType="product" />
</template>
