<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import axiosInstance from '@/utils/axiosInstance'
import { Bar } from 'vue-chartjs'
import MiniStatisticsCard from '@/components/dashboard/MiniStatisticsCard.vue'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { onBeforeMount, reactive } from 'vue'
import { ArchiveBoxIcon, ShoppingBagIcon, UserPlusIcon } from '@heroicons/vue/24/outline'

const state = reactive({
  newUsersLast30Days: 0,
  newUsersAugmentation: 0,
  newProductsLast30Days: 0,
  newProductsAugmentation: 0,
  newOrdersLast30Days: 1973,
  newOrdersAugmentation: -176,
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
  productChartData: {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Nouveaux produits',
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 4,
        hoverBackgroundColor: '#4F46E5'
      }
    ]
  },
  orderChartData: {
    labels: [],
    datasets: [
      {
        data: [576, 893, 923, 1239, 748, 689, 908, 1389, 879, 1087, 1234, 1973],
        label: 'Nouvelles commandes',
        backgroundColor: '#d97706',
        borderColor: '#d97706',
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 4,
        hoverBackgroundColor: '#b45309'
      }
    ]
  },
  chartOptions: {
    responsive: true,
    scales: {
      y: {
        suggestedMax: 10
      }
    }
  }
})

let usersPerMonthKey = 0
let ordersPerMonthKey = 0
let productsPerMonthKey = 0

onBeforeMount(async () => {
  try {
    const [
      newUsersLast30Days,
      newUsersBeforeLast30Days,
      newProductsLast30Days,
      newProductsBeforeLast30Days,
      months,
      newUsersLastYear,
      newProductsLastYear
    ] = await Promise.all([
      axiosInstance.get('/stats/registrations/last-30-days'),
      axiosInstance.get('/stats/registrations/before-last-30-days'),
      axiosInstance.get('/stats/products/last-30-days'),
      axiosInstance.get('/stats/products/before-last-30-days'),
      axiosInstance.get('/stats/months'),
      axiosInstance.get('/stats/registrations/last-year'),
      axiosInstance.get('/stats/products/last-year')
    ])

    state.newUsersLast30Days = newUsersLast30Days.data
    state.newUsersAugmentation = newUsersLast30Days.data - newUsersBeforeLast30Days.data
    state.newProductsLast30Days = newProductsLast30Days.data
    state.newProductsAugmentation = newProductsLast30Days.data - newProductsBeforeLast30Days.data
    state.userChartData.labels = months.data
    state.orderChartData.labels = months.data
    state.productChartData.labels = months.data
    state.userChartData.datasets[0].data = newUsersLastYear.data
    state.productChartData.datasets[0].data = newProductsLastYear.data
    usersPerMonthKey++
    productsPerMonthKey++
    ordersPerMonthKey++
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
          label="Nouvelles inscriptions"
          :data="state.newUsersLast30Days"
          :increase="state.newUsersAugmentation"
        />
        <MiniStatisticsCard
          :icon="ArchiveBoxIcon"
          label="Nouveaux produits"
          :data="state.newProductsLast30Days"
          :increase="state.newProductsAugmentation"
        />
        <MiniStatisticsCard
          :icon="ShoppingBagIcon"
          label="Nouvelles commandes"
          :data="state.newOrdersLast30Days"
          :increase="state.newOrdersAugmentation"
        />
        <MiniStatisticsCard
          :icon="ShoppingBagIcon"
          label="Nouvelles commandes"
          :data="1973"
          :increase="176"
        />
        <MiniStatisticsCard
          :icon="ArchiveBoxIcon"
          label="Nouveaux produits"
          :data="212"
          :increase="32"
        />
      </dl>
    </div>
    <h4 class="mt-10 text-base font-medium leading-6 text-gray-900">Dernière année</h4>
    <div class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <dl>
        <div class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6">
          <Bar
            id="my-chart-id"
            :key="usersPerMonthKey"
            :options="state.chartOptions"
            :data="state.userChartData"
          />
        </div>
      </dl>
      <dl>
        <div class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6">
          <Bar
            id="my-chart-id"
            :key="productsPerMonthKey"
            :options="state.chartOptions"
            :data="state.productChartData"
          />
        </div>
      </dl>
      <dl>
        <div class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6">
          <Bar
            id="my-chart-id"
            :key="ordersPerMonthKey"
            :options="state.chartOptions"
            :data="state.orderChartData"
          />
        </div>
      </dl>
    </div>
  </AuthenticatedLayout>
</template>
