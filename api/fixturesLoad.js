import sequelize from "./src/config/sequelize-config.js";
// Models
import Brand from "./src/models/postgres-brand.js";
import Category from "./src/models/postgres-category.js";
import Model from "./src/models/postgres-model.js";
import Product from "./src/models/postgres-product.js";
import User from "./src/models/postgres-user.js";
import Wish from "./src/models/postgres-wish.js";
import Order from "./src/models/postgres-order.js";
import Payment from "./src/models/postgres-payment.js";
// Fixtures
import brandsFixture from "./src/fixtures/brand.js";
import categoriesFixture from "./src/fixtures/category.js";

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