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
router.get("/session/:session", getStripeSession);
router.get("/:id", getPayment);
router.post("/", createPayment);
router.put("/sucess/:id", stripeSuccess);
router.put("/failed/:id", stripeFailed);

export default router;
