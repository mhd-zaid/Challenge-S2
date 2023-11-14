export default (
	User,
	UserMongo,
	bcrypt,
	isValidPassword,
	anonymizeUserData,
	generateEncryptionKey,
	sendDeletedAccountEmail,
	Types,
	decryptUserData,
	isUserMajor,
	generateToken
) => ({
	getUsers: async (req, res) => {
		try {
			const users = await User.findAll({
				attributes: { exclude: ["password", "encryptionKey"] },
			});
			res.json(users);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the users : ${error.message}`,
			});
		}
	},

	getUser: async (req, res) => {
		try {
			const user = await User.findOne({
				where: { id: req.params.id },
				attributes: { exclude: ["password", "encryptionKey"] },
			});
			if (!user) return res.status(404).json({ message: "User not found" });
			res.json(user);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the user : ${error.message}`,
			});
		}
	},

	createUser: async (req, res) => {
		try {
			const { firstname, lastname, email, password, role, birthdate } =
				req.body;

			if (!(firstname && lastname && email && password && birthdate))
				return res.sendStatus(400);

			if (!isUserMajor(birthdate))
				return res.status(400).json({ message: "Invalid birthdate" });

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
				return res.status(409).json({ message: `Email is already taken` });

			const authentificationToken = generateToken();

			const userMongo = await UserMongo.create({
				firstname,
				lastname,
				role,
				isValidate: false,
				disabled: false,
			});

			const postgresUser = await User.create({
				id: userMongo._id.toString(),
				firstname,
				lastname,
				email,
				birthdate: new Date(birthdate),
				password: hashedPassword,
				role,
				authentificationToken,
			});

			res.status(201).json(postgresUser);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while creating the user : ${error.message}`,
			});
		}
	},

	// TODO: add admin verification before updating user role
	updateUser: async (req, res) => {
		try {
			const { id } = req.params;
			const userDataToUpdate = req.body;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const user = await User.findOne({ where: { id } });

			if (!user) return res.status(404).json({ message: "User not found" });

			const userMongo = await UserMongo.findOne({
				_id: new Types.ObjectId(id),
			});

			if (userDataToUpdate.email) {
				// Check if email is updated and if it is, check if it is already taken
				const existingUser =
					user.email !== userDataToUpdate.email &&
					(await User.findOne({
						where: { email: userDataToUpdate.email },
					}));
				if (existingUser)
					return res.status(409).json({ message: `Email already taken` });
			}

			if (userDataToUpdate.password) {
				// Check if password is updated and if it is, check if it is valid
				if (!isValidPassword(req.body.password))
					return res.status(400).json({
						message: "Invalid password",
					});
				const hashedPassword = await bcrypt.hash(userDataToUpdate.password, await bcrypt.genSalt(10));
				userDataToUpdate.password = hashedPassword;
				userDataToUpdate.passwordUpdatedAt = new Date();
			}

			if (userDataToUpdate.birthdate) {
				// Check if birthdate is updated and if it is, check if user is major
				if (!isUserMajor(userDataToUpdate.birthdate))
					return res.status(400).json({ message: "Invalid birthdate" });
			}

			if (userDataToUpdate.role) {
				if (
					userDataToUpdate.role !== "ROLE_ADMIN" &&
					userDataToUpdate.role !== "ROLE_STORE_KEEPER" &&
					userDataToUpdate.role !== "ROLE_USER"
				)
					return res.status(400).json({ message: "Invalid role" });
			}

			if (userDataToUpdate.isValidate) {
				if (
					userDataToUpdate.isValidate !== true &&
					userDataToUpdate.isValidate !== false
				)
					return res.status(400).json({ message: "Invalid isValidate" });
			}

			if (userDataToUpdate.disabled) {
				if (
					userDataToUpdate.disabled !== true &&
					userDataToUpdate.disabled !== false
				)
					return res.status(400).json({ message: "Invalid disabled" });
			}

			if (userDataToUpdate.firstname) {
				if (userDataToUpdate.firstname.length < 2)
					return res.status(400).json({
						message: "Invalid firstname",
					});
			}

			if (userDataToUpdate.lastname) {
				if (userDataToUpdate.lastname.length < 2)
					return res.status(400).json({
						message: "Invalid lastname",
					});
			}

			if (userDataToUpdate.loginAttempts) {
				if (userDataToUpdate.loginAttempts < 0)
					return res.status(400).json({
						message: "Invalid loginAttempts",
					});
			}

			await user.update(userDataToUpdate);
			Object.assign(userMongo, userDataToUpdate);
			await userMongo.save();

			res.json(user);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while updating the user : ${error.message}`,
			});
		}
	},

	updatePassword: async (req, res) => {
		try {
			const { id } = req.params;
			const { oldPassword, newPassword } = req.body;

			if (!id)
				return res.status(400).json({ message: "Id parameter is missing" });

			const user = await User.findOne({ where: { id } });

			if (!user) return res.status(404).json({ message: "User not found" });

			if (!oldPassword || !newPassword)
				return res.status(400).json({ message: "Invalid arguments" });

			const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

			if (!isPasswordValid)
				return res.status(400).json({ message: "Invalid password" });

			if (!isValidPassword(newPassword))
				return res.status(400).json({
					message: "Invalid new password",
				});

			const hashedPassword = await bcrypt.hash(
				newPassword,
				await bcrypt.genSalt(10)
			);

			await user.update({ password: hashedPassword });

			res.sendStatus(200);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while updating the password : ${error.message}`,
			});
		}
	},

	deleteUser: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id)
				return res.status(400).json({ message: "Id parameter is missing" });

			const user = await User.findOne({ where: { id } });

			if (!user) return res.status(404).json({ message: "User not found" });

			const userMongo = await UserMongo.findOne({
				_id: new Types.ObjectId(id),
			});

			const encryptionKey = generateEncryptionKey();

			const anonymizedData = anonymizeUserData(user.toJSON(), encryptionKey);

			await sendDeletedAccountEmail(user.email, encryptionKey);

			await user.update(
				{ ...anonymizedData, encryptionKey, disabled: true },
				{ where: { id } }
			);

			userMongo.disabled = true;
			userMongo.firstname = null;
			userMongo.lastname = null;
			await userMongo.save();

			res.sendStatus(204);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while deleting the user : ${error.message}`,
			});
		}
	},

	recoverUser: async (req, res) => {
		try {
			const { id } = req.params;
			const { encryptionKey } = req.body;

			if (!id)
				return res.status(400).json({ message: "Id parameter is missing" });

			const user = await User.findOne({ where: { id } });

			if (!user) return res.status(404).json({ message: "User not found" });

			if (!user.disabled)
				return res.status(400).json({ message: "User is not disabled" });

			if (!encryptionKey)
				return res.status(400).json({ message: "Encryption key is missing" });

			if (encryptionKey !== user.encryptionKey)
				return res.status(400).json({ message: "Invalid encryption key" });

			const decryptedData = decryptUserData(user.toJSON(), encryptionKey);

			res.json(decryptedData);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while recovering the user : ${error.message}`,
			});
		}
	},
});
