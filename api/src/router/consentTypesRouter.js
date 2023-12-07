import express from "express";
import consentTypesRoutes from "../routes/consentTypesRoutes.js";
import ConsentType from "../models/postgres-consentType.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
const {
	getConsentTypes,
	getConsentType,
	createConsentType,
	updateConsentType,
	deleteConsentType,
} = consentTypesRoutes(ConsentType);

const router = express.Router();

router.get("/", getConsentTypes);
router.get("/:id", getConsentType);
router.post("/", authMiddleware, adminMiddleware, createConsentType);
router.patch("/:id", authMiddleware, adminMiddleware, updateConsentType);
router.delete("/:id", authMiddleware, adminMiddleware, deleteConsentType);

export default router;
