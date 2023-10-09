import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		firstname: String,
		lastname: String,
		role: String,
		isValidate: Boolean,
		disabled: Boolean,
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
