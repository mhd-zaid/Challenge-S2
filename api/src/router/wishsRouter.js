import express from "express";
import wishsRoutes from "../routes/wishsRoutes.js";
import Wish from "../models/postgres-wish.js";
const { getUserWish, addProductToWish, deleteProductFromWish} = wishsRoutes(Wish);

const router = express.Router();

router.get("/:id", getUserWish);
router.post("/:userId", addProductToWish);
router.delete("/:userId", deleteProductFromWish);

export default router;
