// src/store/cart.ts
import { defineStore } from 'pinia';
import axiosInstance from "@/utils/axiosInstance";
import { showToast } from '@/utils/toast';

const token = window.localStorage.getItem('token')
const isAuthenticated = !!token
let payload: any = null
let userId: string | null = null
if (isAuthenticated) {
    payload = JSON.parse(atob(token.split('.')[1]))
    userId = payload.userId
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        /** @type {string[]} */
        cart: [] as string[],
    }),
    getters: {
        getCart(): string[] {
            return this.cart;
        },
    },
    actions: {
        async fetchCart(): Promise<any> {
            try {
                const response = await axiosInstance.get(`/carts/${userId}`);
                this.cart = response.data.products.map((product: any) => product.id);
                return this.cart;
            } catch (error) {
                console.error('Erreur lors de la récupération du panier :', error);
            }
        },
        async addToCart(productId: string) {
            try {
                if (this.cart.includes(productId)) {
                    showToast('Produit déjà présent dans le panier', 'warning');
                    return false;
                }
                await axiosInstance.post(`/carts/${userId}`, {
                    productId: productId
                });
                if (productId && !this.cart.includes(productId)) {
                    this.cart.push(productId);
                }
                showToast('Produit ajouté au panier', 'success');
                return true;
            } catch (error) {
                console.error('Erreur lors de l\'ajout du produit au panier :', error);
            }
        },
        async removeFromCart(productId: string) {
            try {
                await axiosInstance.delete(`/carts/${userId}/${productId}`);
                this.cart = this.cart.filter((id) => id !== productId);
                showToast('Produit retiré du panier', 'success');
                return true;
            } catch (error) {
                console.error('Erreur lors de la suppression du produit du panier :', error);
            }
        },
        isInCart(productId: string) {
            return this.cart.includes(productId);
        },
        clearCart() {
            this.cart = [];
        },
    },
});
