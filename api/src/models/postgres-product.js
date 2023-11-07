import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Modele from "./postgres-model.js";

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
		sku: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		timestamps: true,
		paranoid: true,
		modelName: "Product",
	}
);

Product.belongsToMany(Modele, {
	as: "models",
	through: "Products_Models",
});

export default Product;
