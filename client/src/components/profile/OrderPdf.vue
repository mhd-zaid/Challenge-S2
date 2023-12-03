<script lang="ts" setup>
import { defineProps } from 'vue'
import axiosInstance from '@/utils/axiosInstance';
const props = defineProps(['data'])

const formatDate = () => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()

  return `${day}-${month}-${year}`
}  
</script>
<template>
  <div class="invoice-box">
    <table>
      <tr class="top">
        <td colspan="4">
          <table>
            <tr>
              <td class="title">
                <img
                  src="../../../public/images/sneakpeak_logo_black.png"
                  alt="Company logo"
                  style="width: 100%; max-width: 300px"
                />
              </td>
              <td></td>
              <td></td>
              <td v-if="props.data.payment">
                Facture #{{props.data.payment.id.toUpperCase() }}<br />
                Généré le: {{ formatDate() }}<br />
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr class="information">
        <td colspan="4">
          <table>
            <tr>
              <td>
                Sneak Peak,<br />
                242 Rue du Faubourg Saint-Antoine, <br />
                75012 Paris
              </td>
              <td></td>
              <td></td>
              <td v-if="props.data.user">
                {{ props.data.user.firstname }}  {{ props.data.user.lastname.toUpperCase() }}<br />
                {{ props.data.user.email }} <br />
                {{ props.data.deliveryAddress.split(',')[0] }} <br />
                {{ props.data.deliveryAddress.split(',')[1] }} <br />
                {{ props.data.deliveryAddress.split(',')[2] }}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr class="heading">
        <td> Méthode de Payment :</td>
        <td></td>
        <td></td>
        <td>Carte</td>
      </tr>
      <tr><br></tr>
      <tr class="heading">
        <td>Référence</td>
        <td>Produit</td>
        <td>Quantité</td>
        <td>Prix Unitaire</td>
      </tr>

      <tr class="item" v-if="props.data.products" v-for="product in props.data.products">
        <td>{{ product.sku }}</td>
        <td>{{ product.name }} - {{ product.size }}</td>
        <td>{{ product.Orders_Products.quantity }}</td>
        <td> {{ (product.Orders_Products.price / 100).toFixed(2) }} €</td>
      </tr>
      <tr><br></tr>
      <tr class="total">
        <td></td>
        <td></td>
        <td></td>
        <td>Total: {{ props.data.total() }} </td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
h1 {
    font-weight: 300;
    margin-bottom: 0px;
    padding-bottom: 0px;
    color: #000;
}

h3 {
    font-weight: 300;
    margin-top: 10px;
    margin-bottom: 20px;
    font-style: italic;
    color: #555;
}

a {
    color: #06f;
}

.invoice-box {
    max-width: 800px;
    margin: auto;
    padding: 30px;
    font-size: 16px;
    line-height: 24px;
    font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    color: #555;
}

.invoice-box table {
    width: 100%;
    line-height: inherit;
    text-align: left;
    border-collapse: collapse;
}

.invoice-box table td {
    padding: 5px;
    vertical-align: top;
}

.invoice-box table tr td:nth-child(4) {
    text-align: right;
}

.invoice-box table tr.top table td {
    padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
    font-size: 45px;
    line-height: 45px;
    color: #333;
}

.invoice-box table tr.information table td {
    padding-bottom: 40px;
}

.invoice-box table tr.heading td {
    background: #eee;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
}

.invoice-box table tr.details td {
    padding-bottom: 20px;
}

.invoice-box table tr.item td {
    border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
    border-bottom: none;
}

.invoice-box table tr.total td:nth-child(4) {
    border-top: 2px solid #eee;
    font-weight: bold;
}

@media only screen and (max-width: 600px) {
    .invoice-box table tr.top table td {
        width: 100%;
        display: block;
        text-align: center;
    }

    .invoice-box table tr.information table td {
        width: 100%;
        display: block;
        text-align: center;
    }
}
</style>
