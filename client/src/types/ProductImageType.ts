import type {ProductType} from "@/types/ProductType";

export type ProductImageType = {
    id: string;
    url: string;
    productId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}
const Host = import.meta.env.VITE_HOST_API

export const getProductImage = (product: ProductType, index = 0) => {
    if (product?.productImages?.length > 0) {
        return `${Host}/images/${product.productImages[index].url}`
    } else {
        return '/images/no-image.jpeg'
    }
}
