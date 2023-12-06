<script setup lang="ts">
const footerNavigation = {
  shop: [
    {name: 'Lifestyle', href: '/products?category=lifestyle'},
    {name: 'Football', href: '/products?category=football'},
    {name: 'Running', href: '/products?category=running'},
    {name: 'Chaussures de ville', href: '/products?category=ville'},
    {name: 'Bottes', href: '/products?category=bottes'}
  ],
  company: [
    {name: 'Qui nous sommes', href: '/about'},
    {name: 'Conditions générale de ventes ', href: '/cgv'},
    {name: 'Conditions générale d\'utilisation', href: '/cgu'},
    {name: 'Menstions légales', href: '/legal-mentions'},
    {name: 'Politique de livraison', href: '/delivery-policy'},
    {name: 'Politique de garantie', href: '/warranty-policy'}
  ],
  account: [
    {name: 'Gérer le compte', href: '/profile'},
    {name: 'Politiques de retours et échanges', href: '/exchange-policy'},
    {name: 'Politique de remboursement', href: '/refund-policy'},
    {name: 'Politique de suppression de compte', href: '/delete-policy'},
    {name: 'Politique de confidentialité', href: '/privacy-policy'},
  ],
  connect: [
    {name: 'Nous contacter', href: '/contact'},
    {name: 'Twitter', href: 'https://twitter.com/?lang=fr'},
    {name: 'Instagram', href: 'https://www.instagram.com/'},
    {name: 'Pinterest', href: 'https://www.pinterest.com/'}
  ]
}
</script>
<template>
  <footer aria-labelledby="footer-heading" class="bg-white border-t border-gray-200">
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
      </div>

      <div class="py-10">
        <p class="text-sm text-gray-500">Droits d'auteur &copy; 2023 Sneak Peak, Inc.</p>
      </div>
    </div>
  </footer>
</template>
