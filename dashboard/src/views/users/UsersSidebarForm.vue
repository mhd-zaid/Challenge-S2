<script setup lang="ts">
import axiosInstance from '@/utils/axiosInstance'
import { reactive, watch } from 'vue'
import ODrawer from '@/components/ODrawer.vue'
import { userSchema } from '@/utils/validations/userSchema'
import type { UserType } from '@/types/UserType';

const props = defineProps({
  open: {
    required: true,
    type: Boolean,
    default: false
  },
  id: {
    required: false,
    type: String
  }
})

const emit = defineEmits(['closeCreationDrawer', 'closeUpdatingDrawer'])

const state = reactive({
  user: {
    role: 'ROLE_USER'
  } as UserType,
  errors: ''
})

const validateAndSubmit = async (isCreation: boolean) => {
  const userToSubmit: any = { ...state.user }
  if (!userToSubmit.password) {
    delete userToSubmit.password
  }
  const schema = userSchema.pick({ ...userToSubmit })

  const result = schema.safeParse(userToSubmit)

  if (!result.success) {
    state.errors = JSON.parse(result.error.message)[0].message
    return
  }

  try {
    if (isCreation) {
      const emailCheckResponse = await axiosInstance.get(
        `/auth/check-email?email=${userToSubmit.email}`
      )
      if (emailCheckResponse.data.message === 'Email already taken') {
        state.errors = 'Un compte est déjà associé à cet email'
        return
      }
      await axiosInstance.post('/users', userToSubmit).then(() => {
        state.errors = ''
        emit('closeCreationDrawer')
      })
    } else {
      await axiosInstance
        .patch(`/users/${props.id}`, userToSubmit)
        .then(() => {
          state.errors = ''
          emit('closeUpdatingDrawer')
        })
        .catch((error: any) => {
          console.log(error)
          if (error.response.data.message === 'Email already taken') {
            state.errors = 'Un compte est déjà associé à cet email'
          }
        })
    }
  } catch (error: any) {
    state.errors = error.response.data.message
  }
}

const formatDateForInput = (dateString: string) => {
  if (dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return ''
}

watch(
  () => props.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      try {
        const response = await axiosInstance.get(`/users/${newId}`)
        state.user = { ...response.data }
        state.user.birthdate = formatDateForInput(state.user.birthdate)
      } catch (e: any) {
        throw e
      }
    }
  }
)
</script>

<template>
  <ODrawer
    :open="props.open"
    @closeDrawer="!props.id ? emit('closeCreationDrawer') : emit('closeUpdatingDrawer')"
    :title="!props.id ? 'Ajout d\'un nouvel utilisateur' : `Modifier l'utilisateur`"
  >
    <div>
      <div class="my-5">
        <small v-if="state.errors && state.errors.length" class="text-red-600">{{
          state.errors
        }}</small>
      </div>
      <form
        method="POST"
        class="space-y-6"
        @submit.prevent="!props.id ? validateAndSubmit(true) : validateAndSubmit(false)"
      >
        <div>
          <label for="firstname" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Prénom' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.firstname"
            type="text"
            id="firstname"
            name="firstname"
            placeholder="Prénom"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="lastname" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Nom' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.lastname"
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Nom"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Adresse e-mail' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.email"
            type="email"
            id="email"
            name="email"
            placeholder="Adresse e-mail"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Mot de passe' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.password"
            type="password"
            id="password"
            name="password"
            placeholder="Mot de passe"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="birthdate" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Date de naissance' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.birthdate"
            type="date"
            id="birthdate"
            name="birthdate"
            class="block w-full px-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div>
          <label for="role" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Rôle' + (!props.id ? '*' : '')
          }}</label>
          <select
            v-model="state.user.role"
            id="role"
            name="role"
            class="block w-full px-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          >
            <option value="ROLE_ADMIN">Administrateur</option>
            <option value="ROLE_STORE_KEEPER">Responsable de magasin</option>
            <option value="ROLE_USER" selected>Utilisateur</option>
          </select>
        </div>
        <div v-if="props.id">
          <label
            for="passwordResetToken"
            class="block text-sm font-medium leading-6 text-gray-900"
            >{{ 'Token de réinitialisation du mot de passe' + (!props.id ? '*' : '') }}</label
          >
          <input
            v-model="state.user.passwordResetToken"
            type="text"
            id="passwordResetToken"
            name="passwordResetToken"
            placeholder="Token de réinitialisation du mot de passe"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div v-if="props.id">
          <label for="address" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Adresse' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.address"
            type="text"
            id="address"
            name="address"
            placeholder="Adresse"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div v-if="props.id">
          <label for="city" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Ville' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.city"
            type="text"
            id="city"
            name="city"
            placeholder="Ville"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div v-if="props.id">
          <label for="postalCode" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Code postal' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.postalCode"
            type="text"
            id="postalCode"
            name="postalCode"
            placeholder="Code postal"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            pattern="[0-9]{5}"
            :required="!props.id"
          />
        </div>
        <div v-if="props.id">
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Téléphone' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.phone"
            type="text"
            id="phone"
            name="phone"
            placeholder="Téléphone"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm sm:leading-6"
            pattern="[0-9]{10}"
            :required="!props.id"
          />
        </div>
        <div v-if="props.id">
          <label for="loginAttempts" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Nombre de tentatives de connexion' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.loginAttempts"
            type="number"
            id="loginAttempts"
            name="loginAttempts"
            placeholder="Nombre de tentatives de connexion"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <div v-if="props.id">
          <label
            for="authentificationToken"
            class="block text-sm font-medium leading-6 text-gray-900"
            >{{ "Token d'authentification" + (!props.id ? '*' : '') }}</label
          >
          <input
            v-model="state.user.authentificationToken"
            type="text"
            id="authentificationToken"
            name="authentificationToken"
            placeholder="Token d'authentification"
            class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm sm:leading-6"
            :required="!props.id"
          />
        </div>
        <!-- <div v-if="props.id">
          <label for="disabled" class="block text-sm font-medium leading-6 text-gray-900">{{
            'Compte désactivé' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.disabled"
            type="checkbox"
            id="disabled"
            name="disabled"
            class="block pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm sm:leading-6"
          />
        </div> -->
        <div v-if="props.id">
          <label for="isValidate" class="block text-sm font-medium leading-6 text-gray-900">{{
            'E-mail confirmé' + (!props.id ? '*' : '')
          }}</label>
          <input
            v-model="state.user.isValidate"
            type="checkbox"
            id="isValidate"
            name="isValidate"
            class="block pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm sm:leading-6"
          />
        </div>
        <div v-if="!props.id">
          <small>* Champs obligatoires</small>
        </div>
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {{ !props.id ? 'Créer' : 'Modifier' }}
          </button>
        </div>
      </form>
    </div>
  </ODrawer>
</template>