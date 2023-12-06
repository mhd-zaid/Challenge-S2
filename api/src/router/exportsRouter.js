import express from "express";
import exportsRoutes from "../routes/exportsRoutes.js";
import Export from "../models/mongodb-export.js";
import { createExport, exportData, exportPersonalData } from "../services/exports.service.js";
import { dataToCSV } from "../lib/dataToCSV.js";
import path from "path";
import fs from "fs";
import authMiddleware from "../middlewares/authMiddleware.js";
import storeKeeperOrAdminMiddleware from "../middlewares/storeKeeperOrAdminMiddleware.js";
import User from "../models/postgres-user.js";
const {
	requestExport,
	personalDataExport,
	getExports,
	getExport,
	removeExport,
} = exportsRoutes(exportData, exportPersonalData, Export, dataToCSV, path, fs, User, createExport);

const router = express.Router();

router.get("/", authMiddleware, storeKeeperOrAdminMiddleware, getExports);
router.get("/:id", authMiddleware, storeKeeperOrAdminMiddleware, getExport);
router.post("/", authMiddleware, storeKeeperOrAdminMiddleware, requestExport);
router.post("/:id", authMiddleware, personalDataExport);
router.delete("/:id", authMiddleware, storeKeeperOrAdminMiddleware, removeExport);

export default router;
