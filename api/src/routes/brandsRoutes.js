export default (Brand, ObjectId) => ({
	getBrands: async (req, res) => {
		try {
			const brands = await Brand.findAll({
				include: "models",
			});
			res.status(200).json(brands);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the brands : ${error.message}`,
			});
		}
	},

	createBrand: async (req, res) => {
		try {
			if (!req.body.name) {
				return res.status(400).json({ message: "Name parameter is missing" });
			}

			const id = new ObjectId().toString();
			const brand = await Brand.create({ id, ...req.body });
			
			res.status(201).json(brand);
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				res.status(422).json({
					message: `An error occurred while creating the brand : ${error.message}`,
				});
			}else {
				res.status(500).json({
					message: `An error occurred while creating the brand : ${error.message}`,
				});
			}
		}
	},
	updateBrand: async (req, res) => {
		try {

			const { id } = req.params;
			const brandDataToUpdate = req.body;

			if (!id) {
				return res.status(400).json({ message: "Id parameter is missing" });
			}

			if (!brandDataToUpdate.name) {
				return res.status(400).json({ message: "Name parameter is missing" });
			}

			const brand = await Brand.findOne({ where: { id } });

			if (!brand) return res.status(404).json({ message: "Brand not found" });

			await brand.update(brandDataToUpdate);

			res.status(200).json({ message: "Brand updated successfully" });
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				res.status(422).json({
					message: `An error occurred while creating the brand : ${error.message}`,
				});
			}else {
				res.status(500).json({
					message: `An error occurred while updating the brand : ${error.message}`,
				});
			}
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

			res.status(204).json({
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

			res.status(200).json(brand);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the brand : ${error.message}`,
			});
		}
	},
});
