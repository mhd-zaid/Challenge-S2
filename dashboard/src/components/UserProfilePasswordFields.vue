<script setup lang="ts">
import {ref} from 'vue'
import axiosInstance from '@/utils/axiosInstance'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const isEditing = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')

const toggleEditing = () => {
  if (isEditing.value) {
    if (newPassword.value !== confirmPassword.value) {
      passwordError.value = 'Les mots de passe ne correspondent pas.'
      return
    }
    axiosInstance
        .put('/users/' + props.userId + '/password', {
          oldPassword: oldPassword.value,
          newPassword: newPassword.value
        })
        .then((res) => {
          console.log(res)
          isEditing.value = false
          // TODO: Add notification
        })
        .catch((error) => {
          console.error(error)
          if (
              JSON.stringify(error.response.data).includes('Old password or new password is missing')
          ) {
            passwordError.value = "L'ancien mot de passe ou le nouveau mot de passe est manquant."
          } else if (JSON.stringify(error.response.data).includes('Invalid password')) {
            passwordError.value = "L'ancien mot de passe ne correspond pas."
          } else if (JSON.stringify(error.response.data).includes('Password must contain')) {
            passwordError.value =
                'Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
          } else passwordError.value = error.response.data
        })
  } else {
    isEditing.value = true
  }
}
</script>

<template>
  <div v-if="!isEditing" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
    <span class="flex-shrink-0">
      <button
          type="button"
          class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          @click="toggleEditing"
      >
        Modifier le mot de passe
      </button>
    </span>
  </div>
  <div v-if="isEditing">
    <small v-if="passwordError" class="text-red-500">{{ passwordError }}</small>
    <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3 sm:pt-5">
      <dt class="text-sm font-medium text-gray-500">Ancien mot de passe</dt>
      <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        <input
            type="password"
            class="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            v-model="oldPassword"
        />
      </dd>
    </div>

    <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3">
      <dt class="text-sm font-medium text-gray-500">Nouveau mot de passe</dt>
      <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        <input
            type="password"
            class="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            v-model="newPassword"
        />
      </dd>
    </div>

    <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3">
      <dt class="text-sm font-medium text-gray-500">Confirmer nouveau mot de passe</dt>
      <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        <input
            type="password"
            class="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            v-model="confirmPassword"
        />
      </dd>
    </div>

    <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-4">
      <span class="flex-shrink-0">
        <button
            type="button"
            class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            @click="toggleEditing"
        >
          Enregistrer
        </button>
      </span>
    </div>
  </div>
</template>

