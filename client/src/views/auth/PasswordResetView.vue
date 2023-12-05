<script setup lang="ts">
import GuestLayout from '@/layout/GuestLayout.vue'
import {reactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import axiosInstance from '@/utils/axiosInstance'

const state = reactive({
  form: {
    email: '',
    password: ''
  },
  errors: '',
  isEmailSent: false
})

const router = useRouter()
const route = useRoute()

let updatingPassword =
  route.query.email !== undefined &&
  route.query.email !== '' &&
  route.query.token !== undefined &&
  route.query.token !== ''

const getErrorMessage = (error: any) => {
  if (error.response) {
    if (error.response.data.message === 'Email not found')
      return "Aucun compte n'est associé à cet email"
    if (error.response.data.message === 'Invalid token')
      return 'Une erreur est survenue, veuillez vérifier que vous avez cliqué sur le dernier lien reçu par email'
    if (error.response.data.message === 'Invalid password')
      return 'Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
  }
  return 'Une erreur est survenue'
}

const submit = async () => {
  try {
    if (!updatingPassword) {
      await axiosInstance.post('/auth/request-password-reset', state.form)
      state.isEmailSent = true
    } else {
      const resetPasswordData = {
        email: route.query.email,
        token: route.query.token,
        password: state.form.password
      }

      await axiosInstance.post('/auth/reset-password', resetPasswordData)
      router.push('/login?password_reset=true')
    }
  } catch (error) {
    state.errors = getErrorMessage(error)
  }
}
</script>

<template>
  <GuestLayout>
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img class="h-10 w-auto" src="images/sneakpeak_logo_black.png" alt="Sneak Peak" />
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Mot de passe oublié
          </h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Vérifie ton adresse e-mail et saisis un nouveau mot de passe.
          </p>
        </div>
        <div>
          <div v-if="state.isEmailSent" class="text-green-600 my-5">
            Un email a été envoyé à votre adresse email pour réinitialiser votre mot de passe.
          </div>
          <div class="my-5">
            <small v-if="state.errors.length && !state.isEmailSent" class="text-red-600">{{
              state.errors
            }}</small>
          </div>

          <div>
            <form method="POST" class="space-y-6" @submit.prevent="submit">
              <div v-if="!updatingPassword">
                <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
                  >Email</label
                >
                <input
                  v-model="state.form.email"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="exemple@gmail.com"
                  class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
              <div v-else>
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
                  >Nouveau mot de passe</label
                >
                <input
                  v-model="state.form.password"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Nouveau mot de passe"
                  class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>

              <div class="flex items-center justify-end">
                <div class="text-sm leading-6">
                  <a href="login" class="font-semibold text-gray-900 hover:text-gray-700"
                    >Retour à la connexion</a
                  >
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Réinitialiser le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
