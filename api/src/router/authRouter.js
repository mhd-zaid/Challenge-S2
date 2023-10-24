import express from "express";
import {
    register,
    login,
    confirmEmail,
    getMe,
    checkEmail,
    requestPasswordReset,
    resetPassword,
} from "../routes/authRoutes.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/confirm", confirmEmail);
router.get("/me", authMiddleware, getMe);
router.get("/check-email", checkEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


export default router;
