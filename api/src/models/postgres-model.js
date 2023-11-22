import {DataTypes, Model} from "sequelize";
import sequelize from "../config/sequelize-config.js";

class Modele extends Model {
}

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

let Category;
let Brand;
import("./postgres-category.js")
    .then((module) => {
        Category = module.default;

        Modele.belongsTo(Category);
    })
    .catch((error) => {
        console.error("Erreur lors de l'importation du modèle Category :", error);
    });

import("./postgres-brand.js")
    .then((module) => {
        Brand = module.default;

        Modele.belongsTo(Brand);
    })
    .catch((error) => {
        console.error("Erreur lors de l'importation du modèle Brand :", error);
    });
    
export default Modele;
