import express from "express";
import authRoutes from "../routes/authRoutes.js";
import User from "../models/postgres-user.js";
import Consent from "../models/postgres-consent.js";
import UserMongo from "../models/mongodb-user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {generateToken, isUserBlocked} from "../services/auth.service.js";
import {sendBlockedAccountEmail, sendEmailConfirmation, sendResetPasswordEmail,} from "../services/email.service.js";
import {isUserMajor, isValidPassword} from "../services/user.service.js";
import {Types} from "mongoose";
import authMiddleware from "../middlewares/authMiddleware.js";

const {
    register,
    login,
    confirmEmail,
    getMe,
    checkIfAdmin,
    checkIfUser,
    checkEmail,
    requestPasswordReset,
    resetPassword,
} = authRoutes(User, UserMongo, jwt, bcrypt,Consent, generateToken, sendEmailConfirmation, isUserBlocked, isValidPassword, isUserMajor, sendBlockedAccountEmail, sendResetPasswordEmail, Types);

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/confirm", confirmEmail);
router.get("/me", authMiddleware, getMe);
router.get("/check-if-admin", authMiddleware, checkIfAdmin);
router.get("/check-if-authenticated", authMiddleware, checkIfUser);
router.get("/check-email", checkEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


export default router;
