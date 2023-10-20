import {
    anonymizeUserData,
    isValidPassword,
    decryptUserData,
} from "../services/user.service.js";

const encryptionKey = "testEncryptionKey";

describe("isValidPassword", () => {
    it("should return true for a valid password", () => {
        const validPasswords = ["AValidPassword123#", "StrongP@ssw0rd!123"];

        for (const password of validPasswords) {
            const result = isValidPassword(password);
            expect(result).toBe(true);
        }
    });

    it("should return false for a password that is too short", () => {
        const invalidPasswords = ["Short1!"];

        for (const password of invalidPasswords) {
            const result = isValidPassword(password);
            expect(result).toBe(false);
        }
    });

    it("should return false for a password without uppercase letters", () => {
        const invalidPasswords = ["lowercase1!@", "alllowercase!@"];

        for (const password of invalidPasswords) {
            const result = isValidPassword(password);
            expect(result).toBe(false);
        }
    });

    it("should return false for a password without lowercase letters", () => {
        const invalidPasswords = ["UPPERCASE1!@", "ALLUPPERCASE!@"];

        for (const password of invalidPasswords) {
            const result = isValidPassword(password);
            expect(result).toBe(false);
        }
    });

    it("should return false for a password without numbers", () => {
        const invalidPasswords = ["NoNumbers!@", "NoDigits#$%^&*"];

        for (const password of invalidPasswords) {
            const result = isValidPassword(password);
            expect(result).toBe(false);
        }
    });

    it("should return false for a password without special characters", () => {
        const invalidPasswords = ["NoSpecial123", "NoSpecialChars456"];

        for (const password of invalidPasswords) {
            const result = isValidPassword(password);
            expect(result).toBe(false);
        }
    });
});

describe("anonymizeUserData", () => {
    it("should anonymize user data", async () => {
        const user = {
            id: 1,
            firstname: "John",
            lastname: "Doe",
            email: "johndoe@example.com",
            password: "AValidPassword123#",
        };

        // anonymizeUserData
        const anonymizedData = anonymizeUserData(user, encryptionKey);

        expect(anonymizedData.firstname).not.toBe(user.firstname);
        expect(anonymizedData.lastname).not.toBe(user.lastname);
        expect(anonymizedData.email).not.toBe(user.email);

        const anonymizedUser = {}
        for (const key of Object.keys(anonymizedData)) {
            anonymizedUser[key] = anonymizedData[key];
        }

        // decryptUserData
        const decryptedData = decryptUserData(anonymizedUser, encryptionKey);

        expect(decryptedData.firstname).toBe(user.firstname);
        expect(decryptedData.lastname).toBe(user.lastname);
        expect(decryptedData.email).toBe(user.email);
    });
});
