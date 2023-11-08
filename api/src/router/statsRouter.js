import express from "express";
import statsRoutes from "../routes/statsRoutes.js";
import User from "../models/mongodb-user.js";
import ProductHistory from "../models/mongodb-productHistory.js";
import months from "../lib/monthsForStats.js";
import Order from "../models/mongodb-order.js";
const {
	getNewUsersBeforeLast30Days,
	getNewUsersLast30Days,
	getNewUsersLastYear,
	getNewProductsBeforeLast30Days,
	getNewProductsLast30Days,
	getNewProductsLastYear,
	getLastMonths,
	getNewOrdersLast30Days,
	getNewOrdersBeforeLast30Days,
	getNewOrdersLastYear,
} = statsRoutes(User, ProductHistory, months, Order);

const router = express.Router();

router.get("/months", getLastMonths);
router.get("/registrations/last-30-days", getNewUsersLast30Days);
router.get("/registrations/before-last-30-days", getNewUsersBeforeLast30Days);
router.get("/registrations/last-year", getNewUsersLastYear);
router.get("/products/last-30-days", getNewProductsLast30Days);
router.get("/products/before-last-30-days", getNewProductsBeforeLast30Days);
router.get("/products/last-year", getNewProductsLastYear);
router.get("/orders/last-30-days", getNewOrdersLast30Days);
router.get("/orders/before-last-30-days", getNewOrdersBeforeLast30Days);
router.get("/orders/last-year", getNewOrdersLastYear);

export default router;
