import express from "express";
import { getNewUsers } from "../routes/statsRoutes.js";

const router = express.Router();

router.post("/registrations", getNewUsers);

export default router;
