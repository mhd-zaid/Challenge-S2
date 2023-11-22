<script setup lang="ts">
import LayoutComponent from '@/layout/LayoutComponent.vue'
import { reactive, ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon, PlusIcon } from '@heroicons/vue/20/solid'
import axiosInstance from '@/utils/axiosInstance'
import type { ProductType } from '@/types/ProductType'
import type { BrandType } from '@/types/BrandType'
import type { CategoryType } from '@/types/CategoryTypes'
import type { ModelType } from '@/types/ModelType'

const state = reactive({
  products: [] as ProductType[],
  brands: [] as BrandType[],
  categories: [] as CategoryType[],
  models: [] as ModelType[]
})
const mobileFiltersOpen = ref(false)

const init = async () => {
  await axiosInstance
    .get('/products')
    .then((res) => {
      state.products = res.data
    })
    .catch((err) => {
      console.log(err)
    })
}
init()

const getImage = (product: any) => {
  if (product.productImages.length > 0) {
    return `http://localhost:3000/images/${product.productImages[0].url}`
  } else {
    return '/images/no-image.jpeg'
  }
}
const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White' },
      { value: 'beige', label: 'Beige' },
      { value: 'blue', label: 'Blue' },
      { value: 'brown', label: 'Brown' },
      { value: 'green', label: 'Green' },
      { value: 'purple', label: 'Purple' }
    ]
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'All New Arrivals' },
      { value: 'tees', label: 'Tees' },
      { value: 'crewnecks', label: 'Crewnecks' },
      { value: 'sweatshirts', label: 'Sweatshirts' },
      { value: 'pants-shorts', label: 'Pants & Shorts' }
    ]
  },
  {
    id: 'sizes',
    name: 'Sizes',
    options: [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
      { value: '2xl', label: '2XL' }
    ]
  }
]
</script>

<template>
  <LayoutComponent>
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
                    v-for="section in filters"
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
      <div class="px-6 py-24 lg:px-8 bg-gray-100">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Nouvel arrivage
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
                  v-for="(section, sectionIdx) in filters"
                  :key="section.name"
                  :class="sectionIdx === 0 ? null : 'pt-10'"
                >
                  <fieldset>
                    <legend class="block text-sm font-medium text-gray-900">
                      {{ section.name }}
                    </legend>
                    <div class="space-y-3 pt-6">
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
                        />
                        <label
                          :for="`${section.id}-${optionIdx}`"
                          class="ml-3 text-sm text-gray-600"
                          >{{ option.label }}</label
                        >
                      </div>
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
                <RouterLink :to="'/products/' + product.id">
                  <div
                    class="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96"
                  >
                    <img
                      :src="getImage(product)"
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
                      <p class="text-base font-medium text-gray-900">{{ product.price }} €</p>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </LayoutComponent>
</template>
