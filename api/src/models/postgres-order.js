import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Product from "./postgres-product.js";
import User from "./postgres-user.js"; 

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
	},
	{
		sequelize,
		timestamps: true,
		modelName: "Order",
	}
);

Order.belongsToMany(User, {
	as: "users",
	through: "User_Order",
	});
	  

export default Order;
