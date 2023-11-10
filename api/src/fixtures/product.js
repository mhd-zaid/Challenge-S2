import { ObjectId } from "mongodb";
import Modele from "../models/postgres-model.js";
import {v4 as uuidv4} from "uuid";

const modelsFixture =  await Modele.findAll();
const productsFixture = []
const sizesFixture = ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'];
const colorsFixture = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Orange', 'Purple', 'Pink', 'Brown', 'Grey', 'Beige'];
const vatsFixture = [0.2, 0.1, 0.05, 0.0];

for(const model of modelsFixture) {
    for (let i = 0; i < 5 ; i++) {
        const size = sizesFixture[Math.floor(Math.random() * sizesFixture.length)];
        const color = colorsFixture[Math.floor(Math.random() * colorsFixture.length)];
        const vat = vatsFixture[Math.floor(Math.random() * vatsFixture.length)];
        const price = Math.floor(Math.random() * (300 - 30 + 1) + 30) * 100;
        const quantity = Math.floor(Math.random() * (50 - 1 + 1) + 1);
        const sku = uuidv4();
        productsFixture.push({
            id: new ObjectId().toString(),
            name: `${model.name} ${size} ${color}`,
            color: color,
            size: size,
            vat: vat,
            price: price,
            quantity: quantity,
            sku: sku,
            modelId: model.id,
        })
    }
}

export default productsFixture;