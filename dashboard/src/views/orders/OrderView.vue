<script lang="ts" setup>
import axiosInstance from '@/utils/axiosInstance'
import { onBeforeMount } from 'vue'
import { ref } from 'vue'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import EntityDetailsTable from '@/components/EntityDetailsTable.vue'

const router = useRouter()
const id = router.currentRoute.value.params.id

const state = reactive({
  order: <any>{}
})

const getOrder = async () => {
  try {
    await axiosInstance.get(`/orders/${id}`).then((res) => {
      state.order = res.data
    })
  } catch (e: any) {
    throw e
  }
}

onMounted(() => {
  getOrder()
})
</script>

<template>
  <EntityDetailsTable :data="state.order" entityType="order" />
</template>
