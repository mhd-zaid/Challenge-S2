import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize-config.js";

const Orders_Products = sequelize.define("Orders_Products", {
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
			isGreaterThanZero(value) {
				if (value <= 0) {
					throw new Error("Field 'quantity' must be greater than 0.");
				}
			},
		},
	},
	price: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: "Field 'price' cannot be empty.",
			},
			isInt: {
				msg: "Field 'price' must be an integer.",
			},
		},
	},
});

export default Orders_Products;
