import { Sequelize,Op } from "sequelize";
import modelsRoutes from "../routes/modelsRoutes.js";
import categoriesRoutes from "../routes/categoriesRoutes";
import brandsRoutes from "../routes/brandsRoutes";
import productsRoutes from "../routes/productsRoutes";
import { ObjectId } from "mongodb";

jest.mock("../models/postgres-brand.js");
jest.mock("../models/postgres-category.js");
jest.mock("../models/postgres-model.js");
jest.mock("../models/postgres-product.js");

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
        brand: {
            ...brandsFixture[0],
            toJSON: jest.fn().mockReturnValue(brandsFixture[0])
        },
        category: {
            ...categoriesFixture[0],
            toJSON: jest.fn().mockReturnValue(categoriesFixture[0])
        },
        createdAt: (new Date()).getMonth() - 2,
        updatedAt: new Date(),
        deletedAt: null,
        toJSON: jest.fn().mockReturnValue(true)
    },
    {
        id: 2,
        name: "Model 2",
        gender: "female",
        description: "Description Model 2 female",
        CategoryId: 2,
        BrandId: 2,
        brand: {
            ...brandsFixture[1],
            toJSON: jest.fn().mockReturnValue(brandsFixture[1])
        },
        category: {
            ...categoriesFixture[1],
            toJSON: jest.fn().mockReturnValue(categoriesFixture[1])
        },
        createdAt: (new Date()).getMonth() - 1,
        updatedAt: new Date(),
        deletedAt: null,
        toJSON: jest.fn().mockReturnValue(true)
    }
];

const productsFixture = [
    {
        dataValues: {
            id: 1,
            name: "Product 1",
            price: 49.99 * 100,
            vat: 0.2,
            quantity: 10,
            size: "43",
            color: "black",
            discount: 0,
            alertQuantity: 3,
            sku: "SKU123",
            modelId: 1,
            createdAt: (new Date()).getMonth() - 2,
            updatedAt: new Date(),
            deletedAt: null
        }
    },
    {
        dataValues: {
            id: 2,
            name: "Product 2",
            price: 79.99 * 100,
            vat: 0.2,
            quantity: 15,
            size: "41",
            color: "white",
            discount: 0,
            alertQuantity: 3,
            sku: "SKU456",
            modelId: 2,
            createdAt: (new Date()).getMonth() - 6,
            updatedAt: new Date(),
            deletedAt: null
        }
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

const Product = {
    create: jest.fn().mockReturnValue(null),
    findAll: jest.fn().mockReturnValue(productsFixture),
    findOne: jest.fn().mockReturnValue(productsFixture[0]),
};

const productsMongo = [
    {
        _id: new ObjectId(1),
        name: "Product 1",
		price: 49.99 * 100,
		vat: 0.2,
		quantity: 10,
		size: "43",
		color: "black",
		discount: 0,
		alertQuantity: 3,
		sku: "SKU123",
		modelId: 1,
        model: {
            _id: new ObjectId(1),
            name: "Model 1",
            brandId: 1,
            categoryId: 1,
        },
        brand: {
            _id: new ObjectId(1),
            name: "Brand 1",
        },
        category: {
            _id: new ObjectId(1),
            name: "Category 1",
        },
        deletedAt: null
    },
    {
        _id: new ObjectId(2),
        name: "Product 2",
		price: 79.99 *100,
		vat: 0.2,
		quantity: 15,
		size: "41",
		color: "white",
		discount: 0,
		alertQuantity: 3,
		sku: "SKU456",
		modelId: 2,
        model: {
            _id: new ObjectId(2),
            name: "Model 2",
            brandId: 2,
            categoryId: 2,
        },
        brand: {
            _id: new ObjectId(2),
            name: "Brand 2",
        },
        category: {
            _id: new ObjectId(2),
            name: "Category 2",
        },
        deletedAt: null
    }
];

const ProductMongodb = (data) => {
    return {
        save: jest.fn().mockReturnValue({}),
        findOne: jest.fn().mockReturnValue(productsMongo[0]),
    }
};

const Product_Images = {
    findOne: jest.fn().mockReturnValue({
        dataValues: {
            id: 1,
            productId: productsFixture[1].id,
            url: 'https://www.google.com',
        },
    }),
};

const req = jest.fn();
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
beforeEach(() => {
    jest.clearAllMocks();
});
describe("Create Model with Brand & Category", () => {
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
        
        await categoriesRoutes(Category, ObjectId).getCategories(req, res).json;
        expect(res.status).toHaveBeenCalledWith(200);
        expect(Category.findAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(categoriesFixture);
        const category = res.json.mock.calls[0][0];
        res.status.mockClear();
        res.json.mockClear();

        await brandsRoutes(Brand, ObjectId).getBrands(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(Brand.findAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(brandsFixture);
        const brand = res.json.mock.calls[0][0];
        res.status.mockClear();
        res.json.mockClear();

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
        await brandsRoutes(Brand, ObjectId).getBrands(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(Brand.findAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(brandsFixture);
        const brand = res.json.mock.calls[0][0];
        res.status.mockClear();
        res.json.mockClear();

        req.body = {
            name: "Model 4",
            gender: "female",
            description: "Descripotion Model 4 female",
            BrandId: brand[1].id,
        }

        await modelsRoutes(Model, ObjectId).createModel(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "CategoryId parameter is missing"});
    });
});

describe("Add Product with Model", () => {
    it("should add product with model", async () => {
        await modelsRoutes(Model, ObjectId).getModels(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(Model.findAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(modelsFixture);
        const model = res.json.mock.calls[0][0];
        res.status.mockClear();
        res.json.mockClear();
        const id = new ObjectId();
        req.body = {
            name: "Product 3",
            price: 49.99 * 100,
            vat: 0.2,
            quantity: 10,
            size: "43",
            color: "black",
            discount: 0,
            alertQuantity: 3,
            sku: "SKU123",
            modelId: model[0].id,
        };
        ProductMongodb.save = jest.fn().mockReturnValue({
            _id: id,
            name: req.body.name,
            price: req.body.price * 100,
            vat: req.body.vat,
            quantity: req.body.quantity,
            size: req.body.size,
            color: req.body.color,
            discount: req.body.discount,
            alertQuantity: req.body.alertQuantity,
            sku: req.body.sku,
            modelId: model[0].id,
            model: {
                _id: new ObjectId(model[0].id),
                name: model[0].name,
                brandId: model[0].BrandId,
                categoryId: model[0].CategoryId,
            },
            brand: {
                _id: new ObjectId(model[0].BrandId),
                name: model[0].brand.name,
            },
            category: {
                _id: new ObjectId(model[0].CategoryId),
                name: model[0].category.name,
            },
        });
        await productsRoutes(Product, Model,Brand,Category, Product_Images, ProductMongodb,ObjectId, Op).createProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(Product.create).toHaveBeenCalled();
        const newProduct = res.json.mock.calls[0][0];
        productsFixture.push(newProduct);
        expect(productsFixture.includes(newProduct)).toBe(true);
    });

    it("should not add product without model", async () => {
        req.body = {
            name: "Product 4",
            price: 79.99 * 100,
            vat: 0.2,
            quantity: 15,
            size: "41",
            color: "white",
            discount: 0,
            alertQuantity: 3,
            sku: "SKU456",
        };

        await productsRoutes(Product, Model,Brand,Category, Product_Images, ProductMongodb,ObjectId, Op).createProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "modelId is missing"});
    });
});