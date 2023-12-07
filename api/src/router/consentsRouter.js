import express from "express";
import consentsRoutes from "../routes/consentsRoutes.js";
import Consent from "../models/postgres-consent.js";
import ConsentType from "../models/postgres-consentType.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
const {
	getConsents,
	getConsent,
	getUserConsents,
	createConsent,
	updateConsent,
	addConsentType,
	removeConsentType,
} = consentsRoutes(Consent, ConsentType);

const router = express.Router();

router.get("/", getConsents);
router.get("/:id", getConsent);
router.get("/user/:userId", getUserConsents);
router.post("/", authMiddleware, adminMiddleware, createConsent);
router.patch("/:id", authMiddleware, adminMiddleware, updateConsent);
router.patch("/:id/addConsentType", authMiddleware, adminMiddleware, addConsentType);
router.patch("/:id/removeConsentType", authMiddleware, adminMiddleware, removeConsentType);

export default router;
