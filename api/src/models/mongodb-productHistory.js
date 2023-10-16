import mongoose from "mongoose";

const productHistorySchema = new mongoose.Schema(
	{
		productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
		quantityChange: { type: Number },
		isAddition: { type: Boolean },
	},
	{
		timestamps: true,
	}
);

const ProductHistory = mongoose.model("ProductHistory", productHistorySchema);

export default ProductHistory;
