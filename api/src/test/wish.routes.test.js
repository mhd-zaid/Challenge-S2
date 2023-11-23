import { Sequelize } from "sequelize";
import wishRoutes from "../routes/wishsRoutes.js";
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

const wishes = [
    {
        id: 1,
        userId: 1,
        products: [
            {
                id: 1,
                name: 'Product 1',
                price: 100,
                vat: 20,
                quantity: 1,
                size: 'M',
                color: 'red',
                url: 'https://www.google.com',
            },
        ],
    },
    {
        id: 2,
        userId: 2,
        products: [
            {
                id: 2,
                name: 'Product 2',
                price: 50,
                vat: 20,
                quantity: 1,
                size: 'M',
                color: 'black',
                url: 'https://www.google.com',
            },
        ],
    },
];

const Wish = {
    findOne: jest.fn().mockReturnValue(wishes[0]),
};

const Product = {
    findOne: jest.fn().mockReturnValue(products[1]),
};

const req = jest.fn();
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

describe('getUserWish', () => {
    it('should get user Wishes', async () => {
        req.params = { id: 1 };
        await wishRoutes(Wish, Product).getUserWish(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(wishes[0]);
        expect(Wish.findOne).toHaveBeenCalled();
        
    });

    it('should return a 404 error if the wish is not found', async () => {
        Wish.findOne = jest.fn().mockReturnValue(null);
        req.params = { id: 1 };
        await wishRoutes(Wish, Product).getUserWish(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Wish not found" });
        expect(Wish.findOne).toHaveBeenCalled();
    });

    it('getUserWish should return a 400', async () => {
        req.params = {};
        await wishRoutes(Wish, Product).getUserWish(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "id parameter is missing" });
    });
});

describe('addProductToWish', () => {
    //  test('addProductToWish should add a product to the wish', async () => {
    //     req.params = { userId: 1 };
    //     req.body = { productId: 1 };
    //     await wishRoutes(Wish, Product).addProductToWish(req, res);
    //     expect(res.status).toHaveBeenCalledWith(201);
    //     expect(res.json).toHaveBeenCalledWith({ message: "Product added to wish successfully" });
    // });

    it('should return a 400 error if the userId is not found', async () => {
        req.params = {};
        req.body = { productId: 1 };
        await wishRoutes(Wish, Product).addProductToWish(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "userId parameter is missing" });
    });

    it('should return a 400 error if the productId is not found', async () => {
        req.params = { userId: 1 };
        req.body = {};
        await wishRoutes(Wish, Product).addProductToWish(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "productId parameter is missing" });
    });

    it('should return a 404 error if the wish is not found', async () => {
        Wish.findOne = jest.fn().mockReturnValue(null);
        req.params = { userId: 1 };
        req.body = { productId: 1 };
        await wishRoutes(Wish, Product).addProductToWish(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Wish not found" });
        expect(Wish.findOne).toHaveBeenCalled();
    });

    it('should return a 404 error if the product is not found', async () => {
        Wish.findOne = jest.fn().mockReturnValue(wishes[0]);
        Product.findOne = jest.fn().mockReturnValue(null);
        req.params = { userId: 1 };
        req.body = { productId: 1 };
        await wishRoutes(Wish, Product).addProductToWish(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
        expect(Product.findOne).toHaveBeenCalled();
    });

});

describe('deleteProductFromWish', () => {
    it('should delete a product from the wish', async () => {
        Product.findOne = jest.fn().mockReturnValue(products[0]);
        Wish.findOne = jest.fn().mockReturnValue({ removeProduct: jest.fn() });
        req.params = { userId: 1 };
        req.body = { productId: 1 };
        await wishRoutes(Wish, Product).deleteProductFromWish(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: "Product deleted from wish successfully" });
    });

    it('should return a 400 error if the userId is missing', async () => {
        req.params = {};
        req.body = { productId: 1 };
        await wishRoutes(Wish, Product).deleteProductFromWish(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "userId parameter is missing" });
    });

    it('should return a 400 error if the productId is missing', async () => {
        req.params = { userId: 1 };
        req.body = {};
        await wishRoutes(Wish, Product).deleteProductFromWish(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "productId parameter is missing" });
    });

    it('should return a 404 error if the wish is not found', async () => {
        Wish.findOne = jest.fn().mockReturnValue(null);
        req.params = { userId: 1 };
        req.body = { productId: 1 };
        await wishRoutes(Wish, Product).deleteProductFromWish(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Wish not found" });
        expect(Wish.findOne).toHaveBeenCalled();
    });

    it('should return a 404 error if the product is not found', async () => {
        Wish.findOne = jest.fn().mockReturnValue(wishes[0]);
        Product.findOne = jest.fn().mockReturnValue(null);
        req.params = { userId: 1 };
        req.body = { productId: 1 };
        await wishRoutes(Wish, Product).deleteProductFromWish(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
        expect(Product.findOne).toHaveBeenCalled();
    });

});
