import sequelize from "./src/config/sequelize-config.js";
import Brand from "./src/models/postgres-brand.js";
import Category from "./src/models/postgres-category.js";
import Model from "./src/models/postgres-model.js";
import Product from "./src/models/postgres-product.js";
import User from "./src/models/postgres-user.js";
import Wish from "./src/models/postgres-wish.js";
import Order from "./src/models/postgres-order.js";
import Payment from "./src/models/postgres-payment.js";
import brandFixture from "./src/fixtures/brand.js";

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .then(() => sequelize.close());
