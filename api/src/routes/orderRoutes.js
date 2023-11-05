import Order from "../models/postgres-order.js";
import OrderMongodb from "../models/mongodb-order.js";
import User from "../models/postgres-user.js";
import Cart from "../models/postgres-cart.js";

export const createOrder = async (req, res) => {
	try {
		const { userId, deliveryAddress } = req.body;
		const user = await User.findOne({ where: { id: userId } });

		if (!user  || !deliveryAddress) {
			return res
				.status(400)
				.json({ message: "userId, or deliveryAddress is missing" });
		}

		const orderMongo = await OrderMongodb({
			status: "payment pending",
			deliveryAddress,
			user: userId.id,
		}).save();

		const order = await Order.create({
			id: orderMongo._id.toString(),
			status: "payment pending",
			deliveryAddress,
		});

		const cart = await Cart.findOne({ where: { userId: userId.id } });
		for (const product of cart.products) {
			orderMongo.products.push({
				productId: product.product.id,
				quantity: product.quantity,
				productVersionId: product.productVersionId,
			});
			
			await order.addProduct(product.product, {
				through: {
					quantity: product.quantity,
					productVersionId: product.productVersionId,
				},
			});
		}

		res.json(order);
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while creating the order : ${error}`,
		});
	}
}

export const getUserOrders = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findOne({ where: { id: userId } });

		if (!user) {
			return res.status(400).json({ message: "userId is missing" });
		}

		const orders = await Order.findAll({
			where: { userId: userId },
			include: "products",
		});

		res.json(orders);
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the orders : ${error}`,
		});
	}
}

export const getOrder = async (req, res) => {
	try {
		const { orderId } = req.params;
		const order = await Order.findOne({
			where: { id: orderId },
			include: "products",
		});

		if (!order) {
			return res.status(400).json({ message: "orderId is missing" });
		}

		res.json(order);
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the order : ${error}`,
		});
	}
}