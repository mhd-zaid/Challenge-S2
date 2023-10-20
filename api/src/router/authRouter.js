import express from "express";
import {
    register,
    login,
    logout,
    confirmEmail,
    getMe,
    checkEmail
} from "../routes/authRoutes.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/confirm", confirmEmail);
router.get("/me", authMiddleware, getMe);
router.get("/check-email", checkEmail);


export default router;
