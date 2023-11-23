import { Sequelize,Op } from "sequelize";
import productsRoutes from "../routes/productsRoutes.js";
import { ObjectId } from "mongodb";

jest.mock("../models/postgres-model.js");

const products = [
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


const newProduct = {
    name: "Product 3",
    price: 109.99 *100,
    vat: 0.2,
    quantity: 20,
    size: "42",
    color: "black",
    discount: 0,
    alertQuantity: 3,
    sku: "SKU789",
    modelId: 2,
};

const addedProduct = {
    id: 3,
    name: "Product 3",
    price: 109.99 * 100,
    vat: 0.2,
    quantity: 20,
    size: "42",
    color: "black",
    discount: 0,
    alertQuantity: 3,
    sku: "SKU789",
    modelId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
};

const addedProductMongo = {
    _id: new ObjectId(3),
    name: "Product 3",
    price: 109.99 * 100,
    vat: 0.2,
    quantity: 20,
    size: "42",
    color: "black",
    discount: 0,
    alertQuantity: 3,
    sku: "SKU789",
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
};

const Product = {
    findAll: jest.fn().mockReturnValue(products),
    findOne: jest.fn().mockReturnValue(products[0].dataValues),
    create: jest.fn().mockReturnValue(addedProduct),
};
const ProductMongodb = (data) => {
    return {
        save: jest.fn().mockReturnValue(addedProductMongo),
        findOne: jest.fn().mockReturnValue(productsMongo[0]),
    }
};

const Model = {
    findOne: jest.fn().mockReturnValue({ id: 1, name: "Model 1",Brand: { id: 1, name: "Brand 1" }, Category: { id: 1, name: "Category 1" } }),
};

const Product_Images = jest.fn();

const req = jest.fn();
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

describe("getProducts", () => {
    it("should get products", async () => {
        req.query = {};
        await productsRoutes(Product, Model, Product_Images, ProductMongodb,ObjectId, Op).getProducts(req, res);
        const expectedProducts = products.map((product) => ({
            ...product.dataValues,
            price: (product.dataValues.price / 100).toFixed(2),
        }));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expectedProducts);
        expect(Product.findAll).toHaveBeenCalled();
    });
});

describe("getProduct", () => {
    it("should get product by id", async () => {
        req.params = { id: products[0].dataValues.id };
        await productsRoutes(Product, Model, Product_Images,ProductMongodb ,ObjectId, Op).getProduct(req, res);
        products[0].dataValues.price = (products[0].dataValues.price / 100).toFixed(2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(products[0].dataValues);
        expect(Product.findOne).toHaveBeenCalled();
    });

    it("should throw error product not found", async () => {
        req.params = { id: 3 };
        Product.findOne = jest.fn().mockReturnValue(null);
        await productsRoutes(Product, Model, Product_Images,ProductMongodb, ObjectId, Op).getProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
        expect(Product.findOne).toHaveBeenCalled();
    });

    it("should throw error Id parameter is missing", async () => {
        req.params = {};
        await productsRoutes(Product, Model, Product_Images,ProductMongodb,  ObjectId, Op).getProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
        expect(Product.findOne).toHaveBeenCalled();
    });
});

describe("createProduct", () => {
    it("should create product", async () => {
        req.body = newProduct;
        await productsRoutes(Product, Model, Product_Images,ProductMongodb, ObjectId, Op).createProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(addedProduct);
        expect(Product.create).toHaveBeenCalled();
    });

    it("should send 400 status", async () => {
        req.body = {
            name: "Product 3",
            price: 109.99 *100,
            vat: 0.2,
            quantity: 20,
            size: "42",
            color: "black",
            discount: 0,
            alertQuantity: 3,
            sku: "SKU789",
        };
        Product.create = jest.fn().mockReturnValue({ message: "modelId is missing" });

        await productsRoutes(Product, Model, Product_Images,ProductMongodb, ObjectId, Op).createProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "modelId is missing" });
    });

    it("should send 422 status", async () => {
        req.body = {
            name: "3",
        };
        Product.create = jest.fn().mockImplementation(() => {
            throw new Sequelize.ValidationError("Name must be at least 2 characters long");
        });

        await productsRoutes(Product, Model, Product_Images,ProductMongodb, ObjectId, Op).createProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
    });
});

describe("updateProduct", () => {
    it("should update product", async () => {
        const updateProduct = {
            name: "Product 3",
        };
        req.params = { id: 2 };
        req.body = updateProduct;

        Product.findOne = jest.fn().mockReturnValue({ update: jest.fn() });

        await productsRoutes(Product, Model, Product_Images, ObjectId, Op).updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should throw error product not found", async () => {
        req.params = { id: 3 };
        req.body = {
            name: "Product 3",
        };
        const Product = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };
        ProductMongodb.findOne = jest.fn().mockReturnValue(null);
        await productsRoutes(Product, Model, Product_Images, ObjectId, Op).updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
    });

    it("should throw error Id parameter is missing", async () => {
        req.params = {};
        req.body = {
            name: "Product 3",
        };
        const Product = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };
        await productsRoutes(Product, Model, Product_Images, ObjectId, Op).updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
    });

    it("should send 400 status", async () => {
        req.params = { id: 2 };
        req.body = {
            price: 109.99 *100,
            vat: 0.2,
            quantity: 20,
            size: "42",
            color: "black",
            discount: 0,
            alertQuantity: 3,
            sku: "SKU789",
        };
        const Product = {
            findOne: jest.fn().mockReturnValue({ update: jest.fn() }),
        };
        ProductMongodb.findOne = jest.fn().mockReturnValue(null);
        await productsRoutes(Product, Model, Product_Images, ObjectId, Op).updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should send 422 status", async () => {
        req.params = { id: 2 };
        req.body = {
            name: "3",
        };
        
        Product.findOne = jest.fn().mockReturnValue({ ...products[1],update: () => { throw new Sequelize.ValidationError("Name must be at least 2 characters long"); } });

        await productsRoutes(Product, Model, Product_Images, ObjectId, Op).updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
    });
});

describe("deleteProduct", () => {
    it("should delete product", async () => {
        req.params = { id: 2 };
        Product.findOne = jest.fn().mockReturnValue({ destroy: jest.fn() });
        ProductMongodb.findOne = jest.fn().mockReturnValue({ updateOne: jest.fn() });
        await productsRoutes(Product, Model, Product_Images, ProductMongodb, ObjectId, Op).deleteProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: "Product deleted successfully" });
        expect(Product.findOne().destroy).toHaveBeenCalled();
    });
    it("should throw error product not found", async () => {
        req.params = { id: 3 };
        Product.findOne = jest.fn().mockReturnValue(null);
        await productsRoutes(Product, Model, Product_Images,ProductMongodb, ObjectId, Op).deleteProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
    });

    it("should throw error Id parameter is missing", async () => {
        req.params = {};
        await productsRoutes(Product, Model, Product_Images,ProductMongodb, ObjectId, Op).deleteProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Id parameter is missing" });
    });
});

