import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Order from "./postgres-order.js";

class Payment extends Model {}

Payment.init(
	{
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		stripePaymentId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		timestamps: true,
		modelName: "Payment",
	}
);

Payment.belongsTo(Order);
	  

export default Payment;
