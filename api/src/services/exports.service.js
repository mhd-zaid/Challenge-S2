import User from "../models/postgres-user.js";
import Product from "../models/postgres-product.js";
import Model from "../models/postgres-model.js";
import Brand from "../models/postgres-brand.js";
import Category from "../models/postgres-category.js";
import Order from "../models/postgres-order.js";
import { columnNames } from "../lib/columnsNames.js";

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
