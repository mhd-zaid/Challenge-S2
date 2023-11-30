import express from "express";
import exportsRoutes from "../routes/exportsRoutes.js";
import Export from "../models/mongodb-export.js";
import { exportData, exportPersonalData } from "../services/exports.service.js";
import { dataToCSV } from "../lib/dataToCSV.js";
import path from "path";
import fs from "fs";
const {
	requestExport,
	personalDataExport,
	getExports,
	getExport,
	removeExport,
} = exportsRoutes(exportData, exportPersonalData, Export, dataToCSV, path, fs);

const router = express.Router();

router.get("/", getExports);
router.get("/:id", getExport);
router.post("/", requestExport);
router.post("/:id", personalDataExport);
router.delete("/:id", removeExport);

export default router;
