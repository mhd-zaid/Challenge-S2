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
			type: DataTypes.ENUM("unpaid","paid", "failed"),
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Field 'status' cannot be empty.",
				},
				isIn: {
					args: [["unpaid","paid", "failed"]],
					msg: "The 'status' field must be 'unpaid','paid', 'failed'.",
				},
			}
		},
		stripePaymentId: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Field 'stripePaymentId' cannot be empty.",
				},
				
			}
		},
	},
	{
		sequelize,
		timestamps: true,
		modelName: "Payment",
	}
);

Payment.belongsTo(Order, {
	as: "order",
});

Order.hasOne(Payment, {
	foreignKey: "orderId",
	as: "payment",
});
	  

export default Payment;
