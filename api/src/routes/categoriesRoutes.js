export default (Category, ObjectId) => ({
	getCategories: async (req, res) => {
		try {
			const categories = await Category.findAll({
				include: "models",
			});
			res.status(200).json(categories);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the categories : ${error.message}`,
			});
		}
	},

	createCategory: async (req, res) => {
		try {
			if (!req.body.name) {
				return res
					.status(400)
					.json({ message: "Name parameter is missing" });
			}

			const id = new ObjectId().toString();
			const category = await Category.create({ id, ...req.body });

			res.status(201).json(category);
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				res.status(422).json({
					message: `An error occurred while creating the category : ${error.message}`,
				});
			} else {
				res.status(500).json({
					message: `An error occurred while creating the category : ${error.message}`,
				});
			}
		}
	},

	updateCategory: async (req, res) => {
		try {
			const { id } = req.params;
			const categoryDataToUpdate = req.body;

			if (!id) {
				return res
					.status(400)
					.json({ message: "Id parameter is missing" });
			}

			if (!categoryDataToUpdate.name) {
				return res
					.status(400)
					.json({ message: "Name parameter is missing" });
			}

			const category = await Category.findOne({ where: { id } });

			if (!category)
				return res.status(404).json({ message: "Category not found" });

			await category.update(categoryDataToUpdate);

			res.status(200).json({ message: "Category updated successfully" });
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				res.status(422).json({
					message: `An error occurred while creating the category : ${error.message}`,
				});
			} else {
				res.status(500).json({
					message: `An error occurred while creating the category : ${error.message}`,
				});
			}
		}
	},

	deleteCategory: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res
					.status(400)
					.json({ message: "Id parameter is missing" });
			}

			const category = await Category.findOne({ where: { id } });

			if (!category)
				return res.status(404).json({ message: "Category not found" });

			await category.destroy();
			res.status(204).json({
				message: "Category deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while deleting the category : ${error.message}`,
			});
		}
	},

	getCategory: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res
					.status(400)
					.json({ message: "Id parameter is missing" });
			}

			const category = await Category.findOne({
				where: { id },
				include: "models",
			});
			if (!category)
				return res.status(404).json({ message: "Category not found" });

			res.status(200).json(category);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the category : ${error.message}`,
			});
		}
	},
});
