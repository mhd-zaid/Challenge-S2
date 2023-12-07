<script setup lang="ts">
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {CheckIcon, ExclamationTriangleIcon} from '@heroicons/vue/24/outline'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  onClose: {
    type: Function,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  }
})

</script>
<template>
  <TransitionRoot as="template" :show="props.open">
    <Dialog as="div" class="relative z-10" @close="props.onClose">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div v-if="!success" class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <ExclamationTriangleIcon class="h-6 w-6 text-red-400" aria-hidden="true" />
                </div>
                <div v-else class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon class="h-6 w-6 text-green-500" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">{{success ? 'Paiement effectué' : 'Paiement échoué'}}</DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{success ?
                        'Votre paiement a été effectué avec succès, nous vous remercions pour votre achat, Vous pouvez maintenant accéder à votre espace personnel, vous pourrez y retrouver vos factures dans la section "Mes factures". dans votre espace profile.'
                        : 'Votre paiement a échoué. Veuillez réessayer.'}}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 flex">
                <RouterLink type="button" class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2" @click="props.onClose"
                            :to="success ? '/' : '/checkout'">Retour à l'accueil</RouterLink>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>