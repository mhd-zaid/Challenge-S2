<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue';

const emit = defineEmits(['acceptCookies', 'declineCookies'])

const detailsOpen = ref(false)

const acceptCookies = () => {
  localStorage.setItem('accept-cookies', 'true')
  emit('acceptCookies')
}
const declineCookies = () => {
  localStorage.setItem('accept-cookies', 'false')
  emit('declineCookies')
}
</script>
<template>
  <div>
    <div
      class="fixed z-50 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <div class="flex items-center mb-3">
                <div
                  class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                >
                  <img src="/images/cookie.svg" alt="Cookie" />
                </div>
                <h3 class="text-lg leading-6 font-medium text-gray-900 ml-4" id="modal-headline">
                  Politique de cookies
                </h3>
              </div>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Ce site utilise des cookies pour vous offrir la meilleure expérience utilisateur
                  possible. Veuillez accepter l'utilisation des cookies pour continuer à utiliser ce
                  site.
                </p>
              </div>
              <!-- bouton avec un chevron vers le vas pour faire apparaitre la politique des cookies -->
              <div class="mt-4">
                <button
                  type="button"
                  class="flex text-sm font-medium text-primary-600 hover:text-primary-500"
                  @click="detailsOpen = !detailsOpen"
                >
                  Plus de détails
                  <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </button>
                <div v-show="detailsOpen">
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Ces cookies sont essentiels au bon fonctionnement du site. Ils vous permettent de naviguer et d’utiliser nos fonctionnalités comme « Ajouter au panier » et pour maintenir l'utilisateur connecté à son compte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="acceptCookies"
            >
              Accepter
            </button>
            <!-- <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="declineCookies"
            >
              Refuser
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```
