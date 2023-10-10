import Product from "../models/postgres-product.js";
import ProductMongodb from "../models/mongodb-product.js";
import mongoose from "mongoose";

export const getProducts = async (req, res) => {
	try {
		const products = await Product.findAll({
			include: "models",
		});
		res.json(products);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the products : ${error}`,
		});
	}
};

export const createProduct = async (req, res) => {
	try {
		const file = req.files !== undefined ? req.files.image : null;
		if (file) {
			req.body.url = `../uploads/images/${file.name}`;
			file.mv(path, async (error) => {
				if (error) {
					console.error(error);
					return res.status(500).json({ message: "Error uploading image" });
				}
			});
		}
		const models = req.body.models.map(model => new mongoose.Types.ObjectId(model.id));
		
		const productDataToCreate = {
			name: req.body.name,
			price: req.body.price,
			vat: req.body.vat,
			quantity: req.body.quantity,
			size: req.body.size,
			color: req.body.color,
			url: req.body.url,
			models: models,
		};
		const productMongoDB = await ProductMongodb(productDataToCreate).save();
		const id = productMongoDB._id.toString();
		const product = await Product.create({ id, ...req.body });
		for (const model of req.body.models) {
			await product.addModels(model.id);
		}

		res.json(product);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while creating the product : ${error}`,
		});
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const file = req.files.image;
		if (file) {
			req.body.url = `../uploads/images/${file.name}`;
		}
		
		file.mv(path, async (error) => {
			if (error) {
				console.error(error);
				return res.status(500).json({ message: "Error uploading image" });
			}
		});

		const productDataToUpdate = req.body;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const product = await Product.findOne({ where: { id } });
		const productMongo = await ProductMongodb.findOne({ _id: id });

		if (!product) return res.status(404).json({ message: "Product not found" });

		await product.update(productDataToUpdate);
		await productMongo.updateOne(productDataToUpdate);

		res.json({ message: "Product updated successfully" });
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while updating the product : ${error}`,
		});
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const product = await Product.findOne({ where: { id } });
		const productMongo = await ProductMongodb.findOne({ _id: id });

		if (!product) return res.status(404).json({ message: "Product not found" });

		await product.destroy();
		await productMongo.updateOne({ deletedAt: Date.now() });
		
		res.json({
			message: "Product deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while deleting the product : ${error}`,
		});
	}
};

export const getProduct = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const product = await Product.findOne({
			where: { id },
			include: "models",
		});

		if (!product) return res.status(404).json({ message: "Product not found" });

		res.json(product);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the product : ${error}`,
		});
	}
};
