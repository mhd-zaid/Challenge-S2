import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";

class Product extends Model {}

Product.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		vat: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		size: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		color: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		timestamps: true,
		paranoid: true,
		modelName: "Product",
	}
);

let Modele;
let Cart;
import("./postgres-model.js")
	.then((module) => {
		Modele = module.default;

		Product.belongsToMany(Modele, {
			as: "models",
			through: "Products_Models",
		});
	})
	.catch((error) => {
		console.error("Erreur lors de l'importation du modèle Modele :", error);
	});
import("./postgres-cart.js")
	.then((module) => {
		Cart = module.default;

		Product.belongsToMany(Cart, {
			through: "Carts_Products",
		});
	})
	.catch((error) => {
		console.error("Erreur lors de l'importation du modèle Cart :", error);
	});
export default Product;
