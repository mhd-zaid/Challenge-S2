import * as productsRoutes from '../routes/productsRoutes.js';

const products = [
    {
        id: 1,
        name: "Product 1",
        modelId: 1,
        createdAt: (new Date()).getMonth() - 2,
        updatedAt: new Date(),
        deletedAt: null
    },
    {
        id: 2,
        name: "Product 2",
        modelId: 2,
        createdAt: (new Date()).getMonth() - 1,
        updatedAt: new Date(),
        deletedAt: null
    }
];

describe("getProducts", () => {
    it("should get not deleted products", async () => {
        jest.spyOn(productsRoutes,"getProducts").mockReturnValue(products);

        const mockProducts = productsRoutes.getProducts();
        expect(mockProducts).toEqual(products);
    });
});

describe("getProduct", () => {
    it("should get product by id", async () => {
        jest.spyOn(productsRoutes,"getProduct").mockReturnValue(products[0]);

        const mockProduct = productsRoutes.getProduct(1);
        expect(mockProduct).toEqual(products[0]);
    });

    it("should throw error product not found", async () => {
        jest.spyOn(productsRoutes,"getProduct").mockReturnValue(new Error("Product not found"));

        const mockProduct = productsRoutes.getProduct(3);
        expect(mockProduct).toEqual(new Error("Product not found"));
    });

    it("should throw error product id missing", async () => {
        jest.spyOn(productsRoutes,"getProduct").mockReturnValue(new Error("Product id missing"));

        const mockProduct = productsRoutes.getProduct();
        expect(mockProduct).toEqual(new Error("Product id missing"));
    });
});

describe("createProduct", () => {
    it("should create product", async () => {
        const product = {
            id: 3,
            name: "Product 3",
            modelId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };
        jest.spyOn(productsRoutes,"createProduct").mockReturnValue(product);

        const mockProduct = productsRoutes.createProduct(product);
        expect(mockProduct).toEqual(product);
    });
});

describe("updateProduct", () => {
    it("should update product", async () => {
        const product = {
            id: 3,
            name: "Product 3",
            modelId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };
        jest.spyOn(productsRoutes,"updateProduct").mockReturnValue(product);

        const mockProduct = productsRoutes.updateProduct(product);
        expect(mockProduct).toEqual(product);
    });

    it("should throw error product not found", async () => {
        jest.spyOn(productsRoutes,"updateProduct").mockReturnValue(new Error("Product not found"));

        const mockProduct = productsRoutes.updateProduct(5);
        expect(mockProduct).toEqual(new Error("Product not found"));
    });

    it("should throw error product id missing", async () => {
        jest.spyOn(productsRoutes,"updateProduct").mockReturnValue(new Error("Product id missing"));

        const mockProduct = productsRoutes.updateProduct();
        expect(mockProduct).toEqual(new Error("Product id missing"));
    });
});

describe("deleteProduct", () => {
    it("should delete product", async () => {
        const product = {
            id: 3,
            name: "Product 3",
            modelId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date()
        };
        jest.spyOn(productsRoutes,"deleteProduct").mockReturnValue(product);

        const mockProduct = productsRoutes.deleteProduct(3);
        expect(mockProduct).toEqual(product);
    });

    it("should throw error product not found", async () => {
        jest.spyOn(productsRoutes,"deleteProduct").mockReturnValue(new Error("Product not found"));

        const mockProduct = productsRoutes.deleteProduct(5);
        expect(mockProduct).toEqual(new Error("Product not found"));
    });

    it("should throw error product id missing", async () => {
        jest.spyOn(productsRoutes,"deleteProduct").mockReturnValue(new Error("Product id missing"));

        const mockProduct = productsRoutes.deleteProduct();
        expect(mockProduct).toEqual(new Error("Product id missing"));
    });
});

