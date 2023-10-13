<script setup lang="ts">
import GuestLayout from "@/layouts/GuestLayout.vue";
import {reactive} from "vue";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

const state = reactive({
  form: {
    email: '',
    password: '',
  },
  errors: {},
})

const submit = async () => {
  console.log(state.form)
}

</script>

<template>
  <GuestLayout>
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img class="h-10 w-auto" src="/images/sneakpeak_logo_black.png"
               alt="Your Company"/>
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Not a member?
            {{ ' ' }}
            <RouterLink to="register" class="font-semibold text-indigo-600 hover:text-indigo-500">Register here</RouterLink>
          </p>
        </div>

        <div class="mt-10">
          <div>
            <form method="POST" class="space-y-6" @submit.prevent="submit">
              <div>
                <FormKit
                    v-model="state.form.email"
                    type="email"
                    label="email"
                    validation="required|email"
                    placeholder="exemple@gmail.com"
                    :classes="{
                      label: 'block text-sm font-medium leading-6 text-gray-900',
                      input: 'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    }"
                />
              </div>

              <div>
                <FormKit
                    v-model="state.form.password"
                    type="password"
                    label="Password"
                    validation="required|min:8"
                    placeholder="Password"
                    :classes="{
                      label: 'block text-sm font-medium leading-6 text-gray-900',
                      input: 'block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    }"
                />
              </div>

              <div class="flex items-center justify-end">
                <div class="text-sm leading-6">
                  <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>
              </div>

              <div>
                <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
