export default (
	Order,
	OrderMongodb,
	User,
	UserMongodb,
	ProductMongoDB,
	ObjectId
) => ({
	createOrder: async (req, res) => {
		try {
			const { userId, deliveryAddress, products } = req.body;
			const user = await User.findOne({ where: { id: userId } });
			const userMongo = await UserMongodb.findOne({ _id: new ObjectId(userId) });
			const mongoProducts = [];
			if (!user || !deliveryAddress) {
				return res
					.status(400)
					.json({ message: "userId, or deliveryAddress is missing" });
			}

			const order = await Order.create({
				id: new ObjectId().toString(),
				status: "payment pending",
				userId: user.id,
				deliveryAddress,
			});

			for (const product of products) {
				const mongoProduct = await ProductMongoDB.findOne({
					_id: new ObjectId(product.id),
				});
				mongoProducts.push(mongoProduct);

				const sqlProduct = await Product.findOne({
					where: { id: product.id },
				});
				
				await order.addProduct(sqlProduct.id, {
					through: {
						quantity: product.quantity,
						price: product.price,
					},
				});
			}

			const orderMongo = await OrderMongodb({
				status: "payment pending",
				deliveryAddress,
				user: userMongo,
				products: mongoProducts,
			}).save();

			res.json(order);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while creating the order : ${error.message}`,
			});
		}
	},

	getUserOrders: async (req, res) => {
		try {
			const { id } = req.params;
			const user = await User.findOne({ where: { id: id } });

			if (!user) {
				return res.status(400).json({ message: "userId is missing" });
			}

			const orders = await Order.findAll({
				where: { user: user },
				include: "products",
			});

			res.json(orders);
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
				include: ["products", "user"],
			});

			if (!order) {
				return res.status(400).json({ message: "orderId is missing" });
			}

			res.json(order);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the order : ${error.message}`,
			});
		}
	},

	getOrders: async (req, res) => {
		try {
			const orders = await Order.findAll({ include: "products" });
			res.json(orders);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the orders : ${error.message}`,
			});
		}
	},

	updateOrder: async (req, res) => {
		try {
			const { id } = req.params;
			const { status } = req.body;
			const order = await Order.findOne({ where: { id: id } });
			const orderMongo = await OrderMongodb.findOne({ _id: new ObjectId(id) });

			if (!order) {
				return res.status(400).json({ message: "orderId is missing" });
			}

			order.status = status;
			await order.save();

			await orderMongo.updateOne({ status });

			res.json(order);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while updating the order : ${error.message}`,
			});
		}
	},
});
