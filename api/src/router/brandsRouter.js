import express from "express";
import {
	getBrands,
	createBrand,
	updateBrand,
	deleteBrand,
	getBrand
} from "../routes/brandsRoutes.js";

const router = express.Router();

router.get("/", getBrands);
router.get("/:id", getBrand);
router.post("/", createBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;
