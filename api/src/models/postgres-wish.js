import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Product from "./postgres-product.js";
import User from "./postgres-user.js"; 

class Wish extends Model {}

Wish.init(
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
		modelName: "Wish",
	}
);

Wish.belongsTo(User);

Wish.belongsToMany(Product, {
	as: "products",
	through: "Wishes_Products",
	});
	  

export default Wish;
