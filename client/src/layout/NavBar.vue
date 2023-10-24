<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon, UserIcon , ShoppingBagIcon, HeartIcon } from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Nouveautés', href: '/new' },
  { name: 'Homme', href: '/man' },
  { name: 'Femme', href: '/woman' },
  { name: 'Enfant', href: '/kid' },
  { name: 'Offres', href: '/offers' }
]

const mobileMenuOpen = ref(false)
</script>
<template>
  <header class="bg-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 z-10" aria-label="Global">
      <a href="/" class="-m-1.5 p-1.5">
        <span class="sr-only">Sneak Peak</span>
        <img class="h-8 w-auto mr-12" src="/images/logo.png" alt="Sneak Peak Logo" />
      </a>
      <div class="flex flex-1">
        <div class="hidden lg:flex lg:gap-x-12">
          <a v-for="item in navigation" :key="item.name" :href="item.href" class="text-sm font-semibold leading-6 text-gray-900">{{ item.name }}</a>
        </div>
        <div class="flex lg:hidden">
          <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
            <span class="sr-only">Ouvrir le menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="flex flex-1 justify-end mr-2">
        <a href="#" class="group -m-2 flex items-center p-2">
          <UserIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
        </a>
      </div>
      <div class="ml-4 flow-root lg:ml-6">
        <a href="#" class="group -m-2 flex items-center p-2">
          <HeartIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
          <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
          <span class="sr-only">produits dans les favoris, voir les favoris</span>
        </a>
      </div>
      <div class="ml-4 flow-root lg:ml-6">
        <a href="#" class="group -m-2 flex items-center p-2">
          <ShoppingBagIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
          <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
          <span class="sr-only">produits dans le panier, voir le panier</span>
        </a>
      </div>
    </nav>

    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex flex-1">
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
              <span class="sr-only">Fermer le menu</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Sneak Peak</span>
            <img class="h-8 w-auto" src="/images/logo.png" alt="Sneak Peak" />
          </a>
          <div class="flex flex-1 justify-end">
            <a href="#" class="group -m-2 flex items-center p-2 mr-1">
              <UserIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
            </a>
            <a href="#" class="group -m-2 flex items-center p-2 ml-2">
              <HeartIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
              <span class="sr-only">produits dans les favoris, voir les favoris</span>
            </a>
            <a href="#" class="group -m-2 flex items-center p-2 ml-2">
              <ShoppingBagIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
              <span class="sr-only">produits dans le panier, voir le panier</span>
            </a>
          </div>
        </div>
        <div class="mt-6 space-y-2">
          <a v-for="item in navigation" :key="item.name" :href="item.href" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{{ item.name }}</a>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>
