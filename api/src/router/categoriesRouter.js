import express from "express";
import categoriesRoutes from "../routes/categoriesRoutes.js";
import Category from "../models/postgres-category.js";
import { ObjectId } from "mongodb";
import authMiddleware from "../middlewares/authMiddleware.js";
import storeKeeperOrAdminMiddleware from "../middlewares/storeKeeperOrAdminMiddleware.js";
const {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	getCategory,
} = categoriesRoutes(Category, ObjectId);

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", authMiddleware, storeKeeperOrAdminMiddleware, createCategory);
router.patch("/:id", authMiddleware, storeKeeperOrAdminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, storeKeeperOrAdminMiddleware, deleteCategory);

export default router;
