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
			return res.status(400).json({ message: "Invalid arguments" });

		if (!isUserMajor(birthdate))
			return res
				.status(400)
				.json({ error: "User must be 18 years old or older" });

		if (!isValidPassword(password))
			return res.status(400).json({ message: "Invalid password" });

		const hashedPassword = await bcrypt.hash(password, 10);

		const existingUser = await User.findOne({
			where: { email },
		});

		if (existingUser)
			return res.status(409).json({ message: `Email already taken` });

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

		res.status(201).json({
			...JSON.parse(JSON.stringify(newPostgresUser)),
			isEmailSent,
			token: token,
		});
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while creating the user : ${error.message}`,
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });

		if (!user) return res.status(404).json({ message: "Email not found" });

		if (isUserBlocked(user)) {
			const isEmailSent = await sendBlockedAccountEmail(email);
			return res.status(401).json({
				message: "User is temporarily blocked",
				isEmailSent,
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
			message: `An error occurred during login: ${error.message}`,
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
			message: `An error occurred while checking the email : ${error.message}`,
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

		if (!user) return res.status(404).json({ message: "Email not found" });

		if (user.isValidate)
			return res.status(400).json({ message: "Email already confirmed" });

		const mongoUserId = new Types.ObjectId(user.id);
		mongoUserToFind = await UserMongo.findOne({
			_id: mongoUserId,
		});

		if (!mongoUserToFind)
			return res.status(404).json({ message: "User not found" });

		if (user.authentificationToken !== authentificationToken)
			return res.status(400).json({ message: "Invalid token" });

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
			message: `An error occurred while validating the email : ${error.message}`,
		});
	}
};

export const requestPasswordReset = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({
			where: { email },
		});

		if (!user) return res.status(404).json({ message: "Email not found" });

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
			message: `An error occurred while resetting the password : ${error.message}`,
		});
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { email, token, password } = req.body;

		const user = await User.findOne({
			where: { email },
		});
		if (!user) return res.status(404).json({ message: "Email not found" });

		if (user.passwordResetToken !== token)
			return res.status(400).json({
				message: "Invalid token",
			});

		if (!isValidPassword(password)) return res.status(400).json({
			message: "Invalid password",
		});

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
			message: `An error occurred while resetting the password : ${error.message}`,
		});
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findOne({ where: { id: req.user.userId } });
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while getting the user : ${error.message}`,
		});
	}
};
