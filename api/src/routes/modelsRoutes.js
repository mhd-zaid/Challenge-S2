export default (Model, ObjectId) => ({
	getModels: async (req, res) => {
		try {
			const models = await Model.findAll({
				include: ["Brand", "Category", "products"],
			});

			res.status(200).json(models);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the models : ${error.message}`,
			});
		}
	},

	createModel: async (req, res) => {
		try {
			if (!req.body.name) {
				return res.status(400).json({ message: "Name parameter is missing" });
			}
			if (!req.body.BrandId) {
				return res.status(400).json({ message: "BrandId parameter is missing" });
			}
			if (!req.body.CategoryId) {
				return res.status(400).json({ message: "CategoryId parameter is missing" });
			}

			const id = new ObjectId().toString();
			const model = await Model.create({ id, ...req.body });
			res.status(201).json(model);
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				res.status(422).json({
					message: `An error occurred while creating the model : ${error.message}`,
				});
			} else {
				res.status(500).json({
					message: `An error occurred while creating the model : ${error.message}`,
				});
			}
		}
	},

	updateModel: async (req, res) => {
		try {
			const { id } = req.params;
			const modelDataToUpdate = req.body;

			if (!id) {
				return res
					.status(400)
					.json({ message: "Id parameter is missing" });
			}

			switch (modelDataToUpdate) {
				case !modelDataToUpdate.name:
					return res
						.status(400)
						.json({ message: "Name parameter is missing" });
				case !modelDataToUpdate.BrandId:
					return res
						.status(400)
						.json({ message: "BrandId parameter is missing" });
				case !modelDataToUpdate.CategoryId:
					return res
						.status(400)
						.json({ message: "CategoryId parameter is missing" });
			}

			const model = await Model.findOne({ where: { id } });

			if (!model)
				return res.status(404).json({ message: "Model not found" });

			await model.update(modelDataToUpdate);

			res.status(200).json({ message: "Model updated successfully" });
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				res.status(422).json({
					message: `An error occurred while creating the model : ${error.message}`,
				});
			} else {
				res.status(500).json({
					message: `An error occurred while updating the model : ${error.message}`,
				});
			}
		}
	},

	deleteModel: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res
					.status(400)
					.json({ message: "Id parameter is missing" });
			}

			const model = await Model.findOne({ where: { id } });

			if (!model)
				return res.status(404).json({ message: "Model not found" });

			await model.destroy();

			res.status(204).json({ message: "Model deleted successfully" });
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
				return res
					.status(400)
					.json({ message: "Id parameter is missing" });
			}

			const model = await Model.findOne({
				where: { id },
				include: ["Brand", "Category", "products"],
			});

			if (!model)
				return res.status(404).json({ message: "Model not found" });

			res.status(200).json(model);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the model : ${error.message}`,
			});
		}
	},
});
