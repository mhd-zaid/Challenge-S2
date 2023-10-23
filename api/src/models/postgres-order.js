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

Order.belongsTo(User);

Order.belongsToMany(Product, {
	as: "products",
	through:{
		model: "Orders_Products",
		unique: false,
		scope: {
			ProductVersionId: {
				type: DataTypes.STRING,
				allowNull: false,
			}
		}
	}
	});
	  

export default Order;