import express from "express";
import modelsRoutes from "../routes/modelsRoutes.js";
import Model from "../models/postgres-model.js";
import { ObjectId } from "mongodb";
const {
	getModels,
	createModel,
	updateModel,
	deleteModel,
	getModel,
} = modelsRoutes(Model, ObjectId);

const router = express.Router();

router.get("/", getModels);
router.get("/:id", getModel);
router.post("/", createModel);
router.patch("/:id", updateModel);
router.delete("/:id", deleteModel);

export default router;
