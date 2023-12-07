// src/store/wishlist.ts
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

export const useWishlistStore = defineStore('wishlist', {
    state: () => ({
        /** @type {string[]} */
        wishlist: [] as string[],
    }),
    getters: {
        getWishlist(): string[] {
            return this.wishlist;
        },
    },
    actions: {
        async fetchWishlist() {
            try {
                const response = await axiosInstance.get(`/wishes/${userId}`);
                this.wishlist = response.data.products.map((product: any) => product.id);
                return this.wishlist;
            } catch (error) {
                console.error('Erreur lors de la récupération de la liste de souhaits :', error);
            }
        },
        async addToWishlist(productId: string) {
            try {
                if (this.wishlist.includes(productId)) {
                    showToast('Produit déjà présent dans la liste de souhaits', 'warning');
                    return false;
                }
                await axiosInstance.post(`/wishes/${userId}`, {
                    productId: productId
                });
                if (productId && !this.wishlist.includes(productId)) {
                    this.wishlist.push(productId);
                }
                showToast('Produit ajouté à la liste de souhaits', 'success');
                return true;
            } catch (error) {
                console.error('Erreur lors de l\'ajout du produit à la liste de souhaits :', error);
            }
        },
        async removeFromWishlist(productId: string, notify = true) {
            try {
                await axiosInstance.delete(`/wishes/${userId}/${productId}`);
                this.wishlist = this.wishlist.filter((id) => id !== productId);
                if (notify)
                    showToast('Produit retiré de la liste de souhaits', 'success');
                return true;
            } catch (error) {
                console.error('Erreur lors de la suppression du produit de la liste de souhaits :', error);
            }
        },
        isInWishlist(productId: string) {
            return this.wishlist.includes(productId);
        },
        clearWishlist() {
            this.wishlist = [];
        },
    },
});
