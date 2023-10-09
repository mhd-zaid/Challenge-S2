import Brand from "../models/postgres-brand.js";
import BrandMongodb from "../models/mongodb-brand.js";

export const getBrands = async (req, res) => {
	try {
		const brands = await Brand.findAll({
			include: "models",
		});
		res.json(brands);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the brands : ${error}`,
		});
	}
};

export const createBrand = async (req, res) => {
	try {
		const brandMongo = await BrandMongodb(req.body).save();
		const id = brandMongo._id.toString();
		const brand = await Brand.create({ id, ...req.body });
		if (req.body.models !== undefined) {
			for (const model of req.body.models) {
				await brand.addModels(model.id);
			}
		}
		res.json(brand);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while creating the brand : ${error}`,
		});
	}
};

export const updateBrand = async (req, res) => {
	try {
		const { id } = req.params;
		const brandDataToUpdate = req.body;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const brand = await Brand.findOne({ where: { id } });
		const BrandMongo = await BrandMongodb.findOne({ _id: id }); 

		if (!brand) return res.status(404).json({ message: "Brand not found" });
		await BrandMongo.updateOne(brandDataToUpdate);
		await brand.update(brandDataToUpdate);
		res.json({ message: "Brand updated successfully" });
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while updating the brand : ${error}`,
		});
	}
};

export const deleteBrand = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Id parameter is missing" });
		}

		const brand = await Brand.findOne({ where: { id } });
		const brandMongo = await BrandMongodb.findOne({ _id: id });
		if (!brand) return res.status(404).json({ message: "Brand not found" });

		await brand.destroy();
		await brandMongo.updateOne({ deletedAt: new Date() });
		res.json({
			message: "Brand deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while deleting the brand : ${error}`,
		});
	}
};
