export type ModelType = {
    id: string;
    name: string;
    description: string;
    gender: GenderEnum;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    CategoryId: number;
    BrandId: number;
}

export enum GenderEnum {
    "MALE" = "male",
    "FEMALE" = "female",
}
