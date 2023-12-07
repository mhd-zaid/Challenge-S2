import mongoose from "mongoose";

const exportSchema = new mongoose.Schema(
	{
		dataScope: {
			type: String,
			required: true,
		},
		fileName: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Export = mongoose.model("Export", exportSchema);

export default Export;
