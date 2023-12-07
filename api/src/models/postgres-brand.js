import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import { Sequelize } from "sequelize";

class Brand extends Model {}

Brand.init(
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
					args: [2, 50],
					msg: "Field 'name' must be between 2 and 50 characters long.",
				},
			},
		},
	},
	{
		sequelize,
		timestamps: true,
		paranoid: true,
		modelName: "Brand",
	}
);

let Modele;
import("./postgres-model.js")
	.then((module) => {
		Modele = module.default;

		Brand.hasMany(Modele, {
			as: "models",
		});
	})
	.catch((error) => {
		console.error("Erreur lors de l'importation du modèle Modele :", error);
	});

export default Brand;
