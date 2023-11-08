export default (Model, ModelMongodb, CategoryMongodb, BrandMongodb,ObjectId) => ({
	getModels: async (req, res) => {
		try {
			const models = await Model.findAll({
				include: ["Brand", "Category", "Products"],
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
			const brandMongo = await BrandMongodb.findOne({
				_id: new ObjectId(req.body.BrandId),
			});
			const categoryMongo = await CategoryMongodb.findOne({
				_id: new ObjectId(req.body.CategoryId),
			});

		const modelMongodb = await ModelMongodb({
			name: req.body.name,
			gender: req.body.gender,
			description: req.body.description,
			category: categoryMongo,
			brand: brandMongo,
		}).save();
		const id = modelMongodb._id.toString();
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
			const modelMongo = await ModelMongodb.findOne({ _id: id });

			if (!model) return res.status(404).json({ message: "Model not found" });

			await model.update(modelDataToUpdate);
			await modelMongo.updateOne(modelDataToUpdate);

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
			const modelMongo = await ModelMongodb.findOne({ _id: id });

			if (!model) return res.status(404).json({ message: "Model not found" });

			await model.destroy();
			await modelMongo.updateOne({ deletedAt: new Date() });

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
