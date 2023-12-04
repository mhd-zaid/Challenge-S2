import type { ModelType } from "@/types/ModelType";
import type { ProductImageType } from "@/types/ProductImageType";

export type ProductType = {
    id: string;
    name: string;
    sku: string;
    price: string;
    quantity: number;
    color: string;
    size: string;
    vat: string;
    discount: string;
    modelId: string;
    model: ModelType;
    productImages: ProductImageType[];
    alertQuantity: number;
}

type CartItem = {
    product: ProductType;
    quantity: number;
}

export const getProductColor = (color: string) => {
    switch (color) {
        case 'Green':
            return 'bg-green-500'
        case 'Blue':
            return 'bg-blue-500'
        case 'Red':
            return 'bg-red-500'
        case 'Yellow':
            return 'bg-yellow-500'
        case 'Pink':
            return 'bg-pink-500'
        case 'Purple':
            return 'bg-purple-500'
        case 'White':
            return 'bg-white'
        case 'Black':
            return 'bg-gray-900'
    }
}

export const getProductPrice = (cartItem: CartItem): string => {
    const { product, quantity } = cartItem
    return parseFloat(product.discount)
        ? ((parseFloat(product.price) -
            (parseFloat(product.price) * parseFloat(product.discount)) / 100) * quantity).toFixed(2)
        : (parseFloat(product.price) * quantity).toFixed(2)
}

export const getTotalProductsPrice = (cartItems: CartItem[]) => {
    let totalPrice = 0
    for (const cartItem of cartItems) {
        if (parseFloat(cartItem.product.discount)) {
            totalPrice += (parseFloat(cartItem.product.price) -
                (parseFloat(cartItem.product.price) * parseFloat(cartItem.product.discount)) / 100) *
                cartItem.quantity
        } else {
            totalPrice += parseFloat(cartItem.product.price) * cartItem.quantity
        }
    }
    return totalPrice.toFixed(2)
}
