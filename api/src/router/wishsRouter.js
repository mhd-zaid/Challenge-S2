import express from "express";
import wishsRoutes from "../routes/wishsRoutes.js";
import Wish from "../models/postgres-wish.js";
import Product from "../models/postgres-product.js";
const { getUserWish, addProductToWish, deleteProductFromWish } = wishsRoutes(
	Wish,
	Product
);

const router = express.Router();

router.get("/:id", getUserWish);
router.post("/:userId", addProductToWish);
router.delete("/:userId/:productId", deleteProductFromWish);

export default router;
