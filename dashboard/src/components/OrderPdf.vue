<script lang="ts" setup>
import { defineProps} from 'vue'
const props = defineProps(['data'])

</script>
<template>
    <h1>Facture {{ props.data.id }}</h1>
    <div>
        Détails de l'utilisateur {{ props.data.userId }}
        <div v-if="props.data.user">
            <ul>
                <li>
                    Nom : {{ props.data.user.firstname }} - {{ props.data.user.lastname }}
                </li>
                <li>
                    Adresse : {{ props.data.user.address }}
                </li>
            </ul>
        </div>
    </div>
    <div style="margin-bottom: 1in;">
        Détails de la commande
    </div>
</template>