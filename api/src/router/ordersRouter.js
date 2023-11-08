import express from "express";
import ordersRoutes from "../routes/ordersRoutes.js";
import Order from "../models/postgres-order.js";
import OrderMongodb from "../models/mongodb-order.js";
import User from "../models/postgres-user.js";
import ProductMongoDB from "../models/mongodb-product.js";
import ModelMongodb from "../models/mongodb-model.js";
import BrandMongodb from "../models/mongodb-brand.js";
import CategoryMongodb from "../models/mongodb-category.js";
import { ObjectId } from "mongodb";
const { 
    getOrders,
    getUserOrders,
    getOrder,
    createOrder,
    updateOrder,
} =  ordersRoutes(Order, OrderMongodb, User, ProductMongoDB, ModelMongodb, BrandMongodb, CategoryMongodb, ObjectId);

const router = express.Router();

router.get("/", getOrders);
router.get("/user/:id", getUserOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id", updateOrder);

export default router;
