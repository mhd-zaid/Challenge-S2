import express from "express";
import brandsRoutes from "../routes/brandsRoutes.js";
import Brand from "../models/postgres-brand.js";
import { ObjectId } from "mongodb";
import authMiddleware from "../middlewares/authMiddleware.js";
import storeKeeperOrAdminMiddleware from "../middlewares/storeKeeperOrAdminMiddleware.js";
const { getBrands, createBrand, updateBrand, deleteBrand, getBrand } =
	brandsRoutes(Brand, ObjectId);

const router = express.Router();

router.get("/", getBrands);
router.get("/:id", getBrand);
router.post("/", authMiddleware, storeKeeperOrAdminMiddleware, createBrand);
router.patch("/:id", authMiddleware, storeKeeperOrAdminMiddleware, updateBrand);
router.delete("/:id", authMiddleware, storeKeeperOrAdminMiddleware, deleteBrand);

export default router;
