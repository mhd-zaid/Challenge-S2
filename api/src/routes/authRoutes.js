export default (
	User,
	UserMongo,
	jwt,
	bcrypt,
	generateToken,
	sendEmailConfirmation,
	isUserBlocked,
	isValidPassword,
	isUserMajor,
	sendBlockedAccountEmail,
	sendResetPasswordEmail,
	Types
) => ({
	register: async (req, res) => {
		try {
			const { firstname, lastname, email, password, birthdate } =
				req.body;

			if (!(firstname && lastname && email && password && birthdate))
				return res.sendStatus(400);

			if (!isUserMajor(birthdate))
				return res.status(400).json({ error: "Invalid birthdate" });

			if (!isValidPassword(password))
				return res.status(400).json({ message: "Invalid password" });

			const hashedPassword = await bcrypt.hash(
				password,
				await bcrypt.genSalt(10)
			);

			const existingUser = await User.findOne({
				where: { email },
			});

			if (existingUser)
				return res.status(409).json({ message: `Email already taken` });

			const authentificationToken = generateToken();

			const newMongoUser = await UserMongo.create({
				firstname,
				lastname,
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
	},

	login: async (req, res) => {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({ where: { email } });

			if (!user) return res.sendStatus(401);

			if (isUserBlocked(user)) {
				const isEmailSent = await sendBlockedAccountEmail(email);
				return res.status(401).json({
					message: "User is temporarily blocked",
					isEmailSent,
				});
			}

			const isPasswordValid = await bcrypt.compare(
				password,
				user.password
			);

			if (!isPasswordValid) {
				user.loginAttempts = user.loginAttempts
					? user.loginAttempts + 1
					: 1;
				if (user.loginAttempts >= 3) user.blockedAt = new Date();
				user.save();
				return res.sendStatus(401);
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
	},

	checkEmail: async (req, res) => {
		try {
			const { email } = req.query;

			const user = await User.findOne({
				where: { email },
			});

			if (!user) return res.sendStatus(201);
			return res.sendStatus(409);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while checking the email : ${error.message}`,
			});
		}
	},

	confirmEmail: async (req, res) => {
		try {
			const { email, authentificationToken } = req.query;

			const user = await User.findOne({
				where: { email },
			});

			let mongoUserToFind = null;

			if (!user)
				return res.status(404).json({ message: "Email not found" });

			if (user.isValidate)
				return res
					.status(400)
					.json({ message: "Email already confirmed" });

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
	},

	requestPasswordReset: async (req, res) => {
		try {
			const { email } = req.body;

			const user = await User.findOne({
				where: { email },
			});

			if (!user)
				return res.status(404).json({ message: "Email not found" });

			const passwordResetToken = generateToken();

			await sendResetPasswordEmail(email, passwordResetToken);

			await user.update({ passwordResetToken }, { where: { email } });

			res.sendStatus(200);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while requesting the password reset : ${error.message}`,
			});
		}
	},

	resetPassword: async (req, res) => {
		try {
			const { email, token, password } = req.body;

			const user = await User.findOne({
				where: { email },
			});
			if (!user)
				return res.status(404).json({ message: "User not found" });

			if (user.passwordResetToken !== token)
				return res.status(400).json({
					message: "Invalid token",
				});

			if (!isValidPassword(password))
				return res.status(400).json({
					message: "Invalid password",
				});

			const hashedPassword = await bcrypt.hash(
				password,
				await bcrypt.genSalt(10)
			);

			await user.update(
				{
					password: hashedPassword,
					passwordResetToken: null,
					passwordUpdatedAt: new Date(),
				},
				{ where: { email } }
			);

			res.sendStatus(200);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while resetting the password : ${error.message}`,
			});
		}
	},

	getMe: async (req, res) => {
		try {
			const user = await User.findOne({ where: { id: req.user.userId } });
			if (!user)
				return res.status(404).json({ message: "User not found" });


			res.json(user);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while getting the user : ${error.message}`,
			});
		}
	},
	checkIfAdmin: async (req, res) => {
		try {
			const user = await User.findOne({ where: { id: req.user.userId } });
			if (!user)
				return res.status(404).json({ message: "User not found" });
			if (user.role === "ROLE_USER")
				return res.sendStatus(403)
			res.json(!!user);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while getting the user : ${error.message}`,
			});
		}
	},
	checkIfUser: async (req, res) => {
		try {
			const user = await User.findOne({ where: { id: req.user.userId } });
			if (!user)
				return res.status(404).json({ message: "User not found" });
			res.json(!!user);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while getting the user : ${error.message}`,
			});
		}
	}
});
