import * as categoriesRoutes from "../routes/categoriesRoutes.js";

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


describe("getCategories", () => {
    it("should get not deleted categories", async () => {
        jest.spyOn(categoriesRoutes,"getCategories").mockReturnValue(categories);

        const mockCategories = categoriesRoutes.getCategories();
        expect(mockCategories).toEqual(categories);
    });
});

describe("getCategory", () => {
    it("should get category by id", async () => {
        jest.spyOn(categoriesRoutes,"getCategory").mockReturnValue(categories[0]);

        const mockCategory = categoriesRoutes.getCategory(1);
        expect(mockCategory).toEqual(categories[0]);
    });

    it("should throw error category not found", async () => {
        jest.spyOn(categoriesRoutes,"getCategory").mockReturnValue(new Error("Category not found"));

        const mockCategory = categoriesRoutes.getCategory(3);
        expect(mockCategory).toEqual(new Error("Category not found"));
    });

    it("should throw error category id missing", async () => {
        jest.spyOn(categoriesRoutes,"getCategory").mockReturnValue(new Error("Category id missing"));

        const mockCategory = categoriesRoutes.getCategory();
        expect(mockCategory).toEqual(new Error("Category id missing"));
    });
});

describe("createCategory", () => {
    it("should create category", async () => {
        const category = {
            id: 3,
            name: "Category 3",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };
        jest.spyOn(categoriesRoutes,"createCategory").mockReturnValue(category);

        const mockCategory = categoriesRoutes.createCategory(category);
        categories.push(category);

        expect(mockCategory).toEqual(category);
        expect(categories).toContain(category);
    });
});

describe("updateCategory", () => {
    it("should update category", async () => {
        const category = {
            id: 2,
            name: "Category 3",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };
        jest.spyOn(categoriesRoutes,"updateCategory").mockReturnValue(categories[1] = category);

        const mockCategory = categoriesRoutes.updateCategory(category);
        expect(mockCategory).toEqual(category);
    });

    it("should throw error category not found", async () => {
        jest.spyOn(categoriesRoutes,"updateCategory").mockReturnValue(new Error("Category not found"));

        const mockCategory = categoriesRoutes.updateCategory(3);
        expect(mockCategory).toEqual(new Error("Category not found"));
    });

    it("should throw error category id missing", async () => {
        jest.spyOn(categoriesRoutes,"updateCategory").mockReturnValue(new Error("Category id missing"));

        const mockCategory = categoriesRoutes.updateCategory();
        expect(mockCategory).toEqual(new Error("Category id missing"));
    });
});

describe("deleteCategory", () => {
    it("should delete category", async () => {
        const date = new Date();
        jest.spyOn(categoriesRoutes,"deleteCategory").mockReturnValue(categories[1].deletedAt = date);

        const mockCategory = categoriesRoutes.deleteCategory(2);
        const filter = categories.filter(category => category.id === 2);
        expect(mockCategory).toEqual(date);
        expect(filter).not.toContain(mockCategory);
    });

    it("should throw error category not found", async () => {
        jest.spyOn(categoriesRoutes,"deleteCategory").mockReturnValue(new Error("Category not found"));

        const mockCategory = categoriesRoutes.deleteCategory(3);
        expect(mockCategory).toEqual(new Error("Category not found"));
    });

    it("should throw error category id missing", async () => {
        jest.spyOn(categoriesRoutes,"deleteCategory").mockReturnValue(new Error("Category id missing"));

        const mockCategory = categoriesRoutes.deleteCategory();
        expect(mockCategory).toEqual(new Error("Category id missing"));
    });
});