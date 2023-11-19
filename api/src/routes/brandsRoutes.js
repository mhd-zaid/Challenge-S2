export default (Brand, ObjectId) => ({
	getBrands: async (req, res) => {
		try {
			const brands = await Brand.findAll({
				include: "models",
			});
			res.json(brands);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the brands : ${error.message}`,
			});
		}
	},

	createBrand: async (req, res) => {
		try {
			const id = new ObjectId().toString();
			const brand = await Brand.create({ id, ...req.body });
			if (req.body.models !== undefined) {
				for (const model of req.body.models) {
					await brand.addModels(model.id);
				}
			}
			res.json(brand);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while creating the brand : ${error.message}`,
			});
		}
	},
	updateBrand: async (req, res) => {
		try {
			const { id } = req.params;
			const brandDataToUpdate = req.body;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const brand = await Brand.findOne({ where: { id } });

			if (!brand) return res.status(404).json({ message: "Brand not found" });

			await brand.update(brandDataToUpdate);
			res.json({ message: "Brand updated successfully" });
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while updating the brand : ${error.message}`,
			});
		}
	},

	deleteBrand: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const brand = await Brand.findOne({ where: { id } });

			if (!brand) return res.status(404).json({ message: "Brand not found" });

			await brand.destroy();

			res.json({
				message: "Brand deleted successfully",
			});
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while deleting the brand : ${error.message}`,
			});
		}
	},

	getBrand: async (req, res) => {
		try {
			const { id } = req.params;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			const brand = await Brand.findOne({
				where: { id },
				include: "models",
			});
			if (!brand) return res.status(404).json({ message: "Brand not found" });
			res.json(brand);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the brand : ${error.message}`,
			});
		}
	},
});
