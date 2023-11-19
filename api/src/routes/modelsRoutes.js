export default (Model,ObjectId) => ({
	getModels: async (req, res) => {
		try {
			const models = await Model.findAll({
				include: ["Brand", "Category"],
			});
			res.json(models);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the models : ${error.message}`,
			});
		}
	},

	createModel: async (req, res) => {
		try {
			const id = new ObjectId().toString();
			const model = await Model.create({ id, ...req.body});
			res.json(model);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while creating the model : ${error.message}`,
			});
		}
},

	updateModel: async (req, res) => {
		try {
			const { id } = req.params;
			const modelDataToUpdate = req.body;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const model = await Model.findOne({ where: { id } });

			if (!model) return res.status(404).json({ message: "Model not found" });

			await model.update(modelDataToUpdate);

			res.json({ message: "Model updated successfully" });
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while updating the model : ${error.message}`,
			});
		}
	},

	deleteModel: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const model = await Model.findOne({ where: { id } });

			if (!model) return res.status(404).json({ message: "Model not found" });

			await model.destroy();

			res.json({
				message: "Model deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while deleting the model : ${error.message}`,
			});
		}
	},

	getModel: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const model = await Model.findOne({
				where: { id },
				include: ["Brand", "Category", "Products"],
			});

			if (!model) return res.status(404).json({ message: "Model not found" });

			res.json(model);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the model : ${error.message}`,
			});
		}
	},
});
