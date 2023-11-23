export default (
	Product,
	Model,
	Product_Images,
	ProductMongodb,
	ObjectId,
	Op
) => {
	const addFiltersToQuery = (query, filters) => {
		if (filters.price) {
			query.price = {
				[Op.lte]: filters.price * 100,
			};
		}
		if (filters.color) {
			const colors = filters.color.split(",");

			query.color = {
				[Op.or]: colors.map((color) => ({ [Op.iLike]: color })),
			};
		}
		if (filters.size) {
			query.size = {
				[Op.or]: filters.size.split(","),
			};
		}
		//if (filters.gender) {
		// 	query.where("gender", "like", `%${filters.gender}%`);
		// }
		// if (filters.size) {
		// 	query.where("size", "like", `%${filters.size}%`);
		// }
		// if (filters.name) {
		// 	query.where("name", "like", `%${filters.name}%`);
		// }
		// if (filters.discount) {
		// 	query.where("discount", "<=", filters.discount);
		// }
		// if (filters.brand) {
		// 	query.where("brand", "like", `%${filters.brand}%`);
		// }
		// if (filters.category) {
		// 	query.push("category", "like", `%${filters.category}%`);
		// }
	};

	const getProducts = async (req, res) => {
		try {
			const query = {};
			const filters = req.query;
			addFiltersToQuery(query, filters);

			const products = await Product.findAll({
				where: query,
				include: ["model", "productImages"],
			});

			if (!products)
				return res.status(404).json({ message: "Products not found" });

			res.status(200).json(
				products.map((product) => ({
					...product.dataValues,
					price: (product.dataValues.price / 100).toFixed(2),
				}))
			);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the products : ${error.message}`,
			});
		}
	};

	const createProduct = async (req, res) => {
		try {
			switch (req.body) {
				case !req.body.name:
					return res.status(400).json({ message: "name is missing" });
				case !req.body.price:
					return res
						.status(400)
						.json({ message: "price is missing" });
				case !req.body.vat:
					return res.status(400).json({ message: "vat is missing" });
				case !req.body.quantity:
					return res
						.status(400)
						.json({ message: "quantity is missing" });
				case !req.body.size:
					return res.status(400).json({ message: "size is missing" });
				case !req.body.color:
					return res
						.status(400)
						.json({ message: "color is missing" });
				case !req.body.sku:
					return res.status(400).json({ message: "sku is missing" });
				case !req.body.modelId:
					return res
						.status(400)
						.json({ message: "modelId is missing" });
			}

			const model = await Model.findOne(
				{
					where: { id: req.body.model },
				},
				{ include: ["Brand", "Category"] }
			);

			if (!model) {
				return res.status(404).json({ message: "Model not found" });
			}

			const id = new ObjectId();

			const productDataToCreate = {
				name: req.body.name,
				price: req.body.price * 100,
				vat: req.body.vat,
				quantity: req.body.quantity,
				size: req.body.size,
				color: req.body.color,
				discount: req.body.discount,
				alertQuantity: req.body.alertQuantity,
				sku: req.body.sku,
				modelId: model.id,
			};
			const product = await Product.create({
				id: id.toString(),
				...productDataToCreate,
			});

			productDataToCreate.model = model;
			productDataToCreate.brand = model.Brand;
			productDataToCreate.category = model.Category;
			productDataToCreate.deletedAt = null;

			await ProductMongodb({
				_id: id,
				...productDataToCreate,
			}).save();

			res.status(201).json(product);
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				return res.status(422).json({ message: error.message });
			} else {
				return res.status(500).json({
					message: `An error occurred while creating the product : ${error.message}`,
				});
			}
		}
	};

	const updateProduct = async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res
					.status(400)
					.json({ message: "Id parameter is missing" });
			}

			switch (req.body) {
				case !req.body.name:
					return res.status(400).json({ message: "name is missing" });
				case !req.body.price:
					return res
						.status(400)
						.json({ message: "price is missing" });
				case !req.body.vat:
					return res.status(400).json({ message: "vat is missing" });
				case !req.body.quantity:
					return res
						.status(400)
						.json({ message: "quantity is missing" });
				case !req.body.size:
					return res.status(400).json({ message: "size is missing" });
				case !req.body.color:
					return res
						.status(400)
						.json({ message: "color is missing" });
				case !req.body.sku:
					return res.status(400).json({ message: "sku is missing" });
				case !req.body.modelId:
					return res
						.status(400)
						.json({ message: "modelId is missing" });
			}

			const model = await Model.findOne(
				{
					where: { id: req.body.model },
				},
				{ include: ["Brand", "Category"] }
			);

			if (!model) {
				return res.status(404).json({ message: "Model not found" });
			}

			const productDataToUpdate = {
				name: req.body.name,
				price: req.body.price * 100,
				vat: req.body.vat,
				quantity: req.body.quantity,
				size: req.body.size,
				color: req.body.color,
				discount: req.body.discount,
				alertQuantity: req.body.alertQuantity,
				sku: req.body.sku,
				modelId: model.id,
			};

			const product = await Product.findOne({ where: { id } });

			if (!product)
				return res.status(404).json({ message: "Product not found" });

			const productMongo = await ProductMongodb.findOne({
				_id: new ObjectId(id),
			});

			await product.update(req.body);
			productDataToUpdate.model = model;
			productDataToUpdate.brand = model.Brand;
			productDataToUpdate.category = model.Category;

			await productMongo.updateOne(productDataToUpdate);

			res.status(200).json({ message: "Product updated successfully" });
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				return res.status(422).json({ message: error.message });
			} else {
				return res.status(500).json({
					message: `An error occurred while updating the product : ${error.message}`,
				});
			}
		}
	};

	const deleteProduct = async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res
					.status(400)
					.json({ message: "Id parameter is missing" });
			}

			const product = await Product.findOne({ where: { id } });

			if (!product)
				return res.status(404).json({ message: "Product not found" });

			const productMongo = await ProductMongodb.findOne({
				_id: new ObjectId(id),
			});

			await product.destroy();
			await productMongo.updateOne({ deletedAt: Date.now() });

			res.status(204).json({ message: "Product deleted successfully" });
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while deleting the product : ${error.message}`,
			});
		}
	};

	const getProduct = async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res
					.status(400)
					.json({ message: "Id parameter is missing" });
			}

			const product = await Product.findOne({
				where: { id },
				include: ["model", "productImages"],
			});

			if (!product)
				return res.status(404).json({ message: "Product not found" });

			product.price = (product.price / 100).toFixed(2);
			res.status(200).json(product);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the product : ${error.message}`,
			});
		}
	};

	const uploadImage = async (req, res) => {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}
		if (!req.files) {
			return res.status(400).json({ message: "No file uploaded" });
		}
		const images = req.files.map((file) => file.filename);
		for (const image of images) {
			await Product_Images.create({ url: image, ProductId: id });
		}

		res.status(201).json({ message: "Images uploaded successfully" });
	};

	return {
		getProducts,
		createProduct,
		updateProduct,
		deleteProduct,
		getProduct,
		uploadImage,
	};
};
