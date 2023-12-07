import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Product from "./postgres-product.js";
import User from "./postgres-user.js";
import Orders_Products from "./postgres-order-product.js";

class Order extends Model {}

Order.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		status: {
			type: DataTypes.ENUM("payment pending","payment failed", "paid","in shipment", "shipped", "delivered"),
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Field 'status' cannot be empty.",
				},
				isIn: {
					args: [["payment pending","payment failed", "paid","in shipment", "shipped", "delivered"]],
					msg: "The 'status' field must be 'payment pending','payment failed', 'paid','in shipment', 'shipped', 'delivered'.",
				},
			},
		},
		deliveryAddress: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Field 'deliveryAddress' cannot be empty.",
				},
			},
		}
	},
	{
		sequelize,
		timestamps: true,
		modelName: "Order",
	}
);

Order.belongsTo(User, {
	as: "user",
});

Order.belongsToMany(Product, {
	as: "products",
	through: Orders_Products,
});

Product.belongsToMany(Order, {
	as: "orders",
	through: Orders_Products,
});

export default Order;
