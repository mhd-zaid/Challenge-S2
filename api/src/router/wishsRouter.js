import express from "express";
import wishsRoutes from "../routes/wishsRoutes.js";
import Wish from "../models/postgres-wish.js";
import Product from "../models/postgres-product.js";
import Product_Images from "../models/postgres-product-images.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const { getUserWish, addProductToWish, deleteProductFromWish } = wishsRoutes(
	Wish,
	Product,
	Product_Images
);

const router = express.Router();

router.get("/:id", authMiddleware, getUserWish);
router.post("/:userId", authMiddleware, addProductToWish);
router.delete("/:userId/:productId", authMiddleware, deleteProductFromWish);

export default router;
