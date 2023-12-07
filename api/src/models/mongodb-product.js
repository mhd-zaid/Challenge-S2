import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	sku: { type: String, required: true },
	name: { type: String, required: true },
	price: { type: Number, required: true },
	vat: { type: Number, required: true },
	discount: { type: Number, required: false },
	quantity: { type: Number, required: true },
	size: { type: String, required: true },
	color: { type: String, required: true },
	alertQuantity: { type: Number, required: false },
	model: {
		type: Object,
		required: true,
	},
	category: {
		type: Object,
		required: true,
	},
	brand: {
		type: Object,
		required: true,
	},
	deletedAt: { type: Date, default: null },
});

const ProductMongoDB = mongoose.model("Product", productSchema);

export default ProductMongoDB;
