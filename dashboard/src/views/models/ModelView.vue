<script lang="ts" setup>
import axiosInstance from '@/utils/axiosInstance'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { ModelType } from '@/types/ModelType'
import EntityDetailsTable from '@/components/EntityDetailsTable.vue'

const router = useRouter()
const id = router.currentRoute.value.params.id

const state = reactive({
  model: {} as ModelType
})

const getModel = async () => {
  try {
    const response = await axiosInstance.get(`/models/${id}`)
    state.model = response.data
  } catch (error) {
    console.log(error)
  }
}

getModel()
</script>
<template>
  <EntityDetailsTable :data="state.model" entityType="model" />
</template>
