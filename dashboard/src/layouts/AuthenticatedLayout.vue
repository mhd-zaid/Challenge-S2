<script setup lang="ts">
import {computed, ref} from 'vue'
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  DocumentDuplicateIcon,
  HomeIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  TruckIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import {useRouter} from 'vue-router'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const navigation = [
  {
    name: 'Tableau de bord',
    href: '/',
    icon: HomeIcon,
    current: router.currentRoute.value.path === '/'
  },
  {
    name: 'Utilisateurs',
    href: '/users',
    icon: UsersIcon,
    current: router.currentRoute.value.path === '/users',
  },
  {
    name: 'Commandes',
    href: '/orders',
    icon: TruckIcon,
    current: router.currentRoute.value.path === '/orders'
  },
  {
    name: 'Produits',
    href: '/products',
    icon: RectangleStackIcon,
    current: router.currentRoute.value.path === '/products'
  },
  {
    name: 'Catégories',
    href: '/categories',
    icon: RectangleGroupIcon,
    current: router.currentRoute.value.path === '/categories'
  },
  {
    name: 'Modèles',
    href: '/models',
    icon: Square3Stack3DIcon,
    current: router.currentRoute.value.path === '/models'
  },
  {
    name: 'Marques',
    href: '/brands',
    icon: Squares2X2Icon,
    current: router.currentRoute.value.path === '/brands'
  },
  {
    name: 'Exports',
    href: '/exports',
    icon: DocumentDuplicateIcon,
    current: router.currentRoute.value.path === '/exports'
  }
]
if (user.role !== 'ROLE_ADMIN') {
  navigation.splice(1, 1)
}
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

const fullName = computed(() => {
  return `${user.firstname} ${user.lastname}`
})

const sidebarOpen = ref(false)
</script>
<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-primary/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-2 ring-1 ring-white/10"
              >
                <RouterLink to="/" class="flex h-16 shrink-0 items-center mt-4">
                  <img class="h-8 w-auto" src="/images/sneakpeak_logo_white.png" alt="Sneak Peak" />
                </RouterLink>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a
                            :href="item.href"
                            :class="[
                              item.current
                                ? 'bg-primary-light text-white'
                                : 'text-secondary-light hover:text-white hover:bg-primary-light',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            ]"
                          >
                            <component
                              :is="item.icon"
                              class="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6">
        <RouterLink to="/" class="flex h-16 shrink-0 items-center mt-5">
          <img class="h-8 w-auto" src="/images/sneakpeak_logo_white.png" alt="Your Company" />
        </RouterLink>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a
                    :href="item.href"
                    :class="[
                      item.current
                        ? 'bg-primary-light text-white'
                        : 'text-secondary-light hover:text-gray-200 hover:bg-primary-light',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    ]"
                  >
                    <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li class="mt-auto -mx-2">
              <a
                href="/profile"
                :class="[
                  router.currentRoute.value.path === '/profile'
                    ? 'bg-primary-light text-white'
                    : 'text-secondary-light hover:text-gray-200 hover:bg-primary-light',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                ]"
              >
                <UserIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                {{ fullName }}
              </a>
              <a
                type="button"
                @click="logout"
                class="mb-5 text-secondary-light cursor-pointer hover:text-white hover:bg-primary-light group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              >
                <ArrowLeftOnRectangleIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
                Déconnexion
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div
      class="sticky top-0 z-40 flex items-center gap-x-6 bg-primary px-4 py-4 shadow-sm sm:px-6 lg:hidden"
    >
      <button
        type="button"
        class="-m-2.5 p-2.5 text-secondary-light lg:hidden"
        @click="sidebarOpen = true"
      >
        <span class="sr-only">Ouvrir la barre</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-white">
        {{ navigation.find((item) => item.href === router.currentRoute.value.path)?.name }}
      </div>
      <a href="/profile">
        <span class="sr-only">Votre profil</span>
        <UserIcon class="h-6 w-6 shrink-0 text-white" aria-hidden="true" />
      </a>
    </div>

    <main class="py-10 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
