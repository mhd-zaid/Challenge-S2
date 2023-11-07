import express from "express";
import {
	getModels,
	createModel,
	updateModel,
	deleteModel,
	getModel,
} from "../routes/modelsRoutes.js";

const router = express.Router();

router.get("/", getModels);
router.get("/:id", getModel);
router.post("/", createModel);
router.patch("/:id", updateModel);
router.delete("/:id", deleteModel);

export default router;
