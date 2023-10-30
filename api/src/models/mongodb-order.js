import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	status: { type: String, required: true },
	deliveryAddress: { type: String, required: true },
	users: [
		{
			type: mongoose.Schema.Types.ObjectId, 
			ref: "User" 
		}
	],
});

const OrderMongodb = mongoose.model("Order", orderSchema);

export default OrderMongodb;
