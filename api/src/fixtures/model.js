import { ObjectId } from "mongodb";
import Category from "../models/postgres-category.js";
import Brand from "../models/postgres-brand.js";

const modelsFixture = [
    {
        "id": new ObjectId().toString(),
        "name": "Air Max 90",
        "gender": "Homme",
        "description": "Chaussures de ville pour hommes",
        "CategoryId": await Category.findOne({where: {name: "Chaussures de ville"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name: "Nike"}}).then(brand => brand.id)
    },
    {
        "id": new ObjectId().toString(),
        "name": "Ultra Boost",
        "gender": "Femme",
        "description": "Chaussures de sport pour femmes",
        "CategoryId": await Category.findOne({where: {name: "Chaussures de sport"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name: "Adidas"}}).then(brand => brand.id)
    },
    {
        "id": new ObjectId().toString(),
        "name": "Hiking Pro",
        "gender": "Homme",
        "description": "Chaussures de randonnée pour hommes",
        "CategoryId":await Category.findOne({where: {name: "Chaussures de randonnée"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name:"Timberland" }}).then(brand => brand.id)
    },
    {
        "id": new ObjectId().toString(),
        "name": "Fresh Step",
        "gender": "Femme",
        "description": "Sandales pour femmes",
        "CategoryId": await Category.findOne({where: {name: "Sandales"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name: "New Balance" }}).then(brand => brand.id)
    },
    {
        "id": new ObjectId().toString(),
        "name": "Comfort Slide",
        "gender": "Homme",
        "description": "Tongs pour hommes",
        "CategoryId": await Category.findOne({where: {name: "Tongs"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name: "Puma"}}).then(brand => brand.id)
    },
    {
        "id": new ObjectId().toString(),
        "name": "Elegant Oxfords",
        "gender": "Homme",
        "description": "Chaussures de ville pour hommes",
        "CategoryId": await Category.findOne({where: {name: "Chaussures de ville"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name: "Jimmy Choo"}}).then(brand => brand.id)
    },
    {
        "id": new ObjectId().toString(),
        "name": "Trailblazer",
        "gender": "Femme",
        "description": "Chaussures de randonnée pour femmes",
        "CategoryId": await Category.findOne({where: {name: "Chaussures de randonnée"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name: "Fila" }}).then(brand => brand.id)
    },
    {
        "id": new ObjectId().toString(),
        "name": "Energy Walk",
        "gender": "Femme",
        "description": "Sandales pour femmes",
        "CategoryId": await Category.findOne({where: {name: "Sandales"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name: "Skechers"}}).then(brand => brand.id)
    },
    {
        "id": new ObjectId().toString(),
        "name": "Classic Runner",
        "gender": "Homme",
        "description": "Chaussures de sport pour hommes",
        "CategoryId": await Category.findOne({where: {name: "Chaussures de sport"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name: "Reebok" }}).then(brand => brand.id)
    },
    {
        "id": new ObjectId().toString(),
        "name": "Canvas Sneakers",
        "gender": "Femme",
        "description": "Chaussures de ville pour femmes",
        "CategoryId": await Category.findOne({where: {name: "Chaussures de ville"}}).then(category => category.id),
        "BrandId": await Brand.findOne({where: {name: "Converse"}}).then(brand => brand.id)
    },
];

export default modelsFixture;