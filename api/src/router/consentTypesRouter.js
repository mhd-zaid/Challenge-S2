import express from "express";
import consentTypesRoutes from "../routes/consentTypesRoutes.js";
import ConsentType from "../models/postgres-consentType.js";
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
router.post("/", createConsentType);
router.put("/:id", updateConsentType);
router.delete("/:id", deleteConsentType);

export default router;