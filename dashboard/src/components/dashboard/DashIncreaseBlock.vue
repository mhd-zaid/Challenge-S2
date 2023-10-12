<script setup lang="ts">
const props = defineProps(['kind', 'label', 'data', 'increase'])
</script>

<template>
  <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
    <dt>
      <div class="absolute rounded-md bg-indigo-500 p-3">
        <svg
          class="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            v-if="props.kind === 'users'"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
          />

          <path
            v-if="props.kind === 'orders'"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
          <path
            v-if="props.kind === 'products'"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>
      <p class="ml-16 truncate text-sm font-medium text-gray-500">{{ props.label }}</p>
    </dt>
    <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
      <p class="text-2xl font-semibold text-gray-900">{{ props.data }}</p>
      <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
        <svg
          class="h-5 w-5 flex-shrink-0 self-center text-green-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="sr-only"> Augmenté de </span>
        {{ props.increase }}
      </p>
      <div class="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
        <div class="text-sm">
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"
            >Voir plus<span class="sr-only"> Total Subscribers stats</span></a
          >
        </div>
      </div>
    </dd>
  </div>
</template>
