import Category from "../models/postgres-category.js";
import CategoryMongodb from "../models/mongodb-category.js";

export const getCategories = async (req, res) => {
	try {
		const categories = await Category.findAll({
			include: "models",
		});
		res.json(categories);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the categories : ${error}`,
		});
	}
};

export const createCategory = async (req, res) => {
	try {
		const categoryMongodb = await CategoryMongodb(req.body).save();
		const id = categoryMongodb._id.toString();
		const category = await Category.create({ id, ...req.body });
		if (req.body.models !== undefined) {
			for (const model of req.body.models) {
				await category.addModels(model.id);
			}
		}
		res.json(category);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while creating the category : ${error}`,
		});
	}
};

export const updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const categoryDataToUpdate = req.body;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const category = await Category.findOne({ where: { id } });
		const categoryMongo = await CategoryMongodb.findOne({ _id: id });

		if (!category)
			return res.status(404).json({ message: "Category not found" });

		await category.update(categoryDataToUpdate);
		await categoryMongo.updateOne(categoryDataToUpdate);
		res.json({ message: "Category updated successfully" });
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while updating the category : ${error}`,
		});
	}
};

export const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const category = await Category.findOne({ where: { id } });
		const categoryMongo = await CategoryMongodb.findOne({ _id: id });

		if (!category)
			return res.status(404).json({ message: "Category not found" });

		await category.destroy();
		await categoryMongo.updateOne({ deletedAt: new Date() });
		res.json({
			message: "Category deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while deleting the category : ${error}`,
		});
	}
};

export const getCategory = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const category = await Category.findOne({
			where: { id },
			include: "models",
		});
		if (!category)
			return res.status(404).json({ message: "Category not found" });

		res.json(category);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the category : ${error}`,
		});
	}
};