import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	status: { type: String, required: true },
	deliveryAddress: { type: String, required: true },
	date: { type: Date, default: Date.now },
	user : { 
		type: mongoose.Schema.Types.String, 
		ref: "User" 
	},
	products: {type: Array, required: true},
});

const OrderMongodb = mongoose.model("Order", orderSchema);

export default OrderMongodb;
