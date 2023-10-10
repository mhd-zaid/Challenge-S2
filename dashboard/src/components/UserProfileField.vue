<template>
  <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
    <dt class="text-sm font-medium text-gray-500">{{ model.label }}</dt>
    <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      <span v-if="!isEditing" class="flex-grow">{{ modelValue }}</span>
      <input
        v-else
        type="text"
        class="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        :value="modelValue"
        @input="updateValue($event)"
      />
      <span class="ml-4 flex-shrink-0">
        <button
          type="button"
          class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          @click="toggleEditing"
        >
          {{ isEditing ? 'Enregistrer' : modelValue ? 'Modifier' : 'Ajouter' }}
        </button>
      </span>
    </dd>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import axiosInstance from '@/utils/axiosInstance'

const { model, modelValue } = defineProps(['model', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const isEditing = ref(false)
const newValue = ref(modelValue)

const toggleEditing = () => {
  if (isEditing.value) {
    axiosInstance
      .put('/users/6523c1c4f8c1e5c62f9e1691', {
        [model.name]: newValue.value
      })
    isEditing.value = false
  } else {
    isEditing.value = true
  }
}

const updateValue = (event) => {
  newValue.value = event.target.value
  emit('update:modelValue', newValue.value)
}
</script>
