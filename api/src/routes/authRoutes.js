import User from "../models/postgres-user.js";
import UserMongo from "../models/mongodb-user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
	generateAuthentificationToken,
	isUserBlocked,
} from "../services/auth.service.js";
import {
	sendEmailConfirmation,
	sendBlockedAccountEmail,
} from "../services/email.service.js";
import { isValidPassword } from "../services/user.service.js";
import { Types } from "mongoose";

export const register = async (req, res) => {
	try {
		const { firstname, lastname, email, password, role } = req.body;

		if (!(firstname && lastname && email && password && role))
			throw new Error("Invalid arguments");

		if (!isValidPassword(password)) throw new Error("Invalid password");

		const hashedPassword = await bcrypt.hash(password, 10);

		const existingUser = await User.findOne({
			where: { email },
		});

		if (existingUser) throw new Error(`Email "${email}" is already taken`);

		const authentificationToken = generateAuthentificationToken();

		const newMongoUser = await UserMongo.create({
			firstname,
			lastname,
			role,
			isValidate: false,
			disabled: false,
		});

		const newPostgresUser = await User.create({
			id: newMongoUser._id.toString(),
			firstname,
			lastname,
			email,
			password: hashedPassword,
			role,
			authentificationToken,
		});

		const payload = {
			userId: newPostgresUser.id,
		};

		const options = {
			expiresIn: "12h",
		};

		const token = jwt.sign(payload, process.env.SECRET_KEY, options);

		const isEmailSent = await sendEmailConfirmation(
			email,
			authentificationToken
		);

		res.json({
			message: isEmailSent
				? "User created successfully"
				: "User created successfully but email not sent",
			token: token,
		});
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while creating the user : ${error}`,
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });

		if (!user)
			return res.status(401).json({ message: "Invalid credentials" });

		if (isUserBlocked(user)) {
			const isEmailSent = await sendBlockedAccountEmail(email);
			return res.status(401).json({
				message: isEmailSent
					? "User is temporarily blocked"
					: "User is temporarily blocked but email not sent",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			user.loginAttempts = user.loginAttempts
				? user.loginAttempts + 1
				: 1;
			if (user.loginAttempts >= 3) user.blockedAt = new Date();
			user.save();
			return res.status(401).json({
				message: "Invalid credentials",
				loginAttempts: user.loginAttempts,
			});
		}

		if (user.loginAttempts) user.loginAttempts = 0;
		if (user.blockedAt) user.blockedAt = null;
		user.save();

		if (!user.isValidate)
			return res.status(401).json({ message: "Email not confirmed" });

		const payload = {
			userId: user.id,
		};

		const options = {
			expiresIn: "12h",
		};

		const token = jwt.sign(payload, process.env.SECRET_KEY, options);

		const userWithToken = {
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			token,
		};

		delete userWithToken.password;

		res.json(userWithToken);
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({
			error: `An error occurred during login: ${error.message}`,
		});
	}
};

export const confirmEmail = async (req, res) => {
	try {
		const { email, authentificationToken } = req.query;

		const user = await User.findOne({
			where: { email },
		});

		let mongoUserToFind = null;

		if (!user) throw new Error(`Email "${email}" not found`);

		if (user.isValidate) throw new Error("Email already confirmed");

		const mongoUserId = new Types.ObjectId(user.id);
		mongoUserToFind = await UserMongo.findOne({
			_id: mongoUserId,
		});

		if (!mongoUserToFind)
			throw new Error(`Mongo user with id "${user.id}" not found`);

		if (user.authentificationToken !== authentificationToken)
			throw new Error("Invalid token");

		await user.update(
			{ isValidate: true, authentificationToken: null },
			{ where: { email } }
		);

		mongoUserToFind.isValidate = true;
		await mongoUserToFind.save();

		res.json({
			message: "Email confirmed successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while validating the email : ${error}`,
		});
	}
};

export const logout = async (req, res) => {
	// Logique de déconnexion de l'utilisateur
};
