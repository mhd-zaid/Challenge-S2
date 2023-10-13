import express from "express";
import {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	getCategory,
} from "../routes/categoriesRoutes.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
