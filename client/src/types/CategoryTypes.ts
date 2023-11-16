import type {ModelType} from "./ModelType";

export type CategoryType = {
    createdAt: string;
    deletedAt: string;
    description: string;
    id: string;
    models: ModelType[];
    name: string;
    updatedAt: string;
}
