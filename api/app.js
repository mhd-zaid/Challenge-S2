import express from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import dotenv from "dotenv";
import auth from "./src/router/authRouter.js";
import users from "./src/router/usersRouter.js";
import categories from "./src/router/categoriesRouter.js";
import brands from "./src/router/brandsRouter.js";
import models from "./src/router/modelsRouter.js";
import products from "./src/router/productsRouter.js";
import stats from "./src/router/statsRouter.js";
import carts from "./src/router/cartsRouter.js";
import wishes from "./src/router/wishsRouter.js";
import sequelize from "./src/config/sequelize-config.js";
import mailTransporter from "./src/config/mail-config.js";
import passwordRenewal from "./src/scripts/passwordRenewal.js";
import mongodbProduct from "./src/models/mongodb-product.js";
import mongodbModel from "./src/models/mongodb-model.js";
import mongodbBrand from "./src/models/mongodb-brand.js";
import mongodbCategory from "./src/models/mongodb-category.js";
import fileUpload from "express-fileupload";
import stripe from "./src/config/stripe-config.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(fileUpload());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

// Routes
app.use("/auth", auth);
app.use("/users", users);
app.use("/categories", categories);
app.use("/brands", brands);
app.use("/models", models);
app.use("/products", products);
app.use("/stats/", stats);
app.use("/carts", carts);
app.use("/wishes", wishes);

// CRON job
cron.schedule("0 0 * * *", async () => {
	passwordRenewal();
});

// MongoDB
try {
	mongoose
		.connect(process.env.MONGODB_URI)
		.then(console.log("Connected to MongoDB"));
} catch (e) {
	console.error(`Error connecting to MongoDB: ${e}`);
}

// Sequelize
try {
	sequelize.authenticate().then(console.log("Connected to postgres"));
} catch (e) {
	console.error(`Error connecting to postgres: ${e}`);
}

// mail
try {
	mailTransporter
		.verify()
		.then(console.log("SMTP server authentification succeed"));
} catch (e) {
	console.error(`Error connecting to mail: ${e}`);
}

// Stripe
try {
	const storeItems = new Map([]);
	const items = [
		{
			id: "1",
			name: "T-shirt",
			price: 100,
			quantity: 1,
		},
		{
			id: "2",
			name: "Pantalon",
			price: 200,
			quantity: 1,
		},
		{
			id: "3",
			name: "Chaussure",
			price: 300,
			quantity: 1,
		},
	];
	items.map(item => {
		storeItems.set(item.id, item);
	});
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		mode: "payment",
		line_items: items.map(item => {
		  const storeItem = storeItems.get(item.id);
		  return {
			price_data: {
			  currency: "eur",
			  product_data: {
				name: storeItem.name,
			  },
			  unit_amount: storeItem.price,
			},
			quantity: storeItem.quantity,
		  }
		}),
		success_url: 'http://localhost:3000/payment/success',
		cancel_url: 'http://localhost:3000/payment/failed',
		client_reference_id: JSON.stringify({
		  orderId: '1',
		  items: items,
		}),
	  });
	  console.log(session);
} catch (e) {
	console.error(`Error connecting to stripe: ${e}`);
}

export default app;
