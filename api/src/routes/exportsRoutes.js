export default (exportData, Export, dataToCSV, path, fs) => ({
	requestExport: async (req, res) => {
		try {
			const dataScope = req.body.dataScope;
			const data = await exportData(dataScope);
			const csv = await dataToCSV(data);

			const currentModuleFile = new URL(import.meta.url).pathname;
			const currentModuleDirectory = path.dirname(currentModuleFile);

			const fileName = `${dataScope}-${new Date()
				.toLocaleDateString("fr-FR")
				.replaceAll("/", "-")}-${Math.random()
				.toString(36)
				.slice(2)}.csv`;
			const filePath = path.join(
				currentModuleDirectory,
				"../../uploads/exports",
				fileName
			);
			fs.writeFileSync(filePath, csv);
			await Export.create({
				dataScope,
				fileName,
			});
			console.log(`Exported ${dataScope} successfully`);
			return res.json({ fileName });
		} catch (err) {
			console.error(err);
			return res.sendStatus(500);
		}
	},
	getExports: async (req, res) => {
		try {
			const exports = await Export.find();
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
			const exportToFind = await Export.findById(req.params.id);
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
});
