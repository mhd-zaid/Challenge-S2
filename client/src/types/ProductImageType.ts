import type {ProductType} from "@/types/ProductType";

export type ProductImageType = {
    id: string;
    url: string;
    productId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export const getProductImage = (product: ProductType) => {
    if (product.productImages.length > 0) {
        return `http://localhost:3000/images/${product.productImages[0].url}`
    } else {
        return '/images/no-image.jpeg'
    }
}
