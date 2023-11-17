import sequelize from "./src/config/sequelize-config.js";
import mongoose from 'mongoose';
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
// Models
import Brand from "./src/models/postgres-brand.js";
import Category from "./src/models/postgres-category.js";
import Model from "./src/models/postgres-model.js";
import Product from "./src/models/postgres-product.js";
import User from "./src/models/postgres-user.js";
import Wish from "./src/models/postgres-wish.js";
import Order from "./src/models/postgres-order.js";
import Payment from "./src/models/postgres-payment.js";
import ProductMongoDB from "./src/models/mongodb-product.js";
import OrderMongodb from "./src/models/mongodb-order.js";
import UserMongodb from "./src/models/mongodb-user.js";
import ProductHistoryMongodb from "./src/models/mongodb-productHistory.js";
// Fixtures
import brandsFixture from "./src/fixtures/brand.js";
import categoriesFixture from "./src/fixtures/category.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("MongoDB connected")).catch((err) => console.log(err));

await ProductMongoDB.collection.drop();
await OrderMongodb.collection.drop();
await UserMongodb.collection.drop();
await ProductHistoryMongodb.collection.drop();

await ProductMongoDB.createCollection();
await OrderMongodb.createCollection();
await UserMongodb.createCollection();
await ProductHistoryMongodb.createCollection();

sequelize
    .sync({ force: true })
    .then(() => console.log("Database dropped"))
    .then(() => brandsFixture.forEach(brand => Brand.create(brand)))
    .then(() => console.log("Brands loaded"))
    .then(() => categoriesFixture.forEach(category => Category.create(category)))
    .then(() => console.log("Categories loaded"))
    .then(async () => {
        const modelsFixtureModule = await import("./src/fixtures/model.js");
        const modelsFixture = modelsFixtureModule.default;

        modelsFixture.forEach(model => Model.create(model))
    })
    .then(() => console.log("Models loaded"))
    .then(async () => {
        const productsFixtureModule = await import("./src/fixtures/product.js");
        const productsFixture = productsFixtureModule.default;

        productsFixture.forEach(product => Product.create(product))
    })
    .then(() => console.log("Products loaded"))

const products = await Product.findAll({ include: ["model"] });

products.forEach(async (product) => {
    const model = product.model;
    const category = (await Model.findOne({ where: { id: model.id }, include: ["Category"] })).Category;
    const brand = (await Model.findOne({ where: { id: model.id }, include: ["Brand"] })).Brand;

    const productMongo = {
        _id: new ObjectId(product.id),
        name: product.name,
        price: product.price,
        vat: product.vat,
        quantity: product.quantity,
        size: product.size,
        color: product.color,
        discount: product.discount,
        alerteQuantity: product.alerteQuantity,
        sku: product.sku,
        model: model.dataValues,
        category: category.dataValues,
        brand: brand.dataValues,
        deletedAt: product.deletedAt,
    };

    await ProductMongoDB(productMongo).save();
});

console.log("Products synced in MongoDB");