import express from "express";
import {
	getNewUsersBeforeLast30Days,
	getNewUsersLast30Days,
	getNewUsersLastYear,
	getNewProductsBeforeLast30Days,
	getNewProductsLast30Days,
	getNewProductsLastYear,
    getLastMonths,
} from "../routes/statsRoutes.js";

const router = express.Router();

router.get("/months", getLastMonths);
router.get("/registrations/last-30-days", getNewUsersLast30Days);
router.get("/registrations/before-last-30-days", getNewUsersBeforeLast30Days);
router.get("/registrations/last-year", getNewUsersLastYear);
router.get("/products/last-30-days", getNewProductsLast30Days);
router.get("/products/before-last-30-days", getNewProductsBeforeLast30Days);
router.get("/products/last-year", getNewProductsLastYear);

export default router;
