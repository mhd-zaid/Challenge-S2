import express from "express";
import userRoutes from "../routes/usersRoutes.js";
import User from "../models/postgres-user.js";
import UserMongo from "../models/mongodb-user.js";
import { sendDeletedAccountEmail } from "../services/email.service.js";
import {
	isValidPassword,
	anonymizeUserData,
	generateEncryptionKey,
	decryptUserData,
	isUserMajor,
} from "../services/user.service.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/auth.service.js";
import { Types } from "mongoose";
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    recoverUser,
    updatePassword,
} = userRoutes(User, UserMongo, bcrypt, isValidPassword, anonymizeUserData, generateEncryptionKey, sendDeletedAccountEmail, Types, decryptUserData, isUserMajor, generateToken);

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.patch("/:id/password", updatePassword);
router.delete("/:id", deleteUser);
router.post("/recover/:id", recoverUser);

export default router;
