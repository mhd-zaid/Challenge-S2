import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	status: { type: String, required: true },
	deliveryAddress: { type: String, required: true },
	date: { type: Date, default: Date.now },
	user : { 
		type: mongoose.Schema.Types.String, 
		ref: "User" 
	},
	quantity: { type: Number, required: true },
	products: [
		{
			product: {
				type: mongoose.Schema.Types.String,
				ref: "Product",
			},
			quantity: { type: Number, required: true },
			productVersionId: { type: String, required: true },
		},
	],
});

const OrderMongodb = mongoose.model("Order", orderSchema);

export default OrderMongodb;
