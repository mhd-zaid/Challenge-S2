import {DataTypes, INTEGER, Model} from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Product_Images from "./postgres-product-images.js";
import Modele from "./postgres-model.js";

class Product extends Model {
}

Product.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: null,
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
        alerteQuantity: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Product",
    }
);

Product.belongsTo(Modele, {
    as: "model",
});

Modele.hasMany(Product, {
    as: "products",
});

Product.hasMany(Product_Images, {
    foreignKey: 'ProductId',
    as: "Product_Images",
    onDelete: 'CASCADE'
})

Product.belongsTo(Modele, {
    foreignKey: 'ModelId',
    as: 'Modele',
});

export default Product;
