import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Product from "./postgres-product.js";
import User from "./postgres-user.js"; 

class Cart extends Model {}

Cart.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
	},
	{
		sequelize,
		timestamps: true,
		paranoid: true,
		modelName: "Cart",
	}
);

Cart.belongsTo(User);

Cart.belongsToMany(Product, {
	as: "products",
	through: "Carts_Products",
	});
	  

export default Cart;