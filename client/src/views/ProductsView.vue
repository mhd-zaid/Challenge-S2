<script setup lang="ts">
import LayoutComponent from '@/layout/LayoutComponent.vue'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon, PlusIcon } from '@heroicons/vue/20/solid'
import axiosInstance from '@/utils/axiosInstance'
import type { ProductType } from '@/types/ProductType'
import type { BrandType } from '@/types/BrandType'
import type { CategoryType } from '@/types/CategoryTypes'
import type { ModelType } from '@/types/ModelType'
import { useRouter } from 'vue-router'
import { getProductImage } from '@/types/ProductImageType'
import { useWishlistStore } from '@/stores/wishlist'
import ModalComponent from '@/components/RedirectModal.vue'
import checkAuthentication from '@/utils/checkAuthentication'

const isAuthenticated = checkAuthentication()
const wishStore = useWishlistStore()

const state = reactive({
  products: [] as ProductType[],
  brands: [] as BrandType[],
  categories: [] as CategoryType[],
  models: [] as ModelType[],
  currentPage: 1 as number,
  openModal: false,
  productsPerPage: 12 as number,
  totalProducts: 12 as number,
  filters: [
    {
      id: 'price',
      name: 'Recherche par prix',
      fields: [
        {
          id: 'minPrice',
          name: 'Min',
          value: null
        },
        {
          id: 'maxPrice',
          name: 'Max',
          value: null
        }
      ]
    },
    {
      id: 'category',
      name: 'Catégories',
      options: [] as { value: string; label: string; selected: boolean }[]
    },
    {
      id: 'brand',
      name: 'Marques',
      options: [] as { value: string; label: string; selected: boolean }[]
    },
    {
      id: 'gender',
      name: 'Genre',
      options: [
        { value: 'male', label: 'Homme', selected: false },
        { value: 'female', label: 'Femme', selected: false }
      ]
    },
    {
      id: 'discount',
      name: 'Promotions',
      options: [{ value: 'true', label: 'En promotion', selected: false }]
    },
    {
      id: 'color',
      name: 'Couleurs',
      options: [
        { value: 'white', label: 'Blanc', selected: false },
        { value: 'beige', label: 'Beige', selected: false },
        { value: 'blue', label: 'Bleu', selected: false },
        { value: 'brown', label: 'Marron', selected: false },
        { value: 'green', label: 'Vert', selected: false },
        { value: 'purple', label: 'Violet', selected: false },
        { value: 'red', label: 'Rouge', selected: false },
        { value: 'black', label: 'Noir', selected: false },
        { value: 'yellow', label: 'Jaune', selected: false },
        { value: 'orange', label: 'Orange', selected: false },
        { value: 'pink', label: 'Rose', selected: false },
        { value: 'gray', label: 'Gris', selected: false }
      ]
    }
  ],
  activeFilters: computed(() => {
    const activeFilters: any = {}

    state.filters.map((filter) => {
      if (filter.id === 'price') {
        filter.fields?.map((field) => {
          if (field.value !== null) {
            activeFilters[field.id] = field.value
          }
        })
      } else {
        filter.options?.map((option) => {
          if (option.selected) {
            if (activeFilters[filter.id]) {
              activeFilters[filter.id].push(option.value)
            } else {
              activeFilters[filter.id] = [option.value]
            }
          }
        })
      }
    })

    return activeFilters
  })
})

const router = useRouter()
const mobileFiltersOpen = ref(false)

const getActiveFiltersFromURL = () => {
  const activeFilters: any = {}
  for (const filter of state.filters) {
    const filterId = filter.id
    const filterValuesFromURL = router.currentRoute.value.query[filterId]
    if (filterValuesFromURL) {
      activeFilters[filterId] = Array.isArray(filterValuesFromURL)
        ? filterValuesFromURL
        : [filterValuesFromURL]
    }
  }
  return activeFilters
}

const getActivePageFromURL = () => {
  const pageFromURL = router.currentRoute.value.query.page
  return pageFromURL ? parseInt(pageFromURL as string) : 1
}

const getCategories = async () => {
  try {
    const res = await axiosInstance.get('/categories')
    state.categories = res.data
    state.filters.find((f) => f.id === 'category')!.options = res.data.map((category: any) => {
      return { value: category.name.toLowerCase(), label: category.name, selected: false }
    })
  } catch (err) {
    console.log(err)
  }
}

const getBrands = async () => {
  try {
    const res = await axiosInstance.get('/brands')
    state.brands = res.data
    state.filters.find((f) => f.id === 'brand')!.options = res.data.map((brand: any) => {
      return { value: brand.name.toLowerCase(), label: brand.name, selected: false }
    })
  } catch (err) {
    console.log(err)
  }
}

const getProducts = async (filters: any = null, page: number = 1) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (key === 'minPrice' && typeof value === 'number') {
      params.append('minPrice', value.toString())
    } else if (key === 'maxPrice' && typeof value === 'number') {
      params.append('maxPrice', value.toString())
    } else if (Array.isArray(value)) {
      const concatenatedValues = (value as string[]).map((item) => item.toString()).join(',')
      params.append(key, concatenatedValues)
    } else if (typeof value === 'string') {
      params.append(key, value)
    }
  }

  try {
    const res = await axiosInstance.get(`/products?page=${page}&${params.toString()}`)
    state.products = res.data.products
    state.currentPage = page
    state.totalProducts = res.data.totalProducts
  } catch (err) {
    console.log(err)
  }
}

const loadPage = (page: number) => {
  getProducts(state.activeFilters, page)
  state.currentPage = page
}

onMounted(async () => {
  await Promise.all([getCategories(), getBrands()])
  const activeFiltersFromURL = getActiveFiltersFromURL()
  console.log()
  const activePageFromURL = getActivePageFromURL()
  for (const filterId in activeFiltersFromURL) {
    const filter = state.filters.find((f) => f.id === filterId)
    if (filter) {
      filter.options?.forEach((option) => {
        option.selected = activeFiltersFromURL[filterId].includes(option.value)
      })
    }
  }
  await getProducts(state.activeFilters, activePageFromURL)
  watch(
      state.filters,
      () => {
        const activeFilters = state.activeFilters;
        nextTick(() => {
          router.push({ query: { page: state.currentPage, ...activeFilters } });
          getProducts(activeFilters);
        });
      },
      { deep: true }
  );
  watch(
      () => state.currentPage,
      () => {
        router.push({ query: { page: state.currentPage, ...state.activeFilters } })
      }
  )
})


const toggleWishlist = (productId: string) => {
  if (wishStore.isInWishlist(productId)) {
    wishStore.removeFromWishlist(productId)
  } else {
    wishStore.addToWishlist(productId)
  }
}
</script>

<template>
  <LayoutComponent>
    <ModalComponent :open="state.openModal" @close="state.openModal = false" />
    <div>
      <!-- Mobile filter dialog -->
      <TransitionRoot as="template" :show="mobileFiltersOpen">
        <Dialog as="div" class="relative z-40 lg:hidden" @close="mobileFiltersOpen = false">
          <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div class="fixed inset-0 z-40 flex">
            <TransitionChild
              as="template"
              enter="transition ease-in-out duration-300 transform"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel
                class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl"
              >
                <div class="flex items-center justify-between px-4">
                  <h2 class="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    class="relative -mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                    @click="mobileFiltersOpen = false"
                  >
                    <span class="absolute -inset-0.5" />
                    <span class="sr-only">Close menu</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <!-- Filters -->
                <form class="mt-4">
                  <Disclosure
                    as="div"
                    v-for="section in state.filters"
                    :key="section.name"
                    class="border-t border-gray-200 pb-4 pt-4"
                    v-slot="{ open }"
                  >
                    <fieldset>
                      <legend class="w-full px-2">
                        <DisclosureButton
                          class="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span class="text-sm font-medium text-gray-900">{{ section.name }}</span>
                          <span class="ml-6 flex h-7 items-center">
                            <ChevronDownIcon
                              :class="[open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform']"
                              aria-hidden="true"
                            />
                          </span>
                        </DisclosureButton>
                      </legend>
                      <DisclosurePanel class="px-4 pb-2 pt-4">
                        <div class="space-y-6">
                          <div
                            v-for="(option, optionIdx) in section.options"
                            :key="option.value"
                            class="flex items-center"
                          >
                            <input
                              v-model="option.selected"
                              :id="`${section.id}-${optionIdx}-mobile`"
                              :name="`${section.id}[]`"
                              :value="option.value"
                              type="checkbox"
                              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label
                              :for="`${section.id}-${optionIdx}-mobile`"
                              class="ml-3 text-sm text-gray-500"
                              >{{ option.label }}</label
                            >
                          </div>
                        </div>
                      </DisclosurePanel>
                    </fieldset>
                  </Disclosure>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
      <div class="px-6 py-12 lg:px-8 bg-gray-100">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="mt-2 text-6xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {{
              Object.keys(state.activeFilters).length > 0
                ? 'Filtres appliqués'
                : 'Tous les produits'
            }}
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Variété de chaussures pour hommes et femmes de haute qualité et de marques
            internationales
          </p>
        </div>
      </div>
      <div class="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
        <div class="pb-24 pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
          <aside>
            <h2 class="sr-only">Filters</h2>
            <button
              type="button"
              class="inline-flex items-center lg:hidden"
              @click="mobileFiltersOpen = true"
            >
              <span class="text-sm font-medium text-gray-700">Filters</span>
              <PlusIcon class="ml-1 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            </button>

            <div class="hidden lg:block">
              <form class="space-y-10 divide-y divide-gray-200">
                <div
                  v-for="(section, sectionIdx) in state.filters"
                  :key="section.name"
                  :class="sectionIdx === 0 ? null : 'pt-10'"
                >
                  <fieldset>
                    <legend class="block text-sm font-medium text-gray-900">
                      {{ section.name }}
                    </legend>
                    <div class="space-y-3 pt-6">
                      <template v-if="section.id === 'price'">
                        <div
                          v-for="(field, fieldIdx) in section.fields"
                          :key="fieldIdx"
                          class="flex items-center"
                        >
                          <label :for="field.id" class="text-sm text-gray-600"
                            >{{ field.name }}:</label
                          >
                          <input
                            v-model="field.value"
                            :id="field.id"
                            type="number"
                            class="ml-2 w-20 p-1 border border-gray-300 rounded"
                          />
                        </div>
                      </template>
                      <template v-else>
                        <div
                          v-for="(option, optionIdx) in section.options"
                          :key="option.value"
                          class="flex items-center"
                        >
                          <input
                            :id="`${section.id}-${optionIdx}`"
                            :name="`${section.id}[]`"
                            :value="option.value"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            v-model="option.selected"
                          />
                          <label
                            :for="`${section.id}-${optionIdx}`"
                            class="ml-3 text-sm text-gray-600"
                            >{{ option.label }}</label
                          >
                        </div>
                      </template>
                    </div>
                  </fieldset>
                </div>
              </form>
            </div>
          </aside>
          <section
            aria-labelledby="product-heading"
            class="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
          >
            <h2 id="product-heading" class="sr-only">Products</h2>
            <div
              class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3"
            >
              <div
                v-for="product in state.products"
                :key="product.id"
                class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <!-- Wishlist button -->
                <button
                  @click="isAuthenticated ? toggleWishlist(product.id) : (state.openModal = true)"
                  class="absolute top-2 right-2 text-gray-700 z-10 hover:text-red-500"
                >
                  <HeartIcon
                    class="h-6 w-6"
                    :class="{
                      'hover:fill-red-500': !wishStore.isInWishlist(product.id),
                      'text-red-500 fill-red-500 hover:fill-transparent': wishStore.isInWishlist(
                        product.id
                      )
                    }"
                  />
                </button>
                <RouterLink :to="'/products/' + product.id">
                  <div
                    class="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-70"
                  >
                    <img
                      :src="getProductImage(product)"
                      alt="Front of men&#039;s Basic Tee in black."
                      class="h-full w-full object-cover object-center sm:h-full sm:w-full"
                    />
                  </div>
                  <div class="flex flex-1 flex-col space-y-2 p-4">
                    <h3 class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </h3>
                    <p class="text-sm text-gray-500">{{ product?.model?.description }}</p>
                    <div class="flex flex-1 flex-col justify-end">
                      <p class="text-base font-medium text-gray-900">
                        {{
                          parseInt(product.discount)
                            ? parseInt(product.price) -
                              (parseInt(product.price) * parseInt(product.discount)) / 100 +
                              ' €'
                            : product.price + ' €'
                        }}
                      </p>
                      <p
                        v-if="parseInt(product.discount)"
                        class="text-sm font-medium text-red-600 line-through"
                      >
                        {{ product.price }} €
                      </p>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </div>
            <!-- Pagination -->
            <div class="flex justify-between items-center mt-4">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  type="button"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Affichage de
                    <span class="font-medium">{{
                      (state.currentPage - 1) * state.productsPerPage + 1
                    }}</span>
                    à
                    <span class="font-medium">{{
                      state.productsPerPage > state.products.length
                        ?  (state.currentPage - 1) * state.productsPerPage + state.products.length
                        : state.currentPage * state.productsPerPage
                    }}</span>
                    parmis
                    <span class="font-medium">{{ state.totalProducts }}</span>
                    résultats
                  </p>
                </div>
                <div>
                  <nav
                    class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      type="button"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50"
                      :class="{
                        'bg-gray-50': state.currentPage === 1,
                        'bg-white': state.currentPage !== 1
                      }"
                      @click="state.currentPage -= 1"
                      :disabled="state.currentPage === 1"
                    >
                      <span class="sr-only">Précédent</span>
                      <ChevronLeftIcon class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {{ state.currentPage }}
                    </button>
                    <button
                      type="button"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50"
                      :class="{
                        'bg-gray-50': state.productsPerPage > state.products.length,
                      }"
                      @click="state.currentPage += 1"
                      :disabled="state.productsPerPage > state.products.length"
                    >
                      <span class="sr-only">Suivant</span>
                      <ChevronRightIcon class="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </LayoutComponent>
</template>
