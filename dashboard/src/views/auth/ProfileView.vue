<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import {
  ArrowLeftOnRectangleIcon,
  BriefcaseIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CogIcon,
  DocumentMagnifyingGlassIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { reactive } from 'vue'
import axiosInstance from '@/utils/axiosInstance'
import UserProfileField from '@/components/UserProfileField.vue'
import UserProfilePasswordFields from '@/components/UserProfilePasswordFields.vue'

const fields = {
  firstname: { name: 'firstname', label: 'Prénom' },
  lastname: { name: 'lastname', label: 'Nom' },
  email: { name: 'email', label: 'Email' },
  phone: { name: 'phone', label: 'Téléphone' },
  address: { name: 'address', label: 'Adresse' },
  city: { name: 'city', label: 'Ville' },
  postalCode: { name: 'postalCode', label: 'Code postal' }
}

const getUser = async () => {
  const response = await axiosInstance.get('/users/6523c1c4f8c1e5c62f9e1691')
  state.user = response.data
}

const state: { user: any; tabs: any[]; currentModifications: any } = reactive({
  user: getUser(),
  tabs: [
    { name: 'Compte', href: '#', current: true },
    { name: 'Mot de passe', href: '#', current: false },
    { name: 'Notifications', href: '#', current: false }
  ],
  currentModifications: {
    firstname: false,
    lastname: false,
    email: false,
    phone: false,
    address: false,
    city: false,
    postalCode: false
  }
})

const changeTab = (tab: any) => {
  state.tabs.forEach((tab) => (tab.current = false))
  tab.current = true
}
</script>

<template>
  <AuthenticatedLayout>
    <main class="flex-1">
      <div class="relative px-6">
        <div class="pb-16 pt-4">
          <div class="px-4 sm:px-6 lg:px-0">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900">Paramètres</h1>
          </div>
          <div class="px-4 sm:px-6 lg:px-0">
            <div class="py-6">
              <!-- Account / Password / Notifications menu -->
              <div class="lg:hidden">
                <label for="selected-tab" class="sr-only">Select a tab</label>
                <select
                  id="selected-tab"
                  name="selected-tab"
                  class="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                >
                  <option v-for="tab in state.tabs" :key="tab.name" :selected="tab.current">
                    {{ tab.name }}
                  </option>
                </select>
              </div>
              <div class="hidden lg:block">
                <div class="border-b border-gray-200">
                  <nav class="-mb-px flex space-x-8">
                    <a
                      v-for="tab in state.tabs"
                      :key="tab.name"
                      :href="tab.href"
                      @click="changeTab(tab)"
                      :class="[
                        tab.current
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                      ]"
                      >{{ tab.name }}</a
                    >
                  </nav>
                </div>
              </div>

              <!-- Account page -->
              <div v-if="state.tabs[0].current">
                <!-- Profile -->
                <div class="mt-10 divide-y divide-gray-200">
                  <div class="space-y-1">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Profil</h3>
                    <p class="max-w-2xl text-sm text-gray-500">
                      Ces informations seront affichées publiquement, alors soyez prudent en les
                      partageant.
                    </p>
                  </div>
                  <div class="mt-6">
                    <dl class="divide-y divide-gray-200">
                      <UserProfileField :model="fields.firstname" v-model="state.user.firstname" />
                      <UserProfileField :model="fields.lastname" v-model="state.user.lastname" />
                    </dl>
                  </div>
                </div>

                <!-- Personnal informations -->
                <div class="mt-10 divide-y divide-gray-200">
                  <div class="space-y-1">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                      Informations personnelles
                    </h3>
                    <p class="max-w-2xl text-sm text-gray-500">
                      Ces informations sont personnelles et ne sont pas partagées publiquement.
                    </p>
                  </div>
                  <div class="mt-6">
                    <dl class="divide-y divide-gray-200">
                      <UserProfileField :model="fields.email" v-model="state.user.email" />
                      <UserProfileField :model="fields.phone" v-model="state.user.phone" />
                      <UserProfileField :model="fields.address" v-model="state.user.address" />
                      <UserProfileField :model="fields.city" v-model="state.user.city" />
                      <UserProfileField
                        :model="fields.postalCode"
                        v-model="state.user.postalCode"
                      />
                    </dl>
                  </div>
                </div>
              </div>

              <!-- Password page -->
              <div v-if="state.tabs[1].current">
                <!-- Profile -->
                <div class="mt-10 divide-y divide-gray-200">
                  <div class="space-y-1">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Mot de passe</h3>
                    <p class="max-w-2xl text-sm text-gray-500">
                      <!-- Votre mot de passe doit contenir au moins 12 caractères dont une majuscule, une
                      minuscule, un chiffre et un caractère spécial. -->
                      Vous pouvez modifier votre mot de passe à tout moment depuis cette page.
                    </p>
                  </div>
                  <div class="mt-6">
                    <dl class="divide-y divide-gray-200">
                      <UserProfilePasswordFields />
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </AuthenticatedLayout>
</template>



<!-- Photo -->
<!-- <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                        <dt class="text-sm font-medium text-gray-500">Photo</dt>
                        <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <span class="flex-grow">
                            <img
                              class="h-8 w-8 rounded-full"
                              src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                          </span>
                          <span class="ml-4 flex flex-shrink-0 items-start space-x-4">
                            <button
                              type="button"
                              class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              Modifier
                            </button>
                            <span class="text-gray-300" aria-hidden="true">|</span>
                            <button
                              type="button"
                              class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              Remove
                            </button>
                          </span>
                        </dd>
                      </div> -->

<!-- Job title -->
<!-- <div
                        class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200 sm:py-5"
                      >
                        <dt class="text-sm font-medium text-gray-500">Job title</dt>
                        <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <span class="flex-grow">Human Resources Manager</span>
                          <span class="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              Modifier
                            </button>
                          </span>
                        </dd>
                      </div> -->
<!-- Language -->
<!-- <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                        <dt class="text-sm font-medium text-gray-500">Language</dt>
                        <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <span class="flex-grow">English</span>
                          <span class="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              Modifier
                            </button>
                          </span>
                        </dd>
                      </div> -->

<!-- Date format -->
<!-- <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                        <dt class="text-sm font-medium text-gray-500">Date format</dt>
                        <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <span class="flex-grow">DD-MM-YYYY</span>
                          <span class="ml-4 flex flex-shrink-0 items-start space-x-4">
                            <button
                              type="button"
                              class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              Modifier
                            </button>
                            <span class="text-gray-300" aria-hidden="true">|</span>
                            <button
                              type="button"
                              class="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              Remove
                            </button>
                          </span>
                        </dd>
                      </div> -->

<!-- Timezone -->
<!-- <SwitchGroup
                        as="div"
                        class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5"
                      >
                        <SwitchLabel as="dt" class="text-sm font-medium text-gray-500" passive
                          >Automatic timezone
                        </SwitchLabel>
                        <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <Switch
                            v-model="automaticTimezoneEnabled"
                            :class="[
                              automaticTimezoneEnabled ? 'bg-purple-600' : 'bg-gray-200',
                              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto'
                            ]"
                          >
                            <span
                              aria-hidden="true"
                              :class="[
                                automaticTimezoneEnabled ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                              ]"
                            />
                          </Switch>
                        </dd>
                      </SwitchGroup> -->

<!-- Data update -->
<!-- <SwitchGroup
                        as="div"
                        class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200 sm:py-5"
                      >
                        <SwitchLabel as="dt" class="text-sm font-medium text-gray-500" passive
                          >Auto-update applicant data
                        </SwitchLabel>
                        <dd class="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          <Switch
                            v-model="autoUpdateApplicantDataEnabled"
                            :class="[
                              autoUpdateApplicantDataEnabled ? 'bg-purple-600' : 'bg-gray-200',
                              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto'
                            ]"
                          >
                            <span
                              aria-hidden="true"
                              :class="[
                                autoUpdateApplicantDataEnabled ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                              ]"
                            />
                          </Switch>
                        </dd>
                      </SwitchGroup> -->
