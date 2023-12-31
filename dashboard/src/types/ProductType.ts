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
