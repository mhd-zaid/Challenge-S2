export type UserType = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordResetToken: string;
    passwordUpdatedAt: string;
    birthdate: string;
    role: RoleEnum;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    loginAttempts: number;
    blockedAt: string;
    isValidate: boolean;
    authentificationToken: string;
    disabled: boolean;
    encryptionKey: string;
    createdAt: string;
    updatedAt: string;
}

export enum RoleEnum {
    "ROLE_ADMIN" = "ROLE_ADMIN",
    "ROLE_USER" = "ROLE_USER",
    "ROLE_STORE_KEEPER" = "ROLE_STORE_KEEPER"
}