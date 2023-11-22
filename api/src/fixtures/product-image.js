import { v4 as uuidv4 } from "uuid";
import Product from "../models/postgres-product.js";

const images = [
	"4f7bff75-6f86-4101-b629-3ed0b44b4b87.webp",
	"6acedb46-7fa4-40e1-9bd2-dbb651e986a3.webp",
	"8dafdebb-863d-48a8-9224-614a192a3ef6.webp",
	"9bc016bc-cd7a-49cc-a399-47930b00c59f.webp",
	"146ac543-f69c-441a-a4dd-2e1add33b6ea.webp",
	"b8bf34f1-f3c4-43ee-9591-db70497b8125.webp",
	"c2643901-9e8c-41b5-b17d-36802f3102e9.webp",
	"e2b04ea8-84fb-432f-bec6-e4a420e098e3.webp",
	"e6da41fa-1be4-4ce5-b89c-22be4f1f02d4.webp",
	"e3689ad1-9b7e-4518-81a8-6e0beb714491.webp",
];
const imagesFixture = [];

const products = await Product.findAll();

for (const product of products) {
	for (let i = 0; i < 3; i++) {
		const img = images[Math.floor(Math.random() * images.length)];
		imagesFixture.push({
			id: uuidv4(),
			url: img,
			ProductId: product.id,
		});
	}
}

export default imagesFixture;
