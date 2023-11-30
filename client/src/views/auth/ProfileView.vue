<script setup lang="ts">
import { reactive } from 'vue'
import axiosInstance from '@/utils/axiosInstance'
import UserProfileField from '@/components/profile/UserProfileField.vue'
import UserProfilePasswordFields from '@/components/profile/UserProfilePasswordFields.vue'
import UserProfileSwitchField from '@/components/profile/UserProfileSwitchField.vue'
import LayoutComponent from '@/layout/LayoutComponent.vue'
import HistorySection from '@/sections/profile/HistorySection.vue'
import { CloudArrowDownIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'

const state: { user: any; tabs: any[]; currentModifications: any } = reactive({
  user: null,
  tabs: [
    { name: 'Compte', href: '#', current: true },
    { name: 'Mot de passe', href: '#', current: false },
    { name: 'Notifications', href: '#', current: false },
    { name: 'Historique', href: '#', current: false }
  ],
  currentModifications: {
    firstname: false,
    lastname: false,
    email: false,
    phone: false,
    birthdate: false,
    address: false,
    city: false,
    postalCode: false
  }
})

const fields = {
  firstname: { name: 'firstname', label: 'Prénom' },
  lastname: { name: 'lastname', label: 'Nom' },
  email: { name: 'email', label: 'Email' },
  phone: { name: 'phone', label: 'Téléphone' },
  birthdate: { name: 'birthdate', label: 'Date de naissance' },
  address: { name: 'address', label: 'Adresse' },
  city: { name: 'city', label: 'Ville' },
  postalCode: { name: 'postalCode', label: 'Code postal' }
}

const getUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me')
    state.user = response.data
  } catch (error) {
    console.log(error)
  }
}

const changeTab = (tab: any) => {
  state.tabs.forEach((tab) => (tab.current = false))
  tab.current = true
}

const exportPersonalData = async () => {
  try {
    await axiosInstance
      .post(`/exports/${state.user.id}`, {
        dataScope: 'user'
      })
      .then(async (res) => {
        const fileName = res.data.fileName
        const exportId = res.data.exportId

        const downloadLink = document.createElement('a')
        downloadLink.href = `http://localhost:3000/exports/${fileName}`
        downloadLink.download = fileName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        await axiosInstance.delete(`/exports/${exportId}`)
      })
  } catch (e: any) {
    throw e
  }
}

getUser()
</script>

<template>
  <LayoutComponent>
    <div v-if="state.user" class="flex-1 max-w-7xl mx-auto my-8">
      <div class="relative px-0 sm:px-6">
        <div class="pb-16 pt-4">
          <div class="px-4 sm:px-6 lg:px-0">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900">Paramètres</h1>
          </div>
          <div class="px-4 sm:px-6 lg:px-0">
            <div class="py-6">
              <div class="flex">
                <button
                  @click="exportPersonalData"
                  class="bg-white rounded-md text-gray-400 px-3 py-2 text-center text-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-auto"
                >
                  <span class="sr-only">Télécharger l'export</span>
                  <CloudArrowDownIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <!-- Account / Password / Notifications menu -->
              <div class="lg:hidden">
                <label for="selected-tab" class="sr-only">Select a tab</label>
                <select
                  id="selected-tab"
                  name="selected-tab"
                  class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                  @change="
                    changeTab(
                      state.tabs.find(
                        (tab) => tab.name === ($event.target as HTMLSelectElement).value
                      )
                    )
                  "
                >
                  <option
                    v-for="tab in state.tabs"
                    :key="tab.name"
                    :value="tab.name"
                    :selected="tab.current"
                  >
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
                          ? 'border-primary-600 text-primary-600'
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
                      <UserProfileField
                        :userId="state.user.id"
                        :model="fields.firstname"
                        v-model="state.user.firstname"
                      />
                      <UserProfileField
                        :userId="state.user.id"
                        :model="fields.lastname"
                        v-model="state.user.lastname"
                      />
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
                      <UserProfileField
                        :userId="state.user.id"
                        :model="fields.email"
                        v-model="state.user.email"
                      />
                      <UserProfileField
                        :userId="state.user.id"
                        :model="fields.phone"
                        v-model="state.user.phone"
                      />
                      <UserProfileField
                        :userId="state.user.id"
                        :model="fields.birthdate"
                        v-model="state.user.birthdate"
                      />
                      <UserProfileField
                        :userId="state.user.id"
                        :model="fields.address"
                        v-model="state.user.address"
                      />
                      <UserProfileField
                        :userId="state.user.id"
                        :model="fields.city"
                        v-model="state.user.city"
                      />
                      <UserProfileField
                        :userId="state.user.id"
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
                      <UserProfilePasswordFields :userId="state.user.id" />
                    </dl>
                  </div>
                </div>
              </div>

              <!-- Notifications page -->
              <div v-if="state.tabs[2].current">
                <div class="mt-10 divide-y divide-gray-200">
                  <div class="space-y-1">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                    <p class="max-w-2xl text-sm text-gray-500">
                      Définissez ici vos préférences de notifications.
                    </p>
                  </div>
                  <div class="mt-6">
                    <dl class="divide-y divide-gray-200">
                      <UserProfileSwitchField v-for="i in 5" :id="i" />
                    </dl>
                  </div>
                </div>
              </div>

              <!-- History page -->
              <!-- Notifications page -->
              <div v-if="state.tabs[3].current">
                <div class="mt-10">
                  <div class="space-y-1">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Historique</h3>
                    <p class="max-w-2xl text-sm text-gray-500">
                      Retrouvez ici l'historique de vos commandes.
                    </p>
                  </div>
                  <div class="mt-6">
                    <HistorySection />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutComponent>
</template>
