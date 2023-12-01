import type {ModelType} from "@/types/ModelType";
import type {ProductImageType} from "@/types/ProductImageType";

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

export const getProductPrice = (product: ProductType): string => {
    return parseInt(product.discount)
        ? parseInt(product.price) -
        (parseInt(product.price) * parseInt(product.discount)) / 100 +
        ' €'
        : product.price + ' €'
}

export const getTotalProductsPrice = (products: ProductType[]) => {
    return products.reduce((acc: number, product: ProductType) => {
        return acc + parseFloat(getProductPrice(product))
    }, 0).toFixed(2)
}
