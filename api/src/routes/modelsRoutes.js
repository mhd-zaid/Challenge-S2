import Model from "../models/postgres-model.js";
import ModelMongodb from "../models/mongodb-model.js";

export const getModels = async (req, res) => {
	try {
		const models = await Model.findAll({
			include: ["Brand", "Category", "products"],
		});
		res.json(models);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the models : ${error}`,
		});
	}
};

export const createModel = async (req, res) => {
	try {
		const modelMongodb = await ModelMongodb(req.body).save();
		const id = modelMongodb._id;
		const model = await Model.create({ id, ...req.body });
		for (const product of req.body.products) {
			await model.addProducts(product.id);
		}

		res.json(model);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while creating the model : ${error}`,
		});
	}
};

export const updateModel = async (req, res) => {
	try {
		const { id } = req.params;
		const modelDataToUpdate = req.body;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const model = await Model.findOne({ where: { id } });
		const modelMongo = await modelMongodb.findOne({ _id: id });

		if (!model) return res.status(404).json({ message: "Model not found" });

		await model.update(modelDataToUpdate);
		await modelMongo.updateOne(modelDataToUpdate);

		res.json({ message: "Model updated successfully" });
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while updating the model : ${error}`,
		});
	}
};

export const deleteModel = async (req, res) => {
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
			error: `An error occurred while deleting the model : ${error}`,
		});
	}
};

export const getModel = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const model = await Model.findOne({
			where: { id },
			include: ["Brand", "Category", "products"],
		});

		if (!model) return res.status(404).json({ message: "Model not found" });

		res.json(model);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the model : ${error}`,
		});
	}
};
