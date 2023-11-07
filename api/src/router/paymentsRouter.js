import express from "express";
import { 
    getPayments,
    getStripeSession,
    getPayment,
    createPayment,
    stripeSuccess,
    stripeFailed
} from "../routes/paymentRoutes.js";

const router = express.Router();

router.get("/", getPayments);
router.get("/success", stripeSuccess);
router.get("/failed", stripeFailed);
router.get("/session/:session", getStripeSession);
router.get("/:id", getPayment);
router.post("/", createPayment);

export default router;
