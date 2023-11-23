import { Sequelize } from "sequelize";
import categoriesRoutes from "../routes/categoriesRoutes";
import { ObjectId } from "mongodb";

jest.mock("../models/postgres-category.js");

const categories = [
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

const newCategory = {
    name: "Category 3",
};

const addedCategory = {
    id: 3,
    name: "Category 3",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
};

const Category = {
    findAll: jest.fn().mockReturnValue(categories),
    findOne: jest.fn().mockReturnValue(categories[0]),
    create: jest.fn().mockReturnValue(addedCategory),
};

const req = jest.fn();
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};


describe("getCategories", () => {
    it("should get categories", async () => {
        await categoriesRoutes(Category, ObjectId).getCategories(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(categories);
        expect(Category.findAll).toHaveBeenCalled();
    });
});

describe("getCategory", () => {
    it("should get category by id", async () => {
        req.params = { id: categories[0].id };
        await categoriesRoutes(Category, ObjectId).getCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(categories[0]);
        expect(Category.findOne).toHaveBeenCalled();
    });

    it("should throw error category not found", async () => {
        req.params = { id: 3 };
        Category.findOne = jest.fn().mockReturnValue(null);
        await categoriesRoutes(Category, ObjectId).getCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Category not found" });
        expect(Category.findOne).toHaveBeenCalled();
    });

    it("should throw error Id parameter is missing", async () => {
        req.params = {};
        await categoriesRoutes(Category, ObjectId).getCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
        expect(Category.findOne).toHaveBeenCalled();
    });
});

describe("createCategory", () => {
    it("should create category", async () => {
        req.body = newCategory;
        await categoriesRoutes(Category, ObjectId).createCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(addedCategory);
        expect(Category.create).toHaveBeenCalled();
    });

    it("should send 400 status", async () => {
        req.body = {};
        Category.create = jest.fn().mockReturnValue({ message: "Name parameter is missing" });

        await categoriesRoutes(Category, ObjectId).createCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Name parameter is missing" });
    });

    it("should send 422 status", async () => {
        req.body = {
            name: "3",
        };
        Category.create = jest.fn().mockImplementation(() => {
            throw new Sequelize.ValidationError("Name must be at least 2 characters long");
        });

        await categoriesRoutes(Category, ObjectId).createCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while creating the category : Name must be at least 2 characters long" });
    });
});

describe("updateCategory", () => {
    it("should update category", async () => {
        const updateCategory = {
            name: "Category 3",
        };
        req.params = { id: 2 };
        req.body = updateCategory;

        const Category = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };

        await categoriesRoutes(Category, ObjectId).updateCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Category updated successfully" });
        expect(Category.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
        expect(Category.findOne().update).toHaveBeenCalledWith(updateCategory);
    });

    it("should throw error category not found", async () => {
        req.params = { id: 3 };
        req.body = {
            name: "Category 3",
        };
        const Category = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };

        await categoriesRoutes(Category, ObjectId).updateCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Category not found" });
    });

    it("should throw error Id parameter is missing", async () => {
        req.params = {};
        req.body = {
            name: "Category 3",
        };
        const Category = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };
        await categoriesRoutes(Category, ObjectId).updateCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
    });

    it("should send 400 status", async () => {
        req.params = { id: 2 };
        req.body = {};
        const Category = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };

        await categoriesRoutes(Category, ObjectId).updateCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Name parameter is missing" });
    });

    it("should send 422 status", async () => {
        req.params = { id: 2 };
        req.body = {
            name: "3",
        };
        
        Category.findOne = jest.fn().mockReturnValue({ ...categories[1],update: () => { throw new Sequelize.ValidationError("Name must be at least 2 characters long"); } });

        await categoriesRoutes(Category, ObjectId).updateCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(Category.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    });
});

describe("deleteCategory", () => {
    it("should delete category", async () => {
        req.params = { id: 2 };
        Category.findOne = jest.fn().mockReturnValue({ destroy: jest.fn() });
        await categoriesRoutes(Category, ObjectId).deleteCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: "Category deleted successfully" });
        expect(Category.findOne().destroy).toHaveBeenCalled();
    });
    it("should throw error category not found", async () => {
        req.params = { id: 3 };
        Category.findOne = jest.fn().mockReturnValue(null);
        await categoriesRoutes(Category, ObjectId).deleteCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Category not found" });
    });

    it("should throw error Id parameter is missing", async () => {
        req.params = {};
        await categoriesRoutes(Category, ObjectId).deleteCategory(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
    });
});