import {Sequelize} from "sequelize";
import dotenv from "dotenv";
import fs from "fs";

let envFile = ".env";
if (fs.existsSync(".env.local")) {
    envFile = ".env.local";
}

dotenv.config({path: envFile});

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    logging: false, // Désactive les logs Sequelize
});

sequelize.sync({alter: true}).then(() => {
    console.log("Database & tables created!");
});

export default sequelize;
