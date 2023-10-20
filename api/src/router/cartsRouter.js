import express from "express";
import { getUserCart, addProductToCart, deleteProductFromCart} from '../routes/cartsRoutes.js';

const router = express.Router();

router.get("/:id", getUserCart);
router.post("/:userId", addProductToCart);
router.delete("/:userId", deleteProductFromCart);

export default router;
