export default (Product, ProductMongodb, Model,mongoose, json) => ({
	getProducts: async (req, res) => {
		try {
			const products = await Product.findAll({
				include: "model",
			});
			res.json(products);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the products : ${error.message}`,
			});
		}
	},

	createProduct: async (req, res) => {
		try {
			const model = await Model.findOne({where: {id: req.body.modelId}});

			const productDataToCreate = {
				name: req.body.name,
				price: req.body.price,
				vat: req.body.vat,
				quantity: req.body.quantity,
				size: req.body.size,
				color: req.body.color,
				discount: req.body.discount,
				alerteQuantity: req.body.alerteQuantity,
				sku: req.body.sku,
				modelId: model.id,
			};
			const productMongoDB = await ProductMongodb(productDataToCreate).save();
			const id = productMongoDB._id.toString();
			const product = await Product.create({ id, ...req.body });

			res.json(product);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while creating the product : ${error.message}`,
			});
		}
	},

	updateProduct: async (req, res) => {
		try {
			const { id } = req.params;

			const model = await Model.findOne({where: {id: req.body.modelId}});

			const productDataToUpdate = {
				name: req.body.name,
				price: req.body.price,
				vat: req.body.vat,
				quantity: req.body.quantity,
				size: req.body.size,
				color: req.body.color,
				discount: req.body.discount,
				alerteQuantity: req.body.alerteQuantity,
				sku: req.body.sku,
				modelId: model.id,
			};

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const product = await Product.findOne({ where: { id } });
			const productMongo = await ProductMongodb.findOne({ _id: id });

			if (!product)
				return res.status(404).json({ message: "Product not found" });

			await product.update(req.body);
			await productMongo.updateOne(productDataToUpdate);

			res.json({ message: "Product updated successfully" });
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while updating the product : ${error.message}`,
			});
		}
	},

	deleteProduct: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const product = await Product.findOne({ where: { id } });
			const productMongo = await ProductMongodb.findOne({ _id: id });

			if (!product)
				return res.status(404).json({ message: "Product not found" });

			await product.destroy();
			await productMongo.updateOne({ deletedAt: Date.now() });

			res.json({
				message: "Product deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while deleting the product : ${error.message}`,
			});
		}
	},

	getProduct: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const product = await Product.findOne({
				where: { id },
				include: "model",
			});

			if (!product)
				return res.status(404).json({ message: "Product not found" });

			res.json(product);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the product : ${error.message}`,
			});
		}
	},

	uploadImage: async (req, res) => {
		const file = req.files !== undefined ? req.files.image : null;
		if (file) {
			req.body.image = `/images/${file.name}`;
			file.mv("./uploads" + req.body.image, async (error) => {
				if (error) {
					console.error(error);
					return res.status(500).json({ message: error });
				}
			});
		}
	},
});
