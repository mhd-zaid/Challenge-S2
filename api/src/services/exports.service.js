import User from "../models/postgres-user.js";
import Product from "../models/postgres-product.js";
import Model from "../models/postgres-model.js";
import Brand from "../models/postgres-brand.js";
import Category from "../models/postgres-category.js";
import Order from "../models/postgres-order.js";
import Orders_Products from "../models/postgres-order-product.js";
import { columnNames } from "../lib/columnsNames.js";
import Export from "../models/mongodb-export.js";
import path from "path";
import fs from "fs";

const formatData = (data) => {
	data = data.map((item) => {
		const formattedItem = {};

		for (const key in item) {
			if (Object.prototype.hasOwnProperty.call(item, key)) {
				const formattedKey = columnNames[key] || key;

				if (item[key] instanceof Date) {
					formattedItem[formattedKey] =
						item[key].toLocaleString("fr-FR");
				} else {
					formattedItem[formattedKey] = item[key];
				}
			}
		}

		return formattedItem;
	});

	return data;
};

export const exportData = async (dataScope) => {
	let data;
	switch (dataScope) {
		case "users":
			const users = await User.findAll({
				attributes: {
					exclude: [
						"password",
						"passwordResetToken",
						"encryptionKey",
						"authentificationToken",
					],
				},
			});
			data = users.map((user) => user.dataValues);
			break;
		case "products":
			const products = await Product.findAll();
			data = products.map((product) => product.dataValues);
			break;
		case "models":
			const models = await Model.findAll();
			data = models.map((model) => model.dataValues);
			break;
		case "brands":
			const brands = await Brand.findAll();
			data = brands.map((brand) => brand.dataValues);
			break;
		case "categories":
			const categories = await Category.findAll();
			data = categories.map((category) => category.dataValues);
			break;
		case "orders":
			const orders = await Order.findAll();
			data = orders.map((order) => order.dataValues);
			break;
		default:
			data = [];
			console.log("dataScope not found");
			break;
	}

	return formatData(data);
};

export const exportPersonalData = async (userId) => {
	let data = [];
	const orders = await Order.findAll({
		where: {
			userId,
		},
		include: ["products", "user"],
		order: [["createdAt", "DESC"]],
	});

	const ordersObject = orders.map((order) => order.dataValues);
	for (const order of ordersObject) {
		const products = order.products.map((product) => product.dataValues);
		for (const product of products) {
			delete order.products;
			delete order.user;
			delete product.Orders_Products;
			delete order.id;
			delete product.id;
			delete product.modelId;
			delete order.userId;
			data.push({
				...order,
				...product,
			});
		}
	}

	return formatData(data);
};

export const createExport = async (dataScope, csv) => {
	const currentModuleFile = new URL(import.meta.url).pathname;
	const currentModuleDirectory = path.dirname(currentModuleFile);

	const fileName = `${dataScope}-${new Date()
		.toLocaleDateString("fr-FR")
		.replaceAll("/", "-")}-${Math.random().toString(36).slice(2)}.csv`;
	const filePath = path.join(
		currentModuleDirectory,
		"../../uploads/exports",
		fileName
	);
	fs.writeFileSync(filePath, csv);
	// create export and get id
	const exportToCreate = new Export({
		dataScope,
		fileName,
	});

	await exportToCreate.save();

	console.log(`Exported ${dataScope} successfully`);
	return { exportId: exportToCreate._id, fileName };
};