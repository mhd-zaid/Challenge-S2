<script setup lang="ts">
import {defineComponent} from 'vue'
import {ArrowUpIcon, ArrowDownIcon} from '@heroicons/vue/24/outline'

defineComponent({
  name: 'MiniStatisticsCards'
})
const props = defineProps({
  icon: {
    required: true
  },
  label: {
    type: String,
    required: true
  },
  data: {
    type: Number,
    required: true
  },
  increase: {
    type: Number,
    required: true
  }
})

const bgColor = () => {
  if (props.label.includes('produits')) {
    return 'bg-[#00ADB5]'
  } else if (props.label.includes('commandes')) {
    return 'bg-[#457B9D]'
  } else {
    return 'bg-[#FF7A5C]'
  }
}

const routeTo = () => {
  if (props.label.includes('produits')) {
    return '/products'
  } else if (props.label.includes('commandes')) {
    return '/orders'
  } else {
    return '/users'
  }
}
</script>

<template>
  <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
    <dt>
      <div :class="['absolute rounded-md p-3', bgColor()]">
        <component :is="props.icon" class="h-6 w-6 text-white"/>
      </div>
      <p class="ml-16 truncate text-sm font-medium text-gray-500">{{ props.label }}</p>
    </dt>
    <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
      <p class="text-2xl font-semibold text-gray-900">{{ props.data }}</p>
      <p
          v-if="props.increase >= 0"
          class="ml-2 flex items-baseline text-sm font-semibold text-green-600"
      >
        <!-- Heroicon name: solid/arrow-sm-up -->
        <ArrowUpIcon class="h-5 w-5 flex-shrink-0 self-center text-green-500"/>
        <span class="sr-only"> Augmenté de </span>
        {{ props.increase }}
      </p>
      <p v-else class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
        <ArrowDownIcon class="h-5 w-5 flex-shrink-0 self-center text-red-500"/>
        <span class="sr-only"> Diminué de </span>
        {{ Math.abs(props.increase) }}
      </p>
      <div class="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
        <div class="text-sm">
          <a :href="routeTo()" class="font-medium text-gray-900 hover:text-gray-700"
          >Voir plus<span class="sr-only"> Total Subscribers stats</span></a
          >
        </div>
      </div>
    </dd>
  </div>
</template>
