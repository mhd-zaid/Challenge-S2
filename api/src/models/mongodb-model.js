import mongoose from "mongoose";

const modelesSchema = new mongoose.Schema({
	name: { type: String, required: true },
	gender: { type: String, required: true },
	description: { type: String, required: true },
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
	},
	brand: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Brand",
	},
	products: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
	],
});

const ModelMongodb = mongoose.model("Model", modelesSchema);

export default ModelMongodb;
