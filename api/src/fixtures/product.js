import { ObjectId } from "mongodb";
import Modele from "../models/postgres-model.js";
import { v4 as uuidv4 } from "uuid";

const getRandomElement = (array) =>
	array[Math.floor(Math.random() * array.length)];
const generateRandomNumber = (min, max) =>
	Math.floor(Math.random() * (max - min + 1) + min);

const modelsFixture = await Modele.findAll();
const productsFixture = [];
const sizesFixture = [
	"38",
	"39",
	"40",
	"41",
	"42",
	"43",
	"44",
	"45",
	"46",
	"47",
	"48",
];
const colorsFixture = [
	"Red",
	"Blue",
	"Green",
	"Yellow",
	"Black",
	"White",
	"Orange",
	"Purple",
	"Pink",
	"Brown",
	"Grey",
	"Beige",
];
const vatsFixture = [10, 20, 30, 40];
const discountFixture = [0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 40, 50];

const QUANTITY_MIN = 1;
const QUANTITY_MAX = 50;
const PRICE_MIN = 30;
const PRICE_MAX = 300;

modelsFixture.forEach((model) => {
	Array.from({ length: 5 }).forEach(() => {
		const size = getRandomElement(sizesFixture);
		const color = getRandomElement(colorsFixture);
		const vat = getRandomElement(vatsFixture);
        const discount = getRandomElement(discountFixture);
		const price = generateRandomNumber(PRICE_MIN, PRICE_MAX) * 100;
		const quantity = generateRandomNumber(QUANTITY_MIN, QUANTITY_MAX);
		const sku = uuidv4();

		productsFixture.push({
			id: new ObjectId().toString(),
			name: `${model.name} ${color}`,
			color,
			size,
			vat,
			price,
			quantity,
			sku,
            discount,
			modelId: model.id,
		});
	});
});

export default productsFixture;
