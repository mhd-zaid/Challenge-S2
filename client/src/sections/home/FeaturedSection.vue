<script setup lang="ts">

</script>

<template>
  <section aria-labelledby="shoe-heading">
    <div class="relative bg-gray-800 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
      <div class="absolute inset-0 overflow-hidden">
        <img src="/images/banner-01.jpg" alt="Toutes les chaussures"
             class="h-full w-full object-cover object-center"/>
      </div>
      <div aria-hidden="true" class="absolute inset-0 bg-gray-900 bg-opacity-50"/>
      <div class="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 id="shoe-heading" class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Chaussures de qualité</h2>
        <p class="mt-3 text-xl text-white">Nous sommes dédiés à la vente responsable, durable et éthique de chaussures. Notre approche à petite échelle nous permet de mettre l'accent sur la qualité et de réduire notre impact sur l'environnement. Nous faisons de notre mieux pour offrir des chaussures qui répondent à vos besoins.</p>
        <a href="/products" class="mt-8 block w-full rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-500 sm:w-auto">Découvrez notre collection</a>
      </div>
    </div>
  </section>
</template>
