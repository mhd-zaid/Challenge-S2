import Product from "../models/postgres-product.js";
import Modele from "../models/postgres-model.js";
import Product_Images from "../models/postgres-product-images.js";
import ProductMongodb from "../models/mongodb-product.js";
import mongoose from "mongoose";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll(({
            include: [{
                model: Modele,
                as: 'Modele'
            }, {
                model: Product_Images,
                as: 'Product_Images'
            }]
        }));
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: `An error occurred while retrieving the products : ${error.message}`,
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const productDataToCreate = {
            name: req.body.name,
            price: req.body.price,
            vat: req.body.vat,
            quantity: req.body.quantity,
            size: req.body.size,
            color: req.body.color,
            sku: req.body.sku,
            modelId: req.body.model,
        };
        const productMongoDB = await ProductMongodb(productDataToCreate).save();
        const id = productMongoDB._id.toString();
        const product = await Product.create({id, ...req.body, ModelId: req.body.model});
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: `An error occurred while creating the product : ${error.message}`,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;

        const models = req.body.models.map(model => new mongoose.Types.ObjectId(model.id));

        const productDataToUpdate = {
            name: req.body.name,
            price: req.body.price,
            vat: req.body.vat,
            quantity: req.body.quantity,
            size: req.body.size,
            color: req.body.color,
            sku: req.body.sku,
            models: models,
        };

        if (!id) {
            return res.status(400).json({message: "Id parameter is missing"});
        }

        const product = await Product.findOne({where: {id}});
        const productMongo = await ProductMongodb.findOne({_id: id});

        if (!product) return res.status(404).json({message: "Product not found"});

        await product.update(req.body);
        await productMongo.updateOne(productDataToUpdate);

        res.json({message: "Product updated successfully"});
    } catch (error) {
        res.status(500).json({
            message: `An error occurred while updating the product : ${error.message}`,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: "Id parameter is missing"});
        }

        const product = await Product.findOne({where: {id}});
        const productMongo = await ProductMongodb.findOne({_id: id});

        if (!product) return res.status(404).json({message: "Product not found"});

        await product.destroy();
        await productMongo.updateOne({deletedAt: Date.now()});

        res.json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: `An error occurred while deleting the product : ${error.message}`,
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: "Id parameter is missing"});
        }

        const product = await Product.findOne({
            where: {id},
            include: [{
                model: Modele,
                as: 'Modele'
            }, {
                model: Product_Images,
                as: 'Product_Images'
            }]
        });

        if (!product) return res.status(404).json({message: "Product not found"});

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: `An error occurred while retrieving the product : ${error.message}`,
        });
    }
};

export const uploadImage = async (req, res) => {
    const {id} = req.params;
    const images = req.files.map(file => file.filename);
    for (const image of images) {
        await Product_Images.create({url: image, ProductId: id});
    }
    res.status(200).json({message: "Image uploaded successfully"});
};
