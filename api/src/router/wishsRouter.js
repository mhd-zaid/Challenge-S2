import express from "express";
import { getUserWish, addProductToWish, deleteProductFromWish} from '../routes/wishsRoutes.js';

const router = express.Router();

router.get("/:id", getUserWish);
router.post("/:userId", addProductToWish);
router.delete("/:userId", deleteProductFromWish);

export default router;
