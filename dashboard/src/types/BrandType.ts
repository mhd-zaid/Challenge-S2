import type {ModelType} from "./ModelType";

export type BrandType = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    models: ModelType[];
}