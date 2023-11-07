import express from "express";
import { 
    getOrders,
    getUserOrders,
    getOrder,
    createOrder,
    updateOrder,
} from "../routes/orderRoutes.js";

const router = express.Router();

router.get("/", getOrders);
router.get("/user/:id", getUserOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id", updateOrder);

export default router;
