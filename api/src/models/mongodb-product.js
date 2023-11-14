import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	vat: { type: Number, required: true },
	quantity: { type: Number, required: true },
	size: { type: String, required: true },
	color: { type: String, required: true },
	discount: { type: Number, required: false },
	alerteQuantity: { type: Number, required: false },
	sku: { type: String, required: true },
	model: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Model",
	},
	deletedAt: { type: Date, default: null },
});

const ProductMongoDB = mongoose.model("Product", productSchema);

export default ProductMongoDB;
