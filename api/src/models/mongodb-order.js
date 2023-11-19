import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	user : { 
		type: Object,
		required: true,
	},
	status: { type: String, required: true },
	deliveryAddress: { type: String, required: true },
	date: { type: Date, default: Date.now },
	products: {type: Array, required: true},
});

const OrderMongodb = mongoose.model("Order", orderSchema);

export default OrderMongodb;
