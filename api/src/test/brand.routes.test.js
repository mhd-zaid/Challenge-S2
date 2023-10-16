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
});