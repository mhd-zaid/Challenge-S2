import { Sequelize } from "sequelize";
import modelsRoutes from "../routes/modelsRoutes.js";
import categoriesRoutes from "../routes/categoriesRoutes";
import brandsRoutes from "../routes/brandsRoutes";
import { ObjectId } from "mongodb";

jest.mock("../models/postgres-brand.js");
jest.mock("../models/postgres-category.js");
jest.mock("../models/postgres-model.js");

const categoriesFixture = [
    {
        id: 1,
        name: "Category 1",
        createdAt: (new Date()).getMonth() - 2,
        updatedAt: new Date(),
        deletedAt: null
    },
    {
        id: 2,
        name: "Category 2",
        createdAt: (new Date()).getMonth() - 1,
        updatedAt: new Date(),
        deletedAt: null
    }
];

const brandsFixture = [
    {
        id: 1,
        name: "Brand 1",
        createdAt: (new Date()).getMonth() - 2,
        updatedAt: new Date(),
        deletedAt: null
    },
    {
        id: 2,
        name: "Brand 2",
        createdAt: (new Date()).getMonth() - 1,
        updatedAt: new Date(),
        deletedAt: null
    }
];

const modelsFixture = [
    {
        id: 1,
        name: "Model 1",
        gender: "male",
        description: "Description Model 1 male",
        CategoryId: 1,
        BrandId: 1,
        Brand: brandsFixture[0],
        Category: categoriesFixture[0],
        createdAt: (new Date()).getMonth() - 2,
        updatedAt: new Date(),
        deletedAt: null
    },
    {
        id: 2,
        name: "Model 2",
        gender: "female",
        description: "Description Model 2 female",
        CategoryId: 2,
        BrandId: 2,
        Brand: brandsFixture[1],
        Category: categoriesFixture[1],
        createdAt: (new Date()).getMonth() - 1,
        updatedAt: new Date(),
        deletedAt: null
    }
];

const Category = {
    findAll: jest.fn().mockReturnValue(categoriesFixture),
    findOne: jest.fn().mockReturnValue(categoriesFixture[0]),
};

const Brand = {
    findAll: jest.fn().mockReturnValue(brandsFixture),
    findOne: jest.fn().mockReturnValue(brandsFixture[0]),
};

const Model = {
    findAll: jest.fn().mockReturnValue(modelsFixture),
    findOne: jest.fn().mockReturnValue(modelsFixture[0]),
    create: jest.fn().mockReturnValue(null),
};

const req = jest.fn();
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
beforeEach(() => {
    Model.findAll.mockClear();
    Model.findOne.mockClear();
    Model.create.mockClear();
    Brand.findAll.mockClear();
    Brand.findOne.mockClear();
    Category.findAll.mockClear();
    Category.findOne.mockClear();
    req.body = {};
    req.params = {};
    res.status.mockClear();
    res.json.mockClear();
});

describe("Create Model", () => {
    it("should create model with brand & category", async () => {
        Model.create = jest.fn().mockReturnValue({
            id: 3,
            name: "Model 3",
            gender: "male",
            description: "Description Model 3 male",
            BrandId: brandsFixture[0].id,
            CategoryId: categoriesFixture[0].id,
            Brand: brandsFixture[0],
            Category: categoriesFixture[0],
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        });

        const category = Category.findAll();
        const brand = Brand.findAll();

        req.body = {
            name: "Model 3",
            gender: "male",
            description: "Description Model 3 male",
            BrandId: brand[0].id,
            CategoryId: category[0].id,
        };

        const newModel = await modelsRoutes(Model, ObjectId).createModel(req, res);
        modelsFixture.push(newModel);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(Model.create).toHaveBeenCalled();
        expect(modelsFixture.includes(newModel)).toBe(true);
    });

    it("should not create model without category", async () => {
        const brand = Brand.findAll();
        
        req.body = {
            name: "Model 4",
            gender: "female",
            description: "Descripotion Model 4 female",
            BrandId: brand[1].id,
        }

        await modelsRoutes(Model, ObjectId).createModel(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        //expect(res.json).toHaveBeenCalledWith({message: "CategoryId parameter is missing"});
    });
});