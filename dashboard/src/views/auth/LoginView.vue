<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { showToast } from '@/utils/toast'
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

const getErrorMessage = (error: any) => {
  if (error.response) {
    if (error.response.data.message === 'Email not found')
      return "Aucun compte n'est associé à cet email"
    if (error.response.data.message.includes('User is temporarily blocked'))
      return 'Votre compte a été bloqué temporairement'
    if (error.response.data.message === 'Invalid credentials') return 'Mot de passe incorrect'
    if (error.response.data.message === 'Email not confirmed')
      return 'Veuillez confirmer votre adresse e-mail'
  }
  return ''
}

const submit = async () => {
  try {
    axiosInstance
      .post('/auth/login', state.form)
      .then((res) => {
        userStore.setUser(res.data)
        userStore.setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data))
        showToast('Vous êtes connecté !', 'success')
        setTimeout(() => {
          router.push('/')
        }, 1000)
      })
      .catch((error) => {
        state.errors = getErrorMessage(error)
      })
  } catch (e: any) {
    console.error(e)
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
            <RouterLink to="register" class="font-semibold text-indigo-600 hover:text-indigo-500"
              >Inscrivez-vous ici</RouterLink
            >
          </p>
        </div>
        <div>
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
                  class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>

              <div class="flex items-center justify-end">
                <div class="text-sm leading-6">
                  <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >Mot de passe oublié ?</a
                  >
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
