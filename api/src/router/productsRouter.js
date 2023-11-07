import express from "express";
import {
	getProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
	uploadImage
} from "../routes/productsRoutes.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/upload", uploadImage)

export default router;
