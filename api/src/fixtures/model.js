import { ObjectId } from "mongodb";
import Category from "../models/postgres-category.js";
import Brand from "../models/postgres-brand.js";

const modelsData = [
	{
		name: "Air Max 90",
		gender: "male",
		description: "Chaussures de ville pour hommes",
		categoryName: "Lifestyle",
		brandName: "Nike",
	},
	{
		name: "Ultra Boost",
		gender: "female",
		description: "Chaussures de sport pour femmes",
		categoryName: "Running",
		brandName: "Adidas",
	},
	{
		name: "Classic Leather",
		gender: "male",
		description: "Chaussures décontractées pour hommes",
		categoryName: "Lifestyle",
		brandName: "Reebok",
	},
	{
		name: "Zoom Pegasus",
		gender: "female",
		description: "Chaussures de course pour femmes",
		categoryName: "Running",
		brandName: "Nike",
	},
	{
		name: "Superstar",
		gender: "male",
		description: "Chaussures de basketball pour hommes",
		categoryName: "Basketball",
		brandName: "Adidas",
	},
	{
		name: "Gazelle",
		gender: "female",
		description: "Chaussures de sport rétro pour femmes",
		categoryName: "Lifestyle",
		brandName: "Adidas",
	},
	{
		name: "Air Force 1",
		gender: "male",
		description: "Chaussures décontractées pour hommes",
		categoryName: "Lifestyle",
		brandName: "Nike",
	},
	{
		name: "FuelCell Echo",
		gender: "female",
		description: "Chaussures de course pour femmes",
		categoryName: "Running",
		brandName: "New Balance",
	},
	{
		name: "Classic Nylon",
		gender: "male",
		description: "Chaussures de sport pour hommes",
		categoryName: "Lifestyle",
		brandName: "Reebok",
	},
	{
		name: "React Infinity Run",
		gender: "female",
		description: "Chaussures de course pour femmes",
		categoryName: "Running",
		brandName: "Nike",
	},
	{
		name: "Chuck Taylor All Star",
		gender: "male",
		description: "Chaussures de basket emblématiques pour hommes",
		categoryName: "Basketball",
		brandName: "Converse",
	},
	{
		name: "Suede Classic",
		gender: "female",
		description: "Chaussures décontractées pour femmes",
		categoryName: "Lifestyle",
		brandName: "Puma",
	},
	{
		name: "Nano X",
		gender: "male",
		description: "Chaussures de training pour hommes",
		categoryName: "Training",
		brandName: "Reebok",
	},
	{
		name: "Air Zoom Structure",
		gender: "female",
		description: "Chaussures de course pour femmes",
		categoryName: "Running",
		brandName: "Nike",
	},
	{
		name: "Old Skool",
		gender: "male",
		description: "Chaussures de skateboard pour hommes",
		categoryName: "Skateboard",
		brandName: "Vans",
	},
	{
		name: "Retro Rocket",
		gender: "female",
		description: "Chaussures rétro pour femmes",
		categoryName: "Lifestyle",
		brandName: "Fila",
	},
	{
		name: "Club C",
		gender: "male",
		description: "Chaussures de tennis pour hommes",
		categoryName: "Tennis",
		brandName: "Reebok",
	},
	{
		name: "Air Zoom Winflo",
		gender: "female",
		description: "Chaussures de course pour femmes",
		categoryName: "Running",
		brandName: "Nike",
	},
	{
		name: "Gel-Kayano",
		gender: "male",
		description: "Chaussures de running pour hommes",
		categoryName: "Running",
		brandName: "Asics",
	},
	{
		name: "Blazer",
		gender: "female",
		description: "Chaussures de basketball pour femmes",
		categoryName: "Basketball",
		brandName: "Nike",
	},
];

const modelsFixture = await Promise.all(
	modelsData.map(async (model) => {
		const [category, brand] = await Promise.all([
			Category.findOne({ where: { name: model.categoryName } }),
			Brand.findOne({ where: { name: model.brandName } }),
		]);

		const categoryId = category ? category.id : null;
		const brandId = brand ? brand.id : null;

		return {
			id: new ObjectId().toString(),
			name: model.name,
			gender: model.gender,
			description: model.description,
			CategoryId: categoryId,
			BrandId: brandId,
		};
	})
);

export default modelsFixture;
