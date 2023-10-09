import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
	name: { type: String, required: true },
	deletedAt: { type: Date, default: null },
});

const BrandMongodb = mongoose.model("Brand", brandSchema);

export default BrandMongodb;
