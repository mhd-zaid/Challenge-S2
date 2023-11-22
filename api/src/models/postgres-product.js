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
            validate: {
                notEmpty: {
                    msg: "Field 'sku' cannot be empty.",
                },
            },
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
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Field 'price' cannot be empty.",
                },
                isDecimal: {
                    msg: "Field 'price' must be a decimal number.",
                },
            },
        },
        vat: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Field 'vat' cannot be empty.",
                },
                isDecimal: {
                    msg: "Field 'vat' must be a decimal number.",
                },
            },
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: null,
            validate: {
                isDecimal: {
                    msg: "Field 'discount' must be a decimal number.",
                },
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Field 'quantity' cannot be empty.",
                },
                isInt: {
                    msg: "Field 'quantity' must be an integer.",
                },
            },
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Field 'size' cannot be empty.",
                },
                len: {
                    args: [1, 5],
                    msg: "Field 'size' must be between 1 and 5 characters long.",
                },
            },
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Field 'color' cannot be empty.",
                },
                len: {
                    args: [2, 50],
                    msg: "Field 'color' must be between 2 and 50 characters long.",
                },
            },
        },
        alertQuantity: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                notEmpty: {
                    msg: "Field 'alertQuantity' cannot be empty.",
                },
                isInt: {
                    msg: "Field 'alertQuantity' must be an integer.",
                },
            },
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

Product.hasMany(Product_Images, {
    as: "productImages",
    onDelete: 'CASCADE'
});

export default Product;
