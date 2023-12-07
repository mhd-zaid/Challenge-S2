import express from "express";
import paymentsRoutes from "../routes/paymentsRoutes.js";
import Payment from "../models/postgres-payment.js";
import Order from "../models/postgres-order.js";
import User from "../models/postgres-user.js";
import stripe from "../config/stripe-config.js";
import OrderMongodb from "../models/mongodb-order.js";
import { ObjectId } from "mongodb";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
const {
	getPayments,
	getStripeSession,
	getPayment,
	createPayment,
	stripeSuccess,
	stripeFailed,
} = paymentsRoutes(Payment, Order, User, stripe, OrderMongodb, ObjectId);

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getPayments);
router.post("/success", stripeSuccess);
router.post("/failed", stripeFailed);
router.get("/session/:session", authMiddleware, getStripeSession);
router.get("/:id", authMiddleware, getPayment);
router.post("/", authMiddleware, createPayment);

export default router;
