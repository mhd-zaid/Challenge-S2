import express from "express";
import brandsRoutes from "../routes/brandsRoutes.js";
import Brand from "../models/postgres-brand.js";
import { ObjectId } from "mongodb";
const { getBrands, createBrand, updateBrand, deleteBrand, getBrand } =
	brandsRoutes(Brand, ObjectId);

const router = express.Router();

router.get("/", getBrands);
router.get("/:id", getBrand);
router.post("/", createBrand);
router.patch("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;
