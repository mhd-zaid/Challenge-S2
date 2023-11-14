import {DataTypes, Model} from "sequelize";
import sequelize from "../config/sequelize-config.js";
class Product_Images extends Model {}

Product_Images.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, 
    {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Product_Images",
    }
);
export default Product_Images;
