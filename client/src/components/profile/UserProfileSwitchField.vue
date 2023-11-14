<script lang="ts" setup>
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { ref } from 'vue'
const trueOrFalse = ref(false)

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <SwitchGroup as="div" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
    <SwitchLabel as="dt" class="text-sm font-medium text-gray-500" passive
      >Préférences {{ id }}
    </SwitchLabel>
    <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      <Switch
        v-model="trueOrFalse"
        :class="[
          trueOrFalse ? 'bg-primary-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600/60 focus:ring-offset-2 sm:ml-auto'
        ]"
      >
        <span
          aria-hidden="true"
          :class="[
            trueOrFalse ? 'translate-x-5' : 'translate-x-0',
            'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          ]"
        />
      </Switch>
    </dd>
  </SwitchGroup>
</template>
