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
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { dataToCSV } from "../lib/dataToCSV.js";
import { createExport } from "../services/exports.service.js";
const {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	getUser,
	recoverUser,
	updatePassword,
} = userRoutes(
	User,
	UserMongo,
	bcrypt,
	isValidPassword,
	anonymizeUserData,
	generateEncryptionKey,
	sendDeletedAccountEmail,
	Types,
	decryptUserData,
	isUserMajor,
	generateToken,
	dataToCSV,
	createExport
);

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getUsers);
router.post("/", authMiddleware, adminMiddleware, createUser);
router.get("/:id", authMiddleware, getUser);
router.patch("/:id", authMiddleware, updateUser);
router.patch("/:id/password", authMiddleware, updatePassword);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/recover/:id", recoverUser);

export default router;
