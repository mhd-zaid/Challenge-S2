import Product from "../models/postgres-product.js";

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
		const product = await Product.create(req.body);
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
		const productDataToUpdate = req.body;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const product = await Product.findOne({ where: { id } });

		if (!product) return res.status(404).json({ message: "Product not found" });

		await product.update(productDataToUpdate);
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

		if (!product) return res.status(404).json({ message: "Product not found" });

		await product.destroy();

		res.json({
			message: "Product deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while deleting the product : ${error}`,
		});
	}
};
