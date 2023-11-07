import Order from "../models/postgres-order.js";
import OrderMongodb from "../models/mongodb-order.js";
import User from "../models/postgres-user.js";
import ProductMongoDB from "../models/mongodb-product.js";
import ModelMongodb from "../models/mongodb-model.js";
import BrandMongodb from "../models/mongodb-brand.js";
import CategoryMongodb from "../models/mongodb-category.js";
import { ObjectId } from "mongodb";

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
			user: user.id,
			products: products,
		}).save();

		const order = await Order.create({
			id: orderMongo._id.toString(),
			status: "payment pending",
			userId: user.id,
			deliveryAddress,
		});
		

		for (const product of products) {
			const mongoProduct = await ProductMongoDB.findOne({ _id: new ObjectId(product.id)});
			const mongoModel = await ModelMongodb.findOne({_id: mongoProduct.models[0] });
			const mongoBrand = await BrandMongodb.findOne({_id: mongoModel.brand });
			const mongocategory = await CategoryMongodb.findOne({_id: mongoModel.category });

			await order.addProduct(product.id,{
				through: {
					quantity: product.quantity,
					product_version_id: mongoProduct.__v,
					brand_version_id: mongoBrand.__v,
					model_version_id: mongoModel.__v,
					category_version_id: mongocategory.__v,
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
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the orders : ${error}`,
		});
	}
}

export const getOrder = async (req, res) => {
	try {
		const { id } = req.params;

		const order = await Order.findOne({
			where: { id: id },
			include: ["products", "user"]
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
		const { id } = req.params;
		const { status } = req.body;
		const order = await Order.findOne({ where: { id: id } });

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