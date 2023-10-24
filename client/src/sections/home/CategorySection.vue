<script setup lang="ts"></script>
<template>
  <section aria-labelledby="category-heading" class="bg-gray-50 mt-24">
    <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div class="sm:flex sm:items-baseline sm:justify-between">
        <h2 id="category-heading" class="text-2xl font-bold tracking-tight text-gray-900">
          Achetez par catégories
        </h2>
        <a
          href="#"
          class="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
        >
          Rechercher toutes les catégories
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
        <!-- New products -->
        <div
          class="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1 sm:relative sm:row-span-2"
        >
          <img
            src="/images/categories-news.jpeg"
            alt="Nouveaux produits"
            class="object-cover object-center group-hover:opacity-75 sm:inset-0 sm:h-full sm:w-full"
          />
          <div
            aria-hidden="true"
            class="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
          />
          <div class="flex items-end p-6 sm:absolute sm:inset-0">
            <div>
              <h3 class="font-semibold text-white">
                <a href="#">
                  <span class="absolute inset-0" />
                  Nos nouveaux produits
                </a>
              </h3>
              <p aria-hidden="true" class="mt-1 text-sm text-white">Achetez maintenant</p>
            </div>
          </div>
        </div>

        <!-- Lifestyle shoes -->
        <div
          class="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-none sm:relative sm:h-full"
        >
          <img
            src="/images/categories-lifestyle.jpeg"
            alt="Lifestyle"
            class="object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full"
          />
          <div
            aria-hidden="true"
            class="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
          />
          <div class="flex items-end p-6 sm:absolute sm:inset-0">
            <div>
              <h3 class="font-semibold text-white">
                <a href="#">
                  <span class="absolute inset-0" />
                  Lifestyle
                </a>
              </h3>
              <p aria-hidden="true" class="mt-1 text-sm text-white">Achetez maintenant</p>
            </div>
          </div>
        </div>

        <!-- Football -->
        <div
          class="group aspect-h-1 aspect-w-2 overflow-hidden rounded-lg sm:aspect-none sm:relative sm:h-full"
        >
          <img
            src="/images/categories-football.jpeg"
            alt="Football"
            class="object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full"
          />
          <div
            aria-hidden="true"
            class="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
          />
          <div class="flex items-end p-6 sm:absolute sm:inset-0">
            <div>
              <h3 class="font-semibold text-white">
                <a href="#">
                  <span class="absolute inset-0" />
                  Football
                </a>
              </h3>
              <p aria-hidden="true" class="mt-1 text-sm text-white">Achetez maintenant</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 sm:hidden">
        <a href="#" class="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
          Rechercher toutes les catégories
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
    </div>
  </section>
</template>
