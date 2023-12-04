// src/store/cart.ts
import { defineStore } from 'pinia';
import axiosInstance from "@/utils/axiosInstance";
import { showToast } from '@/utils/toast';
import type { ProductType } from "@/types/ProductType";

const token = window.localStorage.getItem('token')
const isAuthenticated = !!token
let payload: any = null
if (isAuthenticated) {
    payload = JSON.parse(atob(token.split('.')[1]))
}

interface CartItem {
    product: ProductType;
    quantity: number;
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        /** @type {CartItem[]} */
        cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') as string) : [] as CartItem[],
    }),
    getters: {
        getCart(): CartItem[] {
            return this.cart;
        },
    },
    actions: {
        fetchCart() {
            return this.cart;
        },
        async addToCart(productId: any, quantity: number = 1) {
            let product: ProductType = {} as ProductType;
            await axiosInstance.get('products/' + productId).then((response) => {
                product = response.data;
            })
            try {
                const existingItemIndex = this.isInCart(product)

                if (existingItemIndex !== -1) {
                    this.cart[existingItemIndex].quantity += quantity;
                    showToast('Quantité mise à jour', 'success');
                } else {
                    this.cart.push({ product, quantity });
                    showToast('Produit ajouté au panier', 'success');
                }

                localStorage.setItem('cart', JSON.stringify(this.cart));
                
                return true;
            } catch (error) {
                console.error('Erreur lors de l\'ajout du produit au panier :', error);
            }
        },
        async removeFromCart(product: ProductType) {
            try {
                const updatedCart = this.cart.filter((item: CartItem) => item.product.id !== product.id);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                this.cart = updatedCart;
                showToast('Produit retiré du panier', 'success');
                return true;
            } catch (error) {
                console.error('Erreur lors de la suppression du produit du panier :', error);
            }
        },
        async updateQuantity(product: ProductType, quantity: number) {
            try {
                const existingItemIndex = this.isInCart(product)

                if (existingItemIndex !== -1) {
                    this.cart[existingItemIndex].quantity = quantity;
                }

                localStorage.setItem('cart', JSON.stringify(this.cart));
                return true;
            } catch (error) {
                console.error('Erreur lors de la mise à jour de la quantité du produit dans le panier :', error);
            }
        },
        isInCart(product: ProductType) {
            try {
                return this.cart.findIndex((item: any) => item.product.id === product.id);
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
