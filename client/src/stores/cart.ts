// src/store/cart.ts
import {defineStore} from 'pinia';
import axiosInstance from "@/utils/axiosInstance";
import {showToast} from '@/utils/toast';
import type {ProductType} from "@/types/ProductType";

const token = window.localStorage.getItem('token')
const isAuthenticated = !!token
let payload: any = null
if (isAuthenticated) {
    payload = JSON.parse(atob(token.split('.')[1]))
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        /** @type {string[]} */
        cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') as string) : [] as ProductType[],
    }),
    getters: {
        getCart(): ProductType[] {
            return this.cart;
        },
    },
    actions: {
        fetchCart() {
            return this.cart;
        },
        async addToCart(productId: any) {
            let product: ProductType = {} as ProductType;
            await axiosInstance.get('products/' + productId).then((response) => {
                product = response.data;
            })
            try {
                if (this.cart.includes(product)) {
                    showToast('Produit déjà présent dans le panier', 'warning');
                    return false;
                }
                if (product && !this.cart.includes(product)) {

                    localStorage.setItem('cart', JSON.stringify([...this.cart, product]));
                    this.cart.push(product);
                }
                showToast('Produit ajouté au panier', 'success');
                return true;
            } catch (error) {
                console.error('Erreur lors de l\'ajout du produit au panier :', error);
            }
        },
        async removeFromCart(product: ProductType) {
            try {
                localStorage.setItem('cart', JSON.stringify(this.cart.filter((p: ProductType) => p.id !== product.id)));
                this.cart = this.cart.filter((p: ProductType) => p.id !== product.id);
                showToast('Produit retiré du panier', 'success');
                return true;
            } catch (error) {
                console.error('Erreur lors de la suppression du produit du panier :', error);
            }
        },
        async isInCart(product: ProductType) {
            try {
                return this.cart.includes(product);
            } catch (error) {
                console.error('Erreur lors de la vérification de la présence du produit dans le panier :', error);
            }
        },
        clearCart() {
            this.cart = [];
            localStorage.removeItem('cart');
        },
    },
});
