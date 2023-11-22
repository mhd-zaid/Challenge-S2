import express from "express";
import productsRoutes from "../routes/productsRoutes.js";
import Product from "../models/postgres-product.js";
import Model from "../models/postgres-model.js";
import Product_Images from "../models/postgres-product-images.js";
import ProductMongodb from "../models/mongodb-product.js";
import {ObjectId} from "mongodb";
import { Op } from 'sequelize';
const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    uploadImage,
} = productsRoutes(Product, Model, Product_Images, ProductMongodb, ObjectId, Op);

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), './uploads/images'))
    },
    filename: function (req, file, cb) {
        const originalName = encodeURIComponent(path.parse(file.originalname).name).replace(/[^a-zA-Z0-9]/g, '')
        const timestamp = Date.now()
        const extension = path.extname(file.originalname).toLowerCase()
        cb(null, originalName + '_' + timestamp + extension)
    }
})


const upload = multer({
    storage: storage,
    limits: {fileSize: 1 * 1024 * 1024}, // 1 Mb
    fileFilter: (req, file, callback) => {
        const acceptableExtensions = ['png', 'jpg', 'jpeg', 'jpg']
        if (!(acceptableExtensions.some(extension =>
                path.extname(file.originalname).toLowerCase() === `.${extension}`)
        )) {
            return callback(new Error(`Extension not allowed, accepted extensions are ${acceptableExtensions.join(',')}`))
        }
        callback(null, true)
    }
})

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/upload/:id", upload.array('image', 4), uploadImage)

export default router;
