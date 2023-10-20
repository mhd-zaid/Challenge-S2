<script setup lang="ts">
import {computed, ref} from 'vue'
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {
  Bars3Icon,
  CalendarIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline'
import {useRouter} from "vue-router";

const router = useRouter()
const navigation = [
  {name: 'Dashboard', href: '/', icon: HomeIcon, current: router.currentRoute.value.path === '/'},
  {name: 'Utilisateurs', href: '/users', icon: UsersIcon, current: router.currentRoute.value.path === '/users'},
  {name: 'Products', href: '/products', icon: FolderIcon, current: router.currentRoute.value.path === '/products'},
  {
    name: 'Catégories',
    href: '/categories',
    icon: CalendarIcon,
    current: router.currentRoute.value.path === '/categories'
  },
  {name: 'Models', href: '/models', icon: DocumentDuplicateIcon, current: router.currentRoute.value.path === '/models'},
]
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}
const user = JSON.parse(localStorage.getItem('user') || '{}')

const fullName = computed(() => {
  return `${user.firstname} ${user.lastname}`
})

const sidebarOpen = ref(false)
</script>
<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
                         enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                         leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80"/>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                           enter-from="-translate-x-full" enter-to="translate-x-0"
                           leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                           leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                               enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                               leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true"/>
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                <RouterLink to="dashboard" class="flex h-16 shrink-0 items-center mt-4">
                  <img class="h-8 w-auto"
                       src="/images/sneakpeak_logo_white.png"
                       alt="Your Company"/>
                </RouterLink>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a :href="item.href"
                             :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                            <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true"/>
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
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
        <RouterLink to="dashboard" class="flex h-16 shrink-0 items-center mt-5">
          <img class="h-8 w-auto"
              src="/images/sneakpeak_logo_white.png"
              alt="Your Company"/>
        </RouterLink>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a :href="item.href"
                     :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                    <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true"/>
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li class="mt-auto -mx-2">
              <a href="/profile"
                 :class="[router.currentRoute.value.path === '/profile' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                <UserIcon class="h-6 w-6 shrink-0" aria-hidden="true"/>
                {{ fullName }}
              </a>
              <a type="button"
                 @click="logout"
                 class="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                <ArrowLeftOnRectangleIcon class="h-6 w-6 shrink-0" aria-hidden="true"/>
                Déconnexion
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-gray-400 lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true"/>
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-white">{{
          router.currentRoute.value.meta?.title
        }}
      </div>
      <a href="/profile">
        <span class="sr-only">Your profile</span>
        <UserIcon class="h-6 w-6 shrink-0 text-white" aria-hidden="true"/>
      </a>
    </div>

    <main class="py-10 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8">
        <slot/>
      </div>
    </main>
  </div>
</template>
