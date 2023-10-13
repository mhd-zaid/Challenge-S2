import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	deletedAt: { type: Date, default: null },
});

const CategoryMongodb = mongoose.model("Category", categorySchema);

export default CategoryMongodb;
