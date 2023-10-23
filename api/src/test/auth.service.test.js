import { generateToken, isUserBlocked } from "../services/auth.service";

describe("generateToken", () => {
    it("should generate a token with 6 characters", () => {
        const token = generateToken();

        expect(token).toHaveLength(6);
        expect(/^[0-9A-Z]+$/.test(token)).toBe(true);
    });

    it("should generate a different token on each call", () => {
        const token1 = generateToken();
        const token2 = generateToken();

        expect(token1).not.toEqual(token2);
    });
});

describe("isUserBlocked", () => {
    const nonBlockedUser = { loginAttempts: 0, blockedAt: null };
    const blockedUser = { loginAttempts: 3, blockedAt: new Date() };

    it("should return false for a non-blocked user", () => {
        const result = isUserBlocked(nonBlockedUser);
        expect(result).toBe(false);
    });

    it("should return true for a blocked user", () => {
        const result = isUserBlocked(blockedUser);
        expect(result).toBe(true);
    });

    it("should return false for a previously blocked user with expired blocking", () => {
        const FIFTEEN_MINUTES = 15 * 60 * 1000;
        const expiredBlockedUser = { loginAttempts: 3, blockedAt: new Date() - FIFTEEN_MINUTES - 1 };
        const result = isUserBlocked(expiredBlockedUser);
        expect(result).toBe(false);
    });

    it("should return false for a user with fewer login attempts", () => {
        const userWithFewerAttempts = { loginAttempts: 2, blockedAt: null };
        const result = isUserBlocked(userWithFewerAttempts);
        expect(result).toBe(false);
    });

    it("should return false for a user with recent blocking but fewer login attempts", () => {
        const userWithRecentBlocking = {
            loginAttempts: 2,
            blockedAt: new Date(),
        };
        const result = isUserBlocked(userWithRecentBlocking);
        expect(result).toBe(false);
    });
});
