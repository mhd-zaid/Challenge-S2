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
			type: DataTypes.STRING,
			allowNull: false,
		},
		deliveryAddress: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			defaultValue: Date.now,
		},
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
