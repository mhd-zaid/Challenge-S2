import type {ModelType} from "./ModelTypes";

export type CategoryType = {
    createdAt: string;
    deletedAt: string;
    description: string;
    id: string;
    models: ModelType[];
    name: string;
    updatedAt: string;
}
