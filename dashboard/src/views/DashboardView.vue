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
  newOrdersLast30Days: 0,
  newOrdersAugmentation: 0,
  userChartData: {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Nouvelles inscriptions',
        backgroundColor: '#FF7A5C',
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 4,
        hoverBackgroundColor: '#FF7A5C'
      }
    ]
  },
  productChartData: {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Nouveaux produits',
        backgroundColor: '#00ADB5',
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 4,
        hoverBackgroundColor: '#00ADB5'
      }
    ]
  },
  orderChartData: {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Nouvelles commandes',
        backgroundColor: '#457B9D',
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 4,
        hoverBackgroundColor: '#457B9D'
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
      newOrdersLast30Days,
      newOrdersBeforeLast30Days,
      months,
      newUsersLastYear,
      newProductsLastYear,
      newOrdersLastYear
    ] = await Promise.all([
      axiosInstance.get('/stats/registrations/last-30-days'),
      axiosInstance.get('/stats/registrations/before-last-30-days'),
      axiosInstance.get('/stats/products/last-30-days'),
      axiosInstance.get('/stats/products/before-last-30-days'),
      axiosInstance.get('/stats/orders/last-30-days'),
      axiosInstance.get('/stats/orders/before-last-30-days'),
      axiosInstance.get('/stats/months'),
      axiosInstance.get('/stats/registrations/last-year'),
      axiosInstance.get('/stats/products/last-year'),
      axiosInstance.get('/stats/orders/last-year')
    ])

    state.newUsersLast30Days = newUsersLast30Days.data
    state.newUsersAugmentation = newUsersLast30Days.data - newUsersBeforeLast30Days.data
    state.newProductsLast30Days = newProductsLast30Days.data
    state.newProductsAugmentation = newProductsLast30Days.data - newProductsBeforeLast30Days.data
    state.newOrdersLast30Days = newOrdersLast30Days.data
    state.newOrdersAugmentation = newOrdersLast30Days.data - newOrdersBeforeLast30Days.data
    state.userChartData.labels = months.data
    state.orderChartData.labels = months.data
    state.productChartData.labels = months.data
    state.userChartData.datasets[0].data = newUsersLastYear.data
    state.productChartData.datasets[0].data = newProductsLastYear.data
    state.orderChartData.datasets[0].data = newOrdersLastYear.data
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
    <div px-4>
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
