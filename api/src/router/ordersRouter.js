import express from "express";
import ordersRoutes from "../routes/ordersRoutes.js";
import Order from "../models/postgres-order.js";
import OrderMongodb from "../models/mongodb-order.js";
import User from "../models/postgres-user.js";
import UserMongodb from "../models/mongodb-user.js";
import ProductMongoDB from "../models/mongodb-product.js";
import Product from "../models/postgres-product.js";
import { ObjectId } from "mongodb";
import authMiddleware from "../middlewares/authMiddleware.js";
import storeKeeperOrAdminMiddleware from "../middlewares/storeKeeperOrAdminMiddleware.js";
import { Op } from "sequelize";

const { getOrders, getUserOrders, getOrder, createOrder, updateOrder } =
	ordersRoutes(
		Order,
		OrderMongodb,
		User,
		UserMongodb,
		ProductMongoDB,
		Product,
		ObjectId,
		Op,
	);

const router = express.Router();

router.get("/", authMiddleware, storeKeeperOrAdminMiddleware, getOrders);
router.get("/user/:id", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrder);
router.post("/", authMiddleware, createOrder);
router.patch("/:id", authMiddleware, updateOrder);

export default router;
