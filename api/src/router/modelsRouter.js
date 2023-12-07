import express from "express";
import modelsRoutes from "../routes/modelsRoutes.js";
import Model from "../models/postgres-model.js";
import { ObjectId } from "mongodb";
import authMiddleware from "../middlewares/authMiddleware.js";
import storeKeeperOrAdminMiddleware from "../middlewares/storeKeeperOrAdminMiddleware.js";
const { getModels, createModel, updateModel, deleteModel, getModel } =
	modelsRoutes(Model, ObjectId);

const router = express.Router();

router.get("/", getModels);
router.get("/:id", getModel);
router.post("/", authMiddleware, storeKeeperOrAdminMiddleware, createModel);
router.patch("/:id", authMiddleware, storeKeeperOrAdminMiddleware, updateModel);
router.delete("/:id", authMiddleware, storeKeeperOrAdminMiddleware, deleteModel);

export default router;
