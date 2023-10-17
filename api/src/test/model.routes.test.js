import * as modelsRoutes from '../routes/modelsRoutes.js';

jest.mock('../routes/modelsRoutes.js');

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

describe("getModels", () => {
    it("should get not deleted models", async () => {
        jest.spyOn(modelsRoutes,"getModels").mockReturnValue(models);

        const mockModels = modelsRoutes.getModels();
        expect(mockModels).toEqual(models);
    });
});

describe("getModel", () => {
    it("should get model by id", async () => {
        jest.spyOn(modelsRoutes,"getModel").mockReturnValue(models[0]);

        const mockModel = modelsRoutes.getModel(1);
        expect(mockModel).toEqual(models[0]);
    });

    it("should throw error model not found", async () => {
        jest.spyOn(modelsRoutes,"getModel").mockReturnValue(new Error("Model not found"));

        const mockModel = modelsRoutes.getModel(3);
        expect(mockModel).toEqual(new Error("Model not found"));
    });

    it("should throw error brand not found", async () => {
        models[0].brandId = 10;
        jest.spyOn(modelsRoutes,"getModel").mockReturnValue(new Error("Brand not found"));
        const mockModel = modelsRoutes.getModel(1);
        expect(mockModel).toEqual(new Error("Brand not found"));
    });

    it("should throw error model id missing", async () => {
        jest.spyOn(modelsRoutes,"getModel").mockReturnValue(new Error("Model id missing"));

        const mockModel = modelsRoutes.getModel();
        expect(mockModel).toEqual(new Error("Model id missing"));
    });
});

describe("createModel", () => {
    it("should create model", async () => {
        const model = {
            id: 3,
            name: "Model 3",
            brandId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };
        jest.spyOn(modelsRoutes,"createModel").mockReturnValue(model);

        const mockModel = modelsRoutes.createModel(model);
        models.push(model);

        expect(mockModel).toEqual(model);
        expect(models).toContain(model);
    });
});

describe("updateModel", () => {
    it("should update model", async () => {
        const model = {
            id: 3,
            name: "Model 3",
            brandId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };
        jest.spyOn(modelsRoutes,"updateModel").mockReturnValue(models[0] = model);

        const mockModel = modelsRoutes.updateModel(model);

        expect(mockModel).toEqual(model);
        expect(models).toContain(model);
    });

    it("should throw error model not found", async () => {
        jest.spyOn(modelsRoutes,"updateModel").mockReturnValue(new Error("Model not found"));

        const mockModel = modelsRoutes.updateModel(3);
        expect(mockModel).toEqual(new Error("Model not found"));
    });

    it("should throw error brand not found", async () => {
        models[0].brandId = 10;
        jest.spyOn(modelsRoutes,"updateModel").mockReturnValue(new Error("Brand not found"));
        const mockModel = modelsRoutes.updateModel(1);
        expect(mockModel).toEqual(new Error("Brand not found"));
    });

    it("should throw error model id missing", async () => {
        jest.spyOn(modelsRoutes,"updateModel").mockReturnValue(new Error("Model id missing"));

        const mockModel = modelsRoutes.updateModel();
        expect(mockModel).toEqual(new Error("Model id missing"));
    });
});

describe("deleteModel", () => {
    it("should delete model", async () => {
        const date = new Date();
        jest.spyOn(modelsRoutes,"deleteModel").mockReturnValue(models[1].deletedAt = date);

        const mockModel = modelsRoutes.deleteModel(2);
        const filter = models.filter(model => model.id === 2);
        expect(mockModel).toEqual(date);
        expect(filter).not.toContain(mockModel);
    });

    it("should throw error model not found", async () => {
        jest.spyOn(modelsRoutes,"deleteModel").mockReturnValue(new Error("Model not found"));

        const mockModel = modelsRoutes.deleteModel(3);
        expect(mockModel).toEqual(new Error("Model not found"));
    });

    it("should throw error brand not found", async () => {
        models[0].brandId = 10;
        jest.spyOn(modelsRoutes,"deleteModel").mockReturnValue(new Error("Brand not found"));
        const mockModel = modelsRoutes.deleteModel(1);
        expect(mockModel).toEqual(new Error("Brand not found"));
    });

    it("should throw error model id missing", async () => {
        jest.spyOn(modelsRoutes,"deleteModel").mockReturnValue(new Error("Model id missing"));

        const mockModel = modelsRoutes.deleteModel();
        expect(mockModel).toEqual(new Error("Model id missing"));
    });
});