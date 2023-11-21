import { Sequelize } from "sequelize";
import brandsRoutes from "../routes/brandsRoutes";
import { ObjectId } from "mongodb";
import e from "express";

jest.mock("../models/postgres-brand.js");

const brands = [
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

const newBrand = {
    name: "Brand 3",
};

const addedBrand = {
    id: 3,
    name: "Brand 3",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
};

const Brand = {
    findAll: jest.fn().mockReturnValue(brands),
    findOne: jest.fn().mockReturnValue(brands[0]),
    create: jest.fn().mockReturnValue(addedBrand),
};

const req = jest.fn();
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

describe("getBrands", () => {
    it("should get brands", async () => {
        await brandsRoutes(Brand, ObjectId).getBrands(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(brands);
        expect(Brand.findAll).toHaveBeenCalled();
    });
});

describe("getBrand", () => {
    it("should get brand by id", async () => {
        req.params = { id: brands[0].id };
        await brandsRoutes(Brand, ObjectId).getBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(brands[0]);
        expect(Brand.findOne).toHaveBeenCalled();
    });

    it("should throw error brand not found", async () => {
        req.params = { id: 3 };
        Brand.findOne = jest.fn().mockReturnValue(null);
        await brandsRoutes(Brand, ObjectId).getBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Brand not found" });
        expect(Brand.findOne).toHaveBeenCalled();
    });

    it("should throw error brand id missing", async () => {
        req.params = {};
        await brandsRoutes(Brand, ObjectId).getBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
        expect(Brand.findOne).toHaveBeenCalled();
    });
});

describe("createBrand", () => {
    it("should create brand", async () => {
        req.body = newBrand;
        await brandsRoutes(Brand, ObjectId).createBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(addedBrand);
        expect(Brand.create).toHaveBeenCalled();
    });

    it("should send 400 status", async () => {
        req.body = {};
        Brand.create = jest.fn().mockReturnValue({ message: "Name parameter is missing" });

        await brandsRoutes(Brand, ObjectId).createBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Name parameter is missing" });
    });

    it("should send 422 status", async () => {
        req.body = {
            name: "3",
        };
        Brand.create = jest.fn().mockImplementation(() => {
            throw new Sequelize.ValidationError("Name must be at least 2 characters long");
        });

        await brandsRoutes(Brand, ObjectId).createBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while creating the brand : Name must be at least 2 characters long" });
    });
});

describe("updateBrand", () => {
    it("should update brand", async () => {
        const updateBrand = {
            name: "Brand 3",
        };
        req.params = { id: 2 };
        req.body = updateBrand;

        const Brand = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };

        await brandsRoutes(Brand, ObjectId).updateBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Brand updated successfully" });
        expect(Brand.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
        expect(Brand.findOne().update).toHaveBeenCalledWith(updateBrand);
    });

    it("should throw error brand not found", async () => {
        req.params = { id: 3 };
        req.body = {
            name: "Brand 3",
        };
        const Brand = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };

        await brandsRoutes(Brand, ObjectId).updateBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Brand not found" });
    });

    it("should throw error brand id missing", async () => {
        req.params = {};
        req.body = {
            name: "Brand 3",
        };
        const Brand = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };
        await brandsRoutes(Brand, ObjectId).updateBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
    });

    it("should send 400 status", async () => {
        req.params = { id: 2 };
        req.body = {};
        const Brand = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };

        await brandsRoutes(Brand, ObjectId).updateBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Name parameter is missing" });
    });

    it("should send 422 status", async () => {
        req.params = { id: 2 };
        req.body = {
            name: "3",
        };
        
        Brand.findOne = jest.fn().mockReturnValue({ ...brands[1],update: () => { throw new Sequelize.ValidationError("Name must be at least 2 characters long"); } });

        await brandsRoutes(Brand, ObjectId).updateBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(Brand.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    });
});

describe("deleteBrand", () => {
    it("should delete brand", async () => {
        req.params = { id: 2 };
        Brand.findOne = jest.fn().mockReturnValue({ destroy: jest.fn() });
        await brandsRoutes(Brand, ObjectId).deleteBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: "Brand deleted successfully" });
        expect(Brand.findOne().destroy).toHaveBeenCalled();
    });
    it("should throw error brand not found", async () => {
        req.params = { id: 3 };
        Brand.findOne = jest.fn().mockReturnValue(null);
        await brandsRoutes(Brand, ObjectId).deleteBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Brand not found" });
    });

    it("should throw error brand id missing", async () => {
        req.params = {};
        await brandsRoutes(Brand, ObjectId).deleteBrand(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
    });
});