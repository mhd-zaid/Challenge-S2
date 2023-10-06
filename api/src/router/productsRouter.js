import express from "express";
import {
	getProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
} from "../routes/productsRoutes.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
