export default (
	Order,
	OrderMongodb,
	User,
	UserMongodb,
	ProductMongoDB,
	Product,
	ObjectId,
	Op
) => ({
	createOrder: async (req, res) => {
		try {
			switch (req.body) {
				case !req.body.userId:
					return res
						.status(400)
						.json({ message: "userId parameter is missing" });
				case !req.body.deliveryAddress:
					return res.status(400).json({
						message: "deliveryAddress parameter is missing",
					});
				case !req.body.products:
					return res
						.status(400)
						.json({ message: "products parameter is missing" });
			}
			const { userId, deliveryAddress, products } = req.body;
			const user = await User.findOne({ where: { id: userId } });
			const userMongo = await UserMongodb.findOne({ _id: userId });
			const mongoProducts = [];

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			const order = await Order.create({
				id: new ObjectId().toString(),
				status: "payment pending",
				userId: user.id,
				deliveryAddress,
			});

			for (const product of products) {
				const sqlProduct = await Product.findOne({
					where: { id: product.id },
				});

				if (!sqlProduct) {
					return res
						.status(404)
						.json({ message: "Product not found" });
				}
				let finalPrice = parseFloat(sqlProduct.price);
				if (parseFloat(sqlProduct.discount) > 0) {
					finalPrice =
						sqlProduct.price -
						(sqlProduct.price * sqlProduct.discount) / 100;
				}
				await order.addProduct(sqlProduct.id, {
					through: {
						quantity: product.quantity,
						price: parseFloat(finalPrice),
					},
				});

				const mongoProduct = await ProductMongoDB.findOne({
					_id: product.id,
				});

				mongoProducts.push(mongoProduct);
			}
			const orderMongo = await OrderMongodb({
				status: "payment pending",
				deliveryAddress,
				user: userMongo,
				products: mongoProducts,
			}).save();

			res.status(201).json(order);
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				res.status(422).json({
					message: `An error occurred while creating the order : ${error.message}`,
				});
			} else {
				res.status(500).json({
					message: `An error occurred while creating the order : ${error.message}`,
				});
			}
		}
	},

	getUserOrders: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res
					.status(400)
					.json({ message: "id parameter is missing" });
			}

			const user = await User.findOne({ where: { id } });

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			const orders = await Order.findAll({
				include: [
					{
						model: Product,
						as: "products",
						include: ["productImages"],
					},
					"user",
					"payment",
				],
				where: { userId: user.id },
				order: [["createdAt", "DESC"]],
			});

			console.log(orders.length);

			res.status(200).json(orders);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the orders : ${error.message}`,
			});
		}
	},

	getOrder: async (req, res) => {
		try {
			const { id } = req.params;

			const order = await Order.findOne({
				where: { id: id },
				include: ["products", "user", "payment"],
			});

			if (!id) {
				return res.status(400).json({ message: "id is missing" });
			}

			if (!order) {
				return res.status(404).json({ message: "Order not found" });
			}

			res.status(200).json(order);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the order : ${error.message}`,
			});
		}
	},

	getOrders: async (req, res) => {
		try {
			const orders = await Order.findAll({ include: "products" });

			res.status(200).json(orders);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the orders : ${error.message}`,
			});
		}
	},

	updateOrder: async (req, res) => {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ message: "id is missing" });
			}

			const { status } = req.body;
			if (!status) {
				return res.status(400).json({ message: "status is missing" });
			}

			const order = await Order.findOne({ where: { id: id } });
			if (!order) {
				return res.status(404).json({ message: "Order not found" });
			}
			const orderMongo = await OrderMongodb.findOne({
				_id: new ObjectId(id),
			});

			order.status = status;
			await order.save();

			await orderMongo.updateOne({ status });

			res.status(200).json({ message: "Order updated successfully" });
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				res.status(422).json({
					message: `An error occurred while updating the order : ${error.message}`,
				});
			} else {
				res.status(500).json({
					message: `An error occurred while updating the order : ${error.message}`,
				});
			}
		}
	},
});
