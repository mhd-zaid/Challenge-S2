import express from "express";
import categoriesRoutes from "../routes/categoriesRoutes.js";
import Category from "../models/postgres-category.js";
import { ObjectId } from "mongodb";
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
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
