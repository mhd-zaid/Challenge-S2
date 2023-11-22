<script lang="ts" setup>
import axiosInstance from '@/utils/axiosInstance'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { UserType } from '@/types/UserType'
import EntityDetailsTable from '@/components/EntityDetailsTable.vue'

const route = useRouter()

const state = reactive({
  user: {} as UserType
})

const userId = route.currentRoute.value.params.id

const getUser = async () => {
  try {
    await axiosInstance.get(`/users/${userId}`).then((res) => {
      state.user = res.data
    })
  } catch (e: any) {
    throw e
  }
}

onMounted(() => {
  getUser()
})
</script>

<template>
  <EntityDetailsTable :data="state.user" entityType="user" />
</template>
