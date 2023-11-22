import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const usersFixture = [
	{
		id: new ObjectId().toString(),
		firstname: "Admin",
		lastname: "Account",
		email: "admin@user.fr",
		password: await bcrypt.hash("test", await bcrypt.genSalt(10)),
		birthdate: new Date("1990-01-01"),
		isValidate: true,
		role: "ROLE_ADMIN",
		address: "1 rue de la paix",
		city: "Paris",
		postalCode: "75000",
		phone: "0123456789",
	},
	{
		id: new ObjectId().toString(),
		firstname: "Store",
		lastname: "Keeper",
		email: "store@user.fr",
		password: await bcrypt.hash("test", await bcrypt.genSalt(10)),
		birthdate: new Date("1990-01-01"),
		isValidate: true,
		role: "ROLE_STORE_KEEPER",
		address: "1 rue de la paix",
		city: "Paris",
		postalCode: "75000",
		phone: "0123456789",
	},
	{
		id: new ObjectId().toString(),
		firstname: "User",
		lastname: "Account",
		email: "user@user.fr",
		password: await bcrypt.hash("test", await bcrypt.genSalt(10)),
		birthdate: new Date("1990-01-01"),
		isValidate: true,
		role: "ROLE_USER",
		address: "1 rue de la paix",
		city: "Paris",
		postalCode: "75000",
		phone: "0123456789",
	},
];

export default usersFixture;
