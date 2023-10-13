<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import { Bar } from 'vue-chartjs'
import DashIncreaseBlock from '@/components/dashboard/DashIncreaseBlock.vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { reactive } from 'vue'
import {ArchiveBoxIcon, ShoppingBagIcon, UserPlusIcon} from "@heroicons/vue/24/outline";

const state = reactive({
  newUsersLast30Days: 0,
  newUsersAugmentation: 0,
  chartData: {
    labels: [],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        label: 'Nouvelles inscriptions',
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 4,
        hoverBackgroundColor: '#4F46E5'
      }
    ]
  },
  chartOptions: {
    responsive: true
  }
})

let usersPerMonthKey = 0

const getData = async () => {
  try {
    // Users data
    const newUsersLastYear: any = await axiosInstance.get('/stats/registrations/last-year')
    state.chartData.labels = newUsersLastYear.data.months
    state.chartData.datasets[0].data = newUsersLastYear.data.newUsers

    const newUsersLast30Days: any = await axiosInstance.get('/stats/registrations/last-30-days')
    state.newUsersLast30Days = newUsersLast30Days.data

    const newUsersBeforeLast30Days: any = await axiosInstance.get(
      '/stats/registrations/before-last-30-days'
    )
    state.newUsersAugmentation = newUsersLast30Days.data - newUsersBeforeLast30Days.data

    usersPerMonthKey++
  } catch (error) {
    console.log(error)
  }
}

getData()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
</script>

<template>
  <AuthenticatedLayout>
    <div>
      <h3 class="text-base font-semibold leading-6 text-gray-900">30 Derniers Jours</h3>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashIncreaseBlock
          :icon="UserPlusIcon"
          :kind="'users'"
          label="Nouvelles inscriptions"
          :data="state.newUsersLast30Days"
          :increase="state.newUsersAugmentation"
        />
        <DashIncreaseBlock :icon="ShoppingBagIcon" :kind="'orders'" label="Nouvelles commandes" :data="1973" :increase="176" />
        <DashIncreaseBlock :icon="ArchiveBoxIcon" :kind="'products'" label="Nouveaux produits" :data="212" :increase="32" />
      </dl>
    </div>
    <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <dl>
        <div
          class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
        >
          <Bar
            id="my-chart-id"
            :key="usersPerMonthKey"
            :options="state.chartOptions"
            :data="state.chartData"
          />
        </div>
      </dl>
    </div>
  </AuthenticatedLayout>
</template>
