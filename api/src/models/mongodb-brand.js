import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
	name: { type: String, required: true },
});

const BrandMongodb = mongoose.model("Brand", brandSchema);

export default BrandMongodb;
