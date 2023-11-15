<template>
  <div class="flex min-h-screen flex-1">
    <slot/>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img class="absolute inset-0 h-full w-full object-cover" src="/images/air-force-1-wallpaper.jpeg" alt="Sneakers" />
    </div>
  </div>
</template>
