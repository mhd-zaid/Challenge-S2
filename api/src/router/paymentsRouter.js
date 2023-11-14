import express from "express";
import paymentsRoutes from "../routes/paymentsRoutes.js";
import Payment from "../models/postgres-payment.js";
import Order from "../models/postgres-order.js";
import User from "../models/postgres-user.js"
import stripe from "../config/stripe-config.js";
import OrderMongodb from "../models/mongodb-order.js";
import { ObjectId } from "mongodb";
const { 
    getPayments,
    getStripeSession,
    getPayment,
    createPayment,
    stripeSuccess,
    stripeFailed
} = paymentsRoutes(Payment, Order, User, stripe, OrderMongodb, ObjectId)

const router = express.Router();

router.get("/", getPayments);
router.get("/success", stripeSuccess);
router.get("/failed", stripeFailed);
router.get("/session/:session", getStripeSession);
router.get("/:id", getPayment);
router.post("/", createPayment);

export default router;
