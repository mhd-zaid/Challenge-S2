import {DataTypes, Model} from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Sequelize from "sequelize";

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
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
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
let Product;
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
import("./postgres-product.js")
    .then((module) => {
        Product = module.default;

        Modele.hasMany(Product);
    })
    .catch((error) => {
        console.error("Erreur lors de l'importation du modèle Product :", error);
    });
export default Modele;
