import { ObjectId } from "mongodb";
import User from "../models/postgres-user.js";

const usersFixture = await User.findAll({ where: { role: "ROLE_USER" } });

const addresses = [
	"242 Rue Lecourbe, 75015 Paris, France",
	"67 Rue du Palais, 95120 Ermont, France",
	"93 cours Jean Jaures, 33100 Bordeaux, France",
	"67 avenue Ferdinand de Lesseps, 38100 Grenoble, France",
	"86 rue de l'Aigle, 93210 Saint-Denis, France",
	"66 rue du Fossé des Tanneurs, 77200 Torcy, France",
	"14 rue des Coudriers, 31600 Muret, France",
];

const ordersFixture = [];

for (let i = 0; i < 50; i++) {
	ordersFixture.push({
		id: new ObjectId().toString(),
		userId: usersFixture[Math.floor(Math.random() * usersFixture.length)]
			.id,
		status: "delivered",
		deliveryAddress:
			addresses[Math.floor(Math.random() * addresses.length)],
	});
}

export default ordersFixture;
