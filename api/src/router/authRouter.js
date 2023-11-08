import express from "express";
import authRoutes from "../routes/authRoutes.js";
import User from "../models/postgres-user.js";
import UserMongo from "../models/mongodb-user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken, isUserBlocked } from "../services/auth.service.js";
import {
	sendEmailConfirmation,
	sendBlockedAccountEmail,
	sendResetPasswordEmail,
} from "../services/email.service.js";
import { isValidPassword, isUserMajor } from "../services/user.service.js";
import { Types } from "mongoose";
const {
    register,
    login,
    confirmEmail,
    getMe,
    checkEmail,
    requestPasswordReset,
    resetPassword,
} = authRoutes(User, UserMongo, jwt, bcrypt, generateToken, sendEmailConfirmation, isUserBlocked, isValidPassword, isUserMajor, sendBlockedAccountEmail, sendResetPasswordEmail, Types);
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
