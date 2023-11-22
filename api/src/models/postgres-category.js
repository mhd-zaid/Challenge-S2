import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";

class Category extends Model {}

Category.init(
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
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: {
					args: [0, 300],
					msg: "Field 'description' must be between 0 and 300 characters long.",
				},
			},
		},
	},
	{
		sequelize,
		timestamps: true,
		paranoid: true,
		modelName: "Category",
	}
);

let Modele;
import("./postgres-model.js")
	.then((module) => {
		Modele = module.default;

		Category.hasMany(Modele, {
			as: "models",
		});
	})
	.catch((error) => {
		console.error("Erreur lors de l'importation du modèle Modele :", error);
	});

export default Category;
