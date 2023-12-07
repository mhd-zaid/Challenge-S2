<script lang="ts" setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { defineProps } from 'vue'
import { columnNames, getValue, getEntityName } from '@/utils/valuesUpdater'
import OrderPdf from '@/components/OrderPdf.vue'
import html2pdf from 'html2pdf.js'

const props = defineProps(['data', 'entityType'])

const downloadInvoice = async (orderId: string) => {
  const template = document.getElementById('invoice-template')
  if (
    template &&
    props.data.user.disabled === false &&
    props.data.status !== 'payment pending' &&
    props.data.status !== 'payment failed'
  ) {
    template.style.display = 'block'
    await html2pdf(template, {
      margin: [1, 1],
      filename: `facture-${orderId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    })
    template.style.display = 'none'
  }
}
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">
            {{ `Détails - ${getEntityName(entityType)}` }}
          </h1>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            v-if="
              props.entityType === 'order' &&
              props.data.status !== 'payment pending' &&
              props.data.status !== 'payment failed' &&
              props.data.user &&
              props.data.user.disabled === false
            "
            v-on:click="downloadInvoice(props.data.id)"
            type="button"
            class="block rounded-md bg-red-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Télécharger la facture
          </button>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <RouterLink
            :to="{ name: `${props.entityType === 'category' ? 'categorie' : props.entityType}s` }"
            class="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            <button
              type="button"
              class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Retour à la liste
            </button>
          </RouterLink>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <table class="min-w-full divide-y divide-gray-200">
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(value, key) in props.data" :key="key">
              <td class="px-6 py-4 text-sm font-medium text-gray-500">
                {{ columnNames[key] ? columnNames[key] : key }}
              </td>
              <td
                :class="{ flex: String(key) === 'productImages' }"
                class="px-6 py-4 text-sm text-gray-900"
              >
                <img
                  v-if="String(key) === 'productImages'"
                  class="w-48 h-32 object-cover mr-2"
                  v-for="url in getValue(props.data, key)"
                  :src="url"
                  alt="Image du produit"
                />
                <span v-else>
                  {{ getValue(props.data, key) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="invoice-template" v-if="entityType === 'order'" style="display: none">
      <OrderPdf v-if="props.data" :data="props.data" />
    </div>
  </AuthenticatedLayout>
</template>
