import * as modelsRoutes from '../routes/modelsRoutes.js';

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
});