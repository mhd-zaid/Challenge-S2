import express from "express";
import ProductHistory from "../models/mongodb-productHistory.js";
import Product from "../models/postgres-product.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import storeKeeperOrAdminMiddleware from "../middlewares/storeKeeperOrAdminMiddleware.js";
import stocksRoutes from "../routes/stocksRoutes.js";

const { getProductHistory, updateProductStocks } = stocksRoutes(
	Product,
	ProductHistory
);

const router = express.Router();

router.get(
	"/:id",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getProductHistory
);
router.patch(
	"/:id",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	updateProductStocks
);

export default router;
