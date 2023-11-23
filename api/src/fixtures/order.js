import { ObjectId } from "mongodb";
import User  from "../models/postgres-user.js";

const usersFixture = await User.findAll({where: {role: "ROLE_USER"}});

const ordersFixture = [
    {
        id: new ObjectId().toString(),
        userId: usersFixture[Math.floor(Math.random() * usersFixture.length)].id,
        status: "payment pending",
        deliveryAddress: "242 Rue Lecourbe, 75015 Paris, France",
    },
    {
        id: new ObjectId().toString(),
        userId: usersFixture[Math.floor(Math.random() * usersFixture.length)].id,
        status: "payment pending",
        deliveryAddress: "67 Rue du Palais, 95120 Ermont, France",
    },
    {
        id: new ObjectId().toString(),
        userId: usersFixture[Math.floor(Math.random() * usersFixture.length)].id,
        status: "payment pending",
        deliveryAddress: "93 cours Jean Jaures, 33100 Bordeaux, France",
    },
    {
        id: new ObjectId().toString(),
        userId: usersFixture[Math.floor(Math.random() * usersFixture.length)].id,
        status: "payment pending",
        deliveryAddress: "67 avenue Ferdinand de Lesseps, 38100 Grenoble, France",
    },
    {
        id: new ObjectId().toString(),
        userId: usersFixture[Math.floor(Math.random() * usersFixture.length)].id,
        status: "payment pending",
        deliveryAddress: "86 rue de l'Aigle, 93210 Saint-Denis, France",
    },
    {
        id: new ObjectId().toString(),
        userId: usersFixture[Math.floor(Math.random() * usersFixture.length)].id,
        status: "payment pending",
        deliveryAddress: "66 rue du Fossé des Tanneurs, 77200 Torcy, France",
    },
    {
        id: new ObjectId().toString(),
        userId: usersFixture[Math.floor(Math.random() * usersFixture.length)].id,
        status: "payment pending",
        deliveryAddress: "14 rue des Coudriers, 31600 Muret, France",
    },
];

export default ordersFixture;