import express from "express";
import productsRoutes from "../routes/productsRoutes.js";
import Product from "../models/postgres-product.js";
import ProductMongodb from "../models/mongodb-product.js";
import Model from "../models/postgres-model.js";
import mongoose from "mongoose";
import { json } from "sequelize";
const {
	getProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
	uploadImage
} = productsRoutes(Product, ProductMongodb, Model,mongoose, json);

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/upload", uploadImage)

export default router;
