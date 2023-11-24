<script setup lang="ts">
const props = defineProps({
  favorites: {
    type: Array as () => Array<any>,
    required: true
  }
})
</script>
<template>
  <section aria-labelledby="favorites-heading">
    <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div class="sm:flex sm:items-baseline sm:justify-between">
        <h2 id="favorites-heading" class="text-2xl font-bold tracking-tight text-gray-900">
          Nos meilleures ventes
        </h2>
        <a
          href="/prodcuts?bestsellers=true"
          class="hidden text-sm font-semibold text-primary-600 hover:text-primary-500 sm:block"
        >
          Voir toutes les meilleures ventes
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 lg:gap-x-8">
        <div v-for="favorite in props.favorites" :key="favorite.id" class="group relative">
          <div
            class="h-96 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2 group-hover:opacity-75 sm:h-auto"
          >
            <img
              :src="favorite.imageSrc"
              :alt="favorite.name"
              class="h-full w-full object-cover object-center"
            />
          </div>
          <h3 class="mt-4 text-base font-semibold text-gray-900">
            <a :href="'/products/' + favorite.id">
              <span class="absolute inset-0" />
              {{ favorite.name }}
            </a>
          </h3>
          <p class="mt-1 text-sm text-gray-500">{{ favorite.price }} €</p>
        </div>
      </div>

      <div class="mt-6 sm:hidden">
        <a href="#" class="block text-sm font-semibold text-primary-600 hover:text-primary-500">
          Recherchez parmis toutes nos meilleures ventes
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
    </div>
  </section>
</template>
