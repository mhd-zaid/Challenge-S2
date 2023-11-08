<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/utils/axiosInstance'

const userStore = useUserStore()
const state = reactive({
  form: {
    email: '',
    password: ''
  },
  errors: ''
})
const router = useRouter()
const route = useRoute()

const isRegistered = route.query.registered === 'true'
const isConfirmed = route.query.email_confirmed === 'true'
const isPasswordReset = route.query.password_reset === 'true'

const getErrorMessage = (error: any) => {
  if (error.response) {
    if (error.response.status === 401) {
      if (!error.response.data.message) return 'Email ou mot de passe incorrect'
      if (error.response.data.message === 'User is temporarily blocked')
        return 'Votre compte a été bloqué temporairement'
      if (error.response.data.message === 'Email not confirmed')
        return 'Veuillez confirmer votre adresse e-mail'
    }
  }
  return 'Une erreur est survenue'
}

const submit = async () => {
  try {
    const response = await axiosInstance.post('/auth/login', state.form)
    const res = response.data

    userStore.setUser(res)
    userStore.setToken(res.token)
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res))
    router.push('/')
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
          <img class="h-10 w-auto" src="assets/images/sneakpeak_logo_black.png" alt="Sneak Peak" />
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Connectez-vous à votre compte
          </h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Vous n'êtes pas encore inscrit ?
            {{ ' ' }}
            <RouterLink
              to="register"
              class="font-semibold text-secondary hover:text-secondary-light"
              >Inscrivez-vous ici</RouterLink
            >
          </p>
        </div>
        <div>
          <div v-if="isRegistered && !state.errors.length" class="text-green-600 my-5">
            Vous avez bien été inscrit. Veuillez confirmer votre email puis vous connecter.
          </div>
          <div v-if="isConfirmed && !state.errors.length" class="text-green-600 my-5">
            Votre email a bien été confirmé. Veuillez vous connecter.
          </div>
          <div v-if="isPasswordReset && !state.errors.length" class="text-green-600 my-5">
            Votre mot de passe a bien été modifié. Veuillez vous connecter.
          </div>
          <div class="my-5">
            <small v-if="state.errors.length" class="text-red-600">{{ state.errors }}</small>
          </div>

          <div>
            <form method="POST" class="space-y-6" @submit.prevent="submit">
              <div>
                <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
                  >Email</label
                >
                <input
                  v-model="state.form.email"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="exemple@gmail.com"
                  class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>

              <div>
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
                  >Mot de passe</label
                >
                <input
                  v-model="state.form.password"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mot de passe"
                  class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>

              <div class="flex items-center justify-end">
                <div class="text-sm leading-6">
                  <a
                    href="password-reset"
                    class="font-semibold text-secondary hover:text-secondary-light"
                    >Mot de passe oublié ?</a
                  >
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Se connecter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
