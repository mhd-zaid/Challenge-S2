import type {CategoryType} from "@/types/CategoryTypes";
import type {BrandType} from "@/types/BrandType";
import type {ProductType} from "@/types/ProductType";

export type ModelType = {
    id: string,
    BrandId: string,
    CategoryId: string,
    name: string,
    gender: GenderEnum,
    description: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string,
    Category: CategoryType,
    Brand: BrandType,
    products: ProductType[],
}

export enum GenderEnum {
    "MALE" = "male",
    "FEMALE" = "female",
}
