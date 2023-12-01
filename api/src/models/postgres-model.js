import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Category from "./postgres-category.js";
import Brand from "./postgres-brand.js";

class Modele extends Model {}

Modele.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Field 'name' cannot be empty.",
				},
				len: {
					args: [2, 100],
					msg: "Field 'name' must be between 2 and 100 characters long.",
				},
			},
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Field 'name' cannot be empty.",
				},
				isIn: {
					args: [["male", "female"]],
					msg: "The 'gender' field must be 'male' or 'female'.",
				},
			},
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: {
					args: [15, 300],
					msg: "Field 'description' must be between 15 and 300 characters long.",
				},
			},
		},
	},
	{
		sequelize,
		timestamps: true,
		paranoid: true,
		modelName: "Model",
	}
);

Modele.belongsTo(Category, { as: "category", foreignKey: "CategoryId" });
Modele.belongsTo(Brand, { as: "brand", foreignKey: "BrandId" });

export default Modele;
