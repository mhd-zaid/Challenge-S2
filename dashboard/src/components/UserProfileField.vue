<script setup lang="ts">
import { ref } from 'vue'
import axiosInstance from '@/utils/axiosInstance'

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isEditing = ref(false)
const newValue = ref(props.modelValue)

const toggleEditing = () => {
  if (isEditing.value) {
    axiosInstance.put('/users/' + props.userId, {
      [props.model.name]: newValue.value
    })
    isEditing.value = false
  } else {
    isEditing.value = true
  }
}

const updateValue = (event: any) => {
  newValue.value = event.target.value
  emit('update:modelValue', newValue.value)
}
</script>
<template>
  <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
    <dt class="text-sm font-medium text-gray-500">{{ props.model.label }}</dt>
    <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      <span v-if="!isEditing" class="flex-grow">{{ props.modelValue }}</span>
      <input
        v-else
        type="text"
        class="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        :value="props.modelValue"
        @input="updateValue($event)"
      />
      <span class="ml-4 flex-shrink-0">
        <button
          type="button"
          class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          @click="toggleEditing"
        >
          {{ isEditing ? 'Enregistrer' : props.modelValue ? 'Modifier' : 'Ajouter' }}
        </button>
      </span>
    </dd>
  </div>
</template>
