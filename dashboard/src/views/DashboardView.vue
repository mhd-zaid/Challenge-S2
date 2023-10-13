<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import {Bar} from 'vue-chartjs'
import MiniStatisticsCard from '@/components/dashboard/MiniStatisticsCard.vue'
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {onBeforeMount, reactive} from 'vue'
import {ArchiveBoxIcon, ShoppingBagIcon, UserPlusIcon} from "@heroicons/vue/24/outline";

const state = reactive({
  newUsersLast30Days: 0,
  newUsersAugmentation: 0,
  userChartData: {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Nouvelles inscriptions',
        backgroundColor: '#374151',
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 4,
        hoverBackgroundColor: '#1F2937'
      }
    ]
  },
  orderChartData: {
    labels: [],
    datasets: [
      {
        data: [576, 893, 923, 1239, 748, 689, 908, 1389, 879, 1087, 1234, 1973],
        label: 'Nouvelles commandes',
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
    responsive: true,
    scales: {
      y: {
        suggestedMax: 10,
      }
    },
  }
})

let usersPerMonthKey = 0
let orderPerMonthKey = 0
onBeforeMount(async () => {
  try {
    // Users data
    const newUsersLastYear: any = await axiosInstance.get('/stats/registrations/last-year')
    state.userChartData.labels = newUsersLastYear.data.months
    state.userChartData.datasets[0].data = newUsersLastYear.data.newUsers
    state.chartOptions.scales.y.suggestedMax = Math.max(...newUsersLastYear.data.newUsers) + 3

    const newUsersLast30Days: any = await axiosInstance.get('/stats/registrations/last-30-days')
    state.newUsersLast30Days = newUsersLast30Days.data

    const newUsersBeforeLast30Days: any = await axiosInstance.get(
        '/stats/registrations/before-last-30-days'
    )
    state.newUsersAugmentation = newUsersLast30Days.data - newUsersBeforeLast30Days.data

    // Orders data
    state.orderChartData.labels = newUsersLastYear.data.months

    usersPerMonthKey++
    orderPerMonthKey++
  } catch (error) {
    console.log(error)
  }
})

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
</script>

<template>
  <AuthenticatedLayout>
    <div>
      <h1 class="text-lg leading-6 font-semibold text-gray-900">Tableau de bord</h1>
      <h4 class="mt-8 text-base font-medium leading-6 text-gray-900">30 derniers jours</h4>
      <dl class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MiniStatisticsCard
            :icon="UserPlusIcon"
            :kind="'users'"
            label="Nouvelles inscriptions"
            :data="state.newUsersLast30Days"
            :increase="state.newUsersAugmentation"
        />
        <MiniStatisticsCard :icon="ShoppingBagIcon" :kind="'orders'" label="Nouvelles commandes" :data="1973"
                            :increase="176"/>
        <MiniStatisticsCard :icon="ArchiveBoxIcon" :kind="'products'" label="Nouveaux produits" :data="212"
                            :increase="32"/>
      </dl>
    </div>
    <h4 class="mt-10 text-base font-medium leading-6 text-gray-900">Dernière année</h4>
    <div class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <dl>
        <div
            class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6"
        >
          <Bar
              id="my-chart-id"
              :key="usersPerMonthKey"
              :options="state.chartOptions"
              :data="state.userChartData"
          />
        </div>
      </dl>
      <dl>
        <div
          class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6"
        >
          <Bar
            id="my-chart-id"
            :key="orderPerMonthKey"
            :options="state.chartOptions"
            :data="state.orderChartData"
          />
        </div>
      </dl>
    </div>
  </AuthenticatedLayout>
</template>
