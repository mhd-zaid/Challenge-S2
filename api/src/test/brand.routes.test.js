import * as brandsRoutes from "../routes/brandsRoutes.js";

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


describe("getBrands", () => {
    it("should get not deleted brands", async () => {
        jest.spyOn(brandsRoutes,"getBrands").mockReturnValue(brands);

        const mockBrands = brandsRoutes.getBrands();
        expect(mockBrands).toEqual(brands);
    });
});

describe("getBrand", () => {
    it("should get brand by id", async () => {
        jest.spyOn(brandsRoutes,"getBrand").mockReturnValue(brands[0]);

        const mockBrand = brandsRoutes.getBrand(1);
        expect(mockBrand).toEqual(brands[0]);
    });

    it("should throw error brand not found", async () => {
        jest.spyOn(brandsRoutes,"getBrand").mockReturnValue(new Error("Brand not found"));

        const mockBrand = brandsRoutes.getBrand(3);
        expect(mockBrand).toEqual(new Error("Brand not found"));
    });

    it("should throw error brand id missing", async () => {
        jest.spyOn(brandsRoutes,"getBrand").mockReturnValue(new Error("Brand id missing"));

        const mockBrand = brandsRoutes.getBrand();
        expect(mockBrand).toEqual(new Error("Brand id missing"));
    });
});

describe("createBrand", () => {
    it("should create brand", async () => {
        const brand = {
            id: 3,
            name: "Brand 3",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };
        jest.spyOn(brandsRoutes,"createBrand").mockReturnValue(brand);

        const mockBrand = brandsRoutes.createBrand(brand);
        brands.push(brand);

        expect(mockBrand).toEqual(brand);
        expect(brands).toContain(brand);
    });
});

describe("updateBrand", () => {
    it("should update brand", async () => {
        const brand = {
            id: 2,
            name: "Brand 3",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };
        jest.spyOn(brandsRoutes,"updateBrand").mockReturnValue(brands[1] = brand);

        const mockBrand = brandsRoutes.updateBrand(brand);

        expect(mockBrand).toEqual(brand);
        expect(brands).toContain(brand);
    });

    it("should throw error brand not found", async () => {
        jest.spyOn(brandsRoutes,"updateBrand").mockReturnValue(new Error("Brand not found"));

        const mockBrand = brandsRoutes.updateBrand(3);
        expect(mockBrand).toEqual(new Error("Brand not found"));
    });

    it("should throw error brand id missing", async () => {
        jest.spyOn(brandsRoutes,"updateBrand").mockReturnValue(new Error("Brand id missing"));

        const mockBrand = brandsRoutes.updateBrand();
        expect(mockBrand).toEqual(new Error("Brand id missing"));
    });
});

describe("deleteBrand", () => {
    it("should delete brand", async () => {
        const date = new Date();
        jest.spyOn(brandsRoutes,"deleteBrand").mockReturnValue(brands[1].deletedAt = date);

        const mockBrand = brandsRoutes.deleteBrand(2);
        const filter = brands.filter(brand => brand.id === 2);
        expect(mockBrand).toEqual(date);
        expect(filter).not.toContain(mockBrand);
    });
    it("should throw error brand not found", async () => {
        jest.spyOn(brandsRoutes,"deleteBrand").mockReturnValue(new Error("Brand not found"));

        const mockBrand = brandsRoutes.deleteBrand(3);
        expect(mockBrand).toEqual(new Error("Brand not found"));
    });

    it("should throw error brand id missing", async () => {
        jest.spyOn(brandsRoutes,"deleteBrand").mockReturnValue(new Error("Brand id missing"));

        const mockBrand = brandsRoutes.deleteBrand();
        expect(mockBrand).toEqual(new Error("Brand id missing"));
    });
});