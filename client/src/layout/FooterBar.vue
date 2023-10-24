<script setup lang="ts">
const footerNavigation = {
  shop: [
    { name: 'Lifestyle', href: '#' },
    { name: 'Football', href: '#' },
    { name: 'Running', href: '#' },
    { name: 'Chaussures de ville', href: '#' },
    { name: 'Bottes', href: '#' }
  ],
  company: [
    { name: 'Qui nous sommes', href: '#' },
    { name: 'Durabilité', href: '#' },
    { name: 'Presse', href: '#' },
    { name: 'Carrières', href: '#' },
    { name: 'Conditions générales', href: '#' },
    { name: 'Confidentialité', href: '#' }
  ],
  account: [
    { name: 'Gérer le compte', href: '#' },
    { name: 'Retours et échanges', href: '#' },
    { name: 'Utiliser une carte-cadeau', href: '#' }
  ],
  connect: [
    { name: 'Nous contacter', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'Pinterest', href: '#' }
  ]
}
</script>
<template>
  <footer aria-labelledby="footer-heading" class="bg-white">
    <h2 id="footer-heading" class="sr-only">Pied de page</h2>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="py-20 xl:grid xl:grid-cols-3 xl:gap-8">
        <div class="grid grid-cols-2 gap-8 xl:col-span-2">
          <div class="space-y-16 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Boutique</h3>
              <ul role="list" class="mt-6 space-y-6">
                <li v-for="item in footerNavigation.shop" :key="item.name" class="text-sm">
                  <a :href="item.href" class="text-gray-500 hover:text-gray-600">{{ item.name }}</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900">Entreprise</h3>
              <ul role="list" class="mt-6 space-y-6">
                <li v-for="item in footerNavigation.company" :key="item.name" class="text-sm">
                  <a :href="item.href" class="text-gray-500 hover:text-gray-600">{{ item.name }}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="space-y-16 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Compte</h3>
              <ul role="list" class="mt-6 space-y-6">
                <li v-for="item in footerNavigation.account" :key="item.name" class="text-sm">
                  <a :href="item.href" class="text-gray-500 hover:text-gray-600">{{ item.name }}</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900">Se connecter</h3>
              <ul role="list" class="mt-6 space-y-6">
                <li v-for="item in footerNavigation.connect" :key="item.name" class="text-sm">
                  <a :href="item.href" class="text-gray-500 hover:text-gray-600">{{ item.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-16 md:mt-16 xl:mt-0">
          <h3 class="text-sm font-medium text-gray-900">Abonnez-vous à notre newsletter</h3>
          <p class="mt-6 text-sm text-gray-500">
            Les dernières offres et économies, envoyées dans votre boîte de réception chaque
            semaine.
          </p>
          <form class="mt-2 flex sm:max-w-md">
            <label for="adresse-email" class="sr-only">Adresse e-mail</label>
            <input
              id="adresse-email"
              type="text"
              autocomplete="email"
              required
              class="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-indigo-500 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div class="ml-4 flex-shrink-0">
              <button
                type="submit"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="border-t border-gray-200 py-10">
        <p class="text-sm text-gray-500">Droits d'auteur &copy; 2023 Sneak Peak, Inc.</p>
      </div>
    </div>
  </footer>
</template>
