import express from "express";
import statsRoutes from "../routes/statsRoutes.js";
import User from "../models/mongodb-user.js";
import ProductHistory from "../models/mongodb-productHistory.js";
import months from "../lib/monthsForStats.js";
import Order from "../models/mongodb-order.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import storeKeeperOrAdminMiddleware from "../middlewares/storeKeeperOrAdminMiddleware.js";
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

router.get(
	"/months",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getLastMonths
);
router.get(
	"/registrations/last-30-days",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getNewUsersLast30Days
);
router.get(
	"/registrations/before-last-30-days",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getNewUsersBeforeLast30Days
);
router.get(
	"/registrations/last-year",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getNewUsersLastYear
);
router.get(
	"/products/last-30-days",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getNewProductsLast30Days
);
router.get(
	"/products/before-last-30-days",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getNewProductsBeforeLast30Days
);
router.get(
	"/products/last-year",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getNewProductsLastYear
);
router.get(
	"/orders/last-30-days",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getNewOrdersLast30Days
);
router.get(
	"/orders/before-last-30-days",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getNewOrdersBeforeLast30Days
);
router.get(
	"/orders/last-year",
	authMiddleware,
	storeKeeperOrAdminMiddleware,
	getNewOrdersLastYear
);

export default router;
