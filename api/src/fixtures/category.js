import { ObjectId } from "mongodb";

const categoriesFixture = [
	{
		id: new ObjectId().toString(),
		name: "Lifestyle",
		description: "Chaussures de tous les jours pour hommes et femmes.",
	},
	{
		id: new ObjectId().toString(),
		name: "Running",
		description: "Chaussures de course pour hommes et femmes.",
	},
	{
		id: new ObjectId().toString(),
		name: "Basketball",
		description: "Chaussures de basketball pour hommes et femmes.",
	},
	{
		id: new ObjectId().toString(),
		name: "Football",
		description: "Chaussures de football pour hommes et femmes.",
	},
	{
		id: new ObjectId().toString(),
		name: "Training",
		description: "Chaussures de training pour hommes et femmes.",
	},
	{
		id: new ObjectId().toString(),
		name: "Skateboard",
		description: "Chaussures de skateboard pour hommes et femmes.",
	},
	{
		id: new ObjectId().toString(),
		name: "Golf",
		description: "Chaussures de golf pour hommes et femmes.",
	},
	{
		id: new ObjectId().toString(),
		name: "Tennis",
		description: "Chaussures de tennis pour hommes et femmes.",
	},
	{
		id: new ObjectId().toString(),
		name: "Walking",
		description: "Chaussures de marche à pied pour hommes et femmes.",
	},
];

export default categoriesFixture;
