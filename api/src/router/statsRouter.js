import express from "express";
import { getNewUsersBeforeLast30Days, getNewUsersLast30Days, getNewUsersLastYear } from "../routes/statsRoutes.js";

const router = express.Router();

router.get("/registrations/last-30-days", getNewUsersLast30Days);
router.get("/registrations/before-last-30-days", getNewUsersBeforeLast30Days);
router.get("/registrations/last-year", getNewUsersLastYear);

export default router;
