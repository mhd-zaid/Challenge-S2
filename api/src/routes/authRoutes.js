import User from "../models/postgres-user.js";
import UserMongo from "../models/mongodb-user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken, isUserBlocked } from "../services/auth.service.js";
import {
	sendEmailConfirmation,
	sendBlockedAccountEmail,
	sendResetPasswordEmail,
} from "../services/email.service.js";
import { isValidPassword, isUserMajor } from "../services/user.service.js";
import { Types } from "mongoose";

export const register = async (req, res) => {
	try {
		const { firstname, lastname, email, password, role, birthdate } =
			req.body;

		if (!(firstname && lastname && email && password && birthdate))
			throw new Error("Invalid arguments");

		if (!isUserMajor(new Date(birthdate)))
			throw new Error("User must have 18 years old or more");
		if (!isValidPassword(password)) throw new Error("Invalid password");

		const hashedPassword = await bcrypt.hash(password, 10);

		const existingUser = await User.findOne({
			where: { email },
		});

		if (existingUser) throw new Error(`Email "${email}" is already taken`);

		const authentificationToken = generateToken();

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
			birthdate: new Date(birthdate),
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

		if (!user) return res.status(401).json({ message: "Email not found" });

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
		res.status(500).json({
			error: `An error occurred during login: ${error.message}`,
		});
	}
};

export const checkEmail = async (req, res) => {
	try {
		const { email } = req.query;

		const user = await User.findOne({
			where: { email },
		});

		res.json({
			message: user ? "Email already taken" : "Email available",
		});
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while checking the email : ${error}`,
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

		// TODO: change the real url
		res.redirect("http://localhost:5174/login?email_confirmed=true");
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while validating the email : ${error}`,
		});
	}
};

export const requestPasswordReset = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({
			where: { email },
		});

		if (!user) throw new Error(`Email "${email}" not found`);

		const passwordResetToken = generateToken();

		const isEmailSent = await sendResetPasswordEmail(
			email,
			passwordResetToken
		);

		await user.update({ passwordResetToken }, { where: { email } });

		res.json({
			message: isEmailSent ? "Email sent successfully" : "Email not sent",
		});
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while resetting the password : ${error}`,
		});
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { email, token, password } = req.body;

		const user = await User.findOne({
			where: { email },
		});
		if (!user) throw new Error(`Email "${email}" not found`);

		if (user.passwordResetToken !== token) throw new Error("Invalid token");

		if (!isValidPassword(password)) throw new Error("Invalid password");

		const hashedPassword = await bcrypt.hash(password, 10);

		await user.update(
			{
				password: hashedPassword,
				passwordResetToken: null,
				passwordUpdatedAt: new Date(),
			},
			{ where: { email } }
		);
		
		res.json({ message: "Password updated successfully" });
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while resetting the password : ${error}`,
		});
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findOne({ where: { id: req.user.userId } });
		if (!user) throw new Error("User not found");
		res.json(user);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while getting the user : ${error}`,
		});
	}
};