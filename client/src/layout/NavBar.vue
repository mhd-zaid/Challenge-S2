<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue'
import {Dialog, DialogPanel} from '@headlessui/vue'
import {Bars3Icon, HeartIcon, ShoppingBagIcon, UserIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import {useRouter} from 'vue-router'
import {useWishlistStore} from '@/stores/wishlist'
import {useCartStore} from '@/stores/cart'
import ModalComponent from "@/components/RedirectModal.vue";
import checkAuthentication from "@/utils/checkAuthentication";

const isAuthenticated = checkAuthentication()
const wishStore = useWishlistStore()
const cartStore = useCartStore()

const router = useRouter()
const navigation = [
  { name: 'Nos produits', href: '/products' },
  { name: 'Homme', href: '/products?gender=male' },
  { name: 'Femme', href: '/products?gender=female' },
  { name: 'Offres', href: '/products?discount=true' }
]

const mobileMenuOpen = ref(false)
const wishList = ref(0) as any
const cart = ref(0) as any
const state = reactive({
  openModal: false,
})

const getWishes = async () => {
  if (isAuthenticated) {
    await wishStore.fetchWishlist()
  }
}

onMounted(async () => {
  await getWishes()
  wishList.value = wishStore.wishlist.length
  cart.value = cartStore.cart.length
  watch(
    () => wishStore.wishlist.length,
    (newVal) => {
      wishList.value = newVal
    }
  )
  watch(
    () => cartStore.cart.length,
    (newVal) => {
      cart.value = newVal
    }
  )
})

</script>

<template>
  <ModalComponent :open="state.openModal" @close="state.openModal = false" />
  <header
    :class="router.currentRoute.value.path === '/' ? '' : 'bg-white border-b-2 border-b-gray-200'"
  >
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 z-10"
      aria-label="Global"
    >
      <a href="/" class="-m-1.5 p-1.5">
        <span class="sr-only">Sneak Peak</span>
        <img
          class="h-8 w-auto mr-12"
          src="/images/sneakpeak_logo_black.png"
          alt="Sneak Peak Logo"
        />
      </a>
      <div class="flex flex-1">
        <div class="hidden lg:flex lg:gap-x-12">
          <a
            v-for="item in navigation"
            :key="item.name"
            :href="item.href"
            class="text-sm font-semibold leading-6 text-gray-900"
            >{{ item.name }}</a
          >
        </div>
        <div class="flex lg:hidden">
          <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = true"
          >
            <span class="sr-only">Ouvrir le menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="flex flex-1 justify-end">
        <!-- Vérifier s'il l'utilisateur est connecter -->
        <a v-if="isAuthenticated" href="/profile" class="group flex items-center p-2">
          <UserIcon
            class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </a>
        <button
          v-else
          @click="state.openModal = true"
          class="group flex items-center p-2 text-sm font-semibold leading-6 text-gray-900"
        >
          <UserIcon
              class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
          />
        </button>

      </div>
      <!-- Vérifier s'il l'utilisateur est connecter -->
      <div class="ml-4 flow-root lg:ml-6" v-if="isAuthenticated">
        <a href="/wishlist" class="group -m-2 flex items-center p-2">
          <HeartIcon
            class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{{
            wishList
          }}</span>
          <span class="sr-only">produits dans les favoris, voir les favoris</span>
        </a>
      </div>
      <div class="ml-4 flow-root lg:ml-6" v-if="isAuthenticated">
        <a href="/cart" class="group -m-2 flex items-center p-2">
          <ShoppingBagIcon
            class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{{cart}}</span>
          <span class="sr-only">produits dans le panier, voir le panier</span>
        </a>
      </div>
    </nav>

    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex flex-1">
            <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-700"
              @click="mobileMenuOpen = false"
            >
              <span class="sr-only">Fermer le menu</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Sneak Peak</span>
            <img class="h-8 w-auto" src="/images/logo.png" alt="Sneak Peak" />
          </a>
          <div class="flex flex-1 justify-end">
            <a href="/profile" class="group -m-2 flex items-center p-2 mr-1">
              <UserIcon
                class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </a>
            <a href="/wishlist" class="group -m-2 flex items-center p-2 ml-2">
              <HeartIcon
                class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800"
                >{{wishList}}</span
              >
              <span class="sr-only">produits dans les favoris, voir les favoris</span>
            </a>
            <a href="/cart" class="group -m-2 flex items-center p-2 ml-2">
              <ShoppingBagIcon
                class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800"
                >{{cart}}</span
              >
              <span class="sr-only">produits dans le panier, voir le panier</span>
            </a>
          </div>
        </div>
        <div class="mt-6 space-y-2">
          <a
            v-for="item in navigation"
            :key="item.name"
            :href="item.href"
            class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
            >{{ item.name }}</a
          >
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>
