import sequelize from "./src/config/sequelize-config.js";
import mongoose from "mongoose";
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
import Product_Images from "./src/models/postgres-product-images.js";

dotenv.config();

const connectDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MongoDB connected");
	} catch (err) {
		console.error(err);
	}
};

const dropCollections = async () => {
	try {
		await ProductMongoDB.collection.drop();
		await OrderMongodb.collection.drop();
		await UserMongodb.collection.drop();
		await ProductHistoryMongodb.collection.drop();
		console.log("Collections dropped");
	} catch (err) {
		console.error(err);
	}
};

const createCollections = async () => {
	try {
		await ProductMongoDB.createCollection();
		await OrderMongodb.createCollection();
		await UserMongodb.createCollection();
		await ProductHistoryMongodb.createCollection();
		console.log("Collections created");
	} catch (err) {
		console.error(err);
	}
};

const syncDatabase = async () => {
	try {
		await sequelize.sync({ force: true });
		console.log("Database dropped");
	} catch (err) {
		console.error(err);
	}
};

const loadBrands = async () => {
	try {
		await Promise.all(brandsFixture.map((brand) => Brand.create(brand)));
		console.log("Brands loaded");
	} catch (err) {
		console.error(err);
	}
};

const loadCategories = async () => {
	try {
		await Promise.all(
			categoriesFixture.map((category) => Category.create(category))
		);
		console.log("Categories loaded");
	} catch (err) {
		console.error(err);
	}
};

const loadModels = async () => {
	try {
		const modelsFixtureModule = await import("./src/fixtures/model.js");
		const modelsFixture = modelsFixtureModule.default;
		await Promise.all(modelsFixture.map((model) => Model.create(model)));
		console.log("Models loaded");
	} catch (err) {
		console.error(err);
	}
};

const loadProducts = async () => {
	try {
		const productsFixtureModule = await import("./src/fixtures/product.js");
		const productsFixture = productsFixtureModule.default;

		await Promise.all(
			productsFixture.map(async (product) => {
				const sqlProduct = await Product.create(product);
				const model = await Model.findOne({
					where: { id: sqlProduct.modelId },
					include: ["Category", "Brand"],
				});
				const category = model.Category;
				const brand = model.Brand;
				const productMongo = {
					_id: new ObjectId(product.id),
					name: sqlProduct.name,
					price: sqlProduct.price,
					vat: sqlProduct.vat,
					quantity: sqlProduct.quantity,
					size: sqlProduct.size,
					color: sqlProduct.color,
					discount: sqlProduct.discount,
					alertQuantity: sqlProduct.alertQuantity,
					sku: sqlProduct.sku,
					model: model.dataValues,
					category: category.dataValues,
					brand: brand.dataValues,
					deletedAt: sqlProduct.deletedAt,
				};

				await ProductMongoDB(productMongo).save();
			})
		);
		console.log("Products loaded");
	} catch (err) {
		console.error(err);
	}
};

const loadProductsImages = async () => {
	try {
		const productsImagesFixtureModule = await import(
			"./src/fixtures/product-image.js"
		);
		const productsImagesFixture = productsImagesFixtureModule.default;
		await Promise.all(
			productsImagesFixture.map((productImage) =>
				Product_Images.create(productImage)
			)
		);
		console.log("Products images loaded");
	} catch (err) {
		console.error(err);
	}
};

const loadUsers = async () => {
	try {
		const usersFixtureModule = await import("./src/fixtures/user.js");
		const usersFixture = usersFixtureModule.default;
		await Promise.all(usersFixture.map((user) => User.create(user)));
		console.log("Users loaded");
	} catch (err) {
		console.error(err);
	}
};

const loadOrders = async () => {
	try {
		const ordersFixtureModule = await import("./src/fixtures/order.js");
		const ordersFixture = ordersFixtureModule.default;
		const productsFixture = await Product.findAll();
		await Promise.all(ordersFixture.map(async (order) => {
			let sqlOrder = await Order.create(order);
			for (let i = 0; i < Math.floor(Math.random() * 5) +1 ; i++) {
				const product = productsFixture[Math.floor(Math.random() * productsFixture.length)];
				await sqlOrder.addProduct(product, {
					through: {
						quantity: Math.floor(Math.random() * 5) + 1,
						price: parseInt(product.price),
					}
				});
			}
			sqlOrder = await Order.findOne({where: {id: sqlOrder.id}, include: ["user","products"]});
			const orderMongo = {
				_id: new ObjectId(sqlOrder.id),
				user: sqlOrder.user.dataValues,
				status: sqlOrder.status,
				deliveryAddress: sqlOrder.deliveryAddress,
				products: sqlOrder.products.map((product) => {
					return {
						id: "655fa0ca6ec65e5a6c725ef1",
						sku: "f5edce59-3a64-4a27-b539-e774599d6c9b",
						name: "Energy Walk 41 Yellow",
						quantity: product.Orders_Products.quantity,
						price: product.Orders_Products.price,
						size: product.size,
						color: product.color,
						modelId: product.modelId,
					};
				}),
			};
			await OrderMongodb(orderMongo).save();
		}));
		console.log("Orders loaded");
	} catch (err) {
		console.error(err);
	}
};

const main = async () => {
	try {
		await connectDatabase();
		await dropCollections();
		await createCollections();
		await syncDatabase();
		await loadBrands();
		await loadCategories();
		await loadModels();
		await loadProducts();
		await loadProductsImages();
		await loadUsers();
		await loadOrders();
	} catch (error) {
		console.error(error);
	} finally {
		sequelize.close();
		mongoose.connection.close();
	}
};

main();
