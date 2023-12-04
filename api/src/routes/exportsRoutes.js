export default (
	exportData,
	exportPersonalData,
	Export,
	dataToCSV,
	path,
	fs,
	User
) => {
	const createExport = async (dataScope, csv) => {
		const currentModuleFile = new URL(import.meta.url).pathname;
		const currentModuleDirectory = path.dirname(currentModuleFile);

		const fileName = `${dataScope}-${new Date()
			.toLocaleDateString("fr-FR")
			.replaceAll("/", "-")}-${Math.random().toString(36).slice(2)}.csv`;
		const filePath = path.join(
			currentModuleDirectory,
			"../../uploads/exports",
			fileName
		);
		fs.writeFileSync(filePath, csv);
		// create export and get id
		const exportToCreate = new Export({
			dataScope,
			fileName,
		});
		await exportToCreate.save();

		console.log(`Exported ${dataScope} successfully`);
		return { exportId: exportToCreate._id, fileName };
	};

	return {
		requestExport: async (req, res) => {
			try {
				const dataScope = req.body.dataScope;
				if (dataScope === "users") {
					const user = await User.findOne({
						where: { id: req.user.userId },
					});
					if (user.role !== "ROLE_ADMIN") {
						return res.status(403).send("Not authorized");
					}
				}
				const data = await exportData(dataScope);
				const csv = await dataToCSV(data);
				const { exportId, fileName } = await createExport(
					dataScope,
					csv
				);
				return res.json({ exportId, fileName });
			} catch (err) {
				console.error(err);
				return res.sendStatus(500);
			}
		},
		personalDataExport: async (req, res) => {
			try {
				const userId = req.params.id;
				const data = await exportPersonalData(userId);
				const csv = await dataToCSV(data);

				const { exportId, fileName } = await createExport(
					"personalData",
					csv
				);

				return res.json({ exportId, fileName });
			} catch (err) {
				console.error(err);
				return res.sendStatus(500);
			}
		},
		getExports: async (req, res) => {
			try {
				const user = await User.findOne({
					where: { id: req.user.userId },
				});
				const query = { dataScope: { $ne: "personalData" } };
				if (user.role !== "ROLE_ADMIN")
					query.dataScope = { $nin: ["personalData", "users"] };
				const exports = await Export.find({
					dataScope: query.dataScope,
				});
				return res.status(200).json(exports);
			} catch (err) {
				console.error(err);
				return res
					.status(500)
					.json(`Error while getting exports: ${err.message}`);
			}
		},
		getExport: async (req, res) => {
			try {
				const user = await User.findOne({
					where: { id: req.user.userId },
				});
				const exportToFind = await Export.findById(req.params.id);
				if (!exportToFind) return res.sendStatus(404);
				if (
					user.role !== "ROLE_ADMIN" &&
					exportToFind.dataScope === "users"
				)
					return res.sendStatus(403);
				return res.status(200).json(exportToFind);
			} catch (err) {
				console.error(err);
				return res.sendStatus(500);
			}
		},
		removeExport: async (req, res) => {
			try {
				const exportToRemove = await Export.findById(req.params.id);
				await Export.deleteOne({ _id: req.params.id });

				const currentModuleFile = new URL(import.meta.url).pathname;
				const currentModuleDirectory = path.dirname(currentModuleFile);

				const filePath = path.join(
					currentModuleDirectory,
					"../../uploads/exports",
					exportToRemove.fileName
				);
				if (fs.existsSync(filePath)) {
					fs.unlink(filePath, (err) => {
						if (err) {
							console.error(
								`Error deleting ${filePath}: ${err.message}`
							);
						} else {
							console.log(`Deleted ${filePath}`);
						}
					});
				} else {
					console.log(`${filePath} does not exist.`);
				}

				return res.sendStatus(200);
			} catch (err) {
				console.error(err);
				return res.sendStatus(500);
			}
		},
	};
};
