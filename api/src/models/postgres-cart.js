import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";

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

let User;
let Product;
import("./postgres-user.js")
	.then((module) => {
		User = module.default;

		Cart.belongsTo(User);
	})
	.catch((error) => {
		console.error("Erreur lors de l'importation du modèle User :", error);
	});

import("./postgres-product.js")
	.then((module) => {
		Product = module.default;

		Cart.belongsToMany(Product, {
			as: "products",
			through: "Carts_Products",
		});
	})
	.catch((error) => {
		console.error("Erreur lors de l'importation du modèle Product :", error);
	});

export default Cart;
