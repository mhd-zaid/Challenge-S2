import { Sequelize } from "sequelize";
import modelsRoutes from "../routes/modelsRoutes.js";
import { ObjectId } from "mongodb";

jest.mock("../models/postgres-model.js");

const models = [
    {
        id: 1,
        name: "Model 1",
        brandId: 1,
        createdAt: (new Date()).getMonth() - 2,
        updatedAt: new Date(),
        deletedAt: null
    },
    {
        id: 2,
        name: "Model 2",
        brandId: 2,
        createdAt: (new Date()).getMonth() - 1,
        updatedAt: new Date(),
        deletedAt: null
    }
];

const newModel = {
    name: "Model 3",
    gender: "male",
    descritption: "Description Model 3",
    BrandId: 2,
    CategoryId: 1

};

const addedModel = {
    id: 3,
    name: "Model 3",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
};

const Model = {
    findAll: jest.fn().mockReturnValue(models),
    findOne: jest.fn().mockReturnValue(models[0]),
    create: jest.fn().mockReturnValue(addedModel),
};

const req = jest.fn();
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

describe("getModels", () => {
    it("should get models", async () => {
        await modelsRoutes(Model, ObjectId).getModels(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(models);
        expect(Model.findAll).toHaveBeenCalled();
    });
});

describe("getModel", () => {
    it("should get model by id", async () => {
        req.params = { id: models[0].id };
        await modelsRoutes(Model, ObjectId).getModel(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(models[0]);
        expect(Model.findOne).toHaveBeenCalled();
    });

    it("should throw error model not found", async () => {
        req.params = { id: 3 };
        Model.findOne = jest.fn().mockReturnValue(null);
        await modelsRoutes(Model, ObjectId).getModel(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Model not found" });
        expect(Model.findOne).toHaveBeenCalled();
    });

    it("should throw error Id parameter is missing", async () => {
        req.params = {};
        await modelsRoutes(Model, ObjectId).getModel(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
        expect(Model.findOne).toHaveBeenCalled();
    });
});

describe("createModel", () => {
    it("should create model", async () => {
        req.body = newModel;
        await modelsRoutes(Model, ObjectId).createModel(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(addedModel);
        expect(Model.create).toHaveBeenCalled();
    });

    it("should send 400 status", async () => {
        req.body = {};
        Model.create = jest.fn().mockReturnValue({ message: "Name parameter is missing" });

        await modelsRoutes(Model, ObjectId).createModel(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Name parameter is missing" });
    });

    it("should send 422 status", async () => {
        req.body = {
            name: "3",
            gender: "male",
            descritption: "Description Model 3",
            BrandId: 2,
            CategoryId: 1
        };
        Model.create = jest.fn().mockImplementation(() => {
            throw new Sequelize.ValidationError("Name must be at least 2 characters long");
        });

        await modelsRoutes(Model, ObjectId).createModel(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while creating the model : Name must be at least 2 characters long" });
    });
});

describe("updateModel", () => {
    it("should update model", async () => {
        const updateModel = {
            name: "Model 3",
        };
        req.params = { id: 2 };
        req.body = updateModel;

        const Model = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };

        await modelsRoutes(Model, ObjectId).updateModel(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Model updated successfully" });
        expect(Model.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
        expect(Model.findOne().update).toHaveBeenCalledWith(updateModel);
    });

    it("should throw error model not found", async () => {
        req.params = { id: 3 };
        req.body = {
            name: "Model 3",
        };
        const Model = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };

        await modelsRoutes(Model, ObjectId).updateModel(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Model not found" });
    });

    it("should throw error Id parameter is missing", async () => {
        req.params = {};
        req.body = {
            name: "Model 3",
        };
        const Model = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };
        await modelsRoutes(Model, ObjectId).updateModel(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
    });

    it("should send 400 status", async () => {
        req.params = { id: 2 };
        req.body = {};
        const Model = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };

        await modelsRoutes(Model, ObjectId).updateModel(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Name parameter is missing" });
    });

    it("should send 422 status", async () => {
        req.params = { id: 2 };
        req.body = {
            name: "3",
        };
        
        Model.findOne = jest.fn().mockReturnValue({ ...models[1],update: () => { throw new Sequelize.ValidationError("Name must be at least 2 characters long"); } });

        await modelsRoutes(Model, ObjectId).updateModel(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(Model.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    });
});

describe("deleteModel", () => {
    it("should delete model", async () => {
        req.params = { id: 2 };
        Model.findOne = jest.fn().mockReturnValue({ destroy: jest.fn() });
        await modelsRoutes(Model, ObjectId).deleteModel(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: "Model deleted successfully" });
        expect(Model.findOne().destroy).toHaveBeenCalled();
    });
    it("should throw error model not found", async () => {
        req.params = { id: 3 };
        Model.findOne = jest.fn().mockReturnValue(null);
        await modelsRoutes(Model, ObjectId).deleteModel(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Model not found" });
    });

    it("should throw error Id parameter is missing", async () => {
        req.params = {};
        await modelsRoutes(Model, ObjectId).deleteModel(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
    });
});