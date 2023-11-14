import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize-config.js";

const Orders_Products = sequelize.define('Orders_Products', {

	quantity: {
	  type: DataTypes.INTEGER,
	  allowNull: false
	},
	product_version_id: {
	  type: DataTypes.STRING,
	  allowNull: false
	},
	brand_version_id: {
	  type: DataTypes.STRING,
	  allowNull: false
	},
	model_version_id: {
	  type: DataTypes.STRING,
	  allowNull: false
	},
	category_version_id: {
	  type: DataTypes.STRING,
	  allowNull: false
	},
});

export default Orders_Products;
