import Order from "../models/postgres-order.js";
import OrderMongodb from "../models/mongodb-order.js";
import User from "../models/postgres-user.js";
import ProductMongoDB from "../models/mongodb-product.js";
import ModelMongodb from "../models/mongodb-model.js";

export const createOrder = async (req, res) => {
	try {
		const { userId, deliveryAddress,products } = req.body;
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

		
		for (const product of products) {
			const mongoProduct = await ProductMongoDB.findOne({ where: { _id: product.id } });
			const mongoModel = await ModelMongodb.findOne({ where: { id: product.models[0]._id } });
			const brand_version_id = mongoModel.brand.__v;
			const category_version_id = mongoModel.category.__v;
			orderMongo.products.push(mongoProduct);
			
			await order.addProduct(product, {
				through: {
					quantity: product.quantity,
					product_version_id: mongoProduct.__v,
					brand_version_id: brand_version_id,
					model_version_id: mongoModel.__v,
					category_version_id: category_version_id
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

export const getOrders = async (req, res) => {
	try {
		const orders = await Order.findAll({ include: "products" });
		res.json(orders);
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the orders : ${error}`,
		});
	}
}

export const updateOrder = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { status } = req.body;
		const order = await Order.findOne({ where: { id: orderId } });

		if (!order) {
			return res.status(400).json({ message: "orderId is missing" });
		}

		order.status = status;
		await order.save();

		res.json(order);
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while updating the order : ${error}`,
		});
	}
}