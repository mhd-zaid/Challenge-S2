const wishRoutes = jest.fn().mockReturnValue({
    getUserWish: jest.fn(),
    addProductToWish: jest.fn(),
    deleteProductFromWish: jest.fn(),
});

describe('Wish Tests', () => {
    test('getUserWish should return a user\'s wish', async () => {
        const Wish = {
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
        };
        jest.spyOn(wishRoutes(), 'getUserWish').mockReturnValue(Wish);
        const mockWish = wishRoutes().getUserWish();
        expect(mockWish).toEqual(Wish);
    });

    test('addProductToWish should add a product to the wish', async () => {
        const Wish = {
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
        };

        const Product = {
            id: 2,
            name: 'Product 2',
            price: 50,
            vat: 20,
            quantity: 1,
            size: 'M',
            color: 'black',
            url: 'https://www.google.com',
        };
        const addProduct = () => {
            Wish.products.push(Product);

            return Wish;
        };

        jest.spyOn(wishRoutes(), 'addProductToWish').mockReturnValue(addProduct());
        const mockWish = wishRoutes().addProductToWish();
        expect(mockWish).toEqual({
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
        });
    });

    test('deleteProductFromWish should delete a product from the wish', async () => {
        const Wish = {
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
        };

        const deleteProduct = () => {
            Wish.products.pop();

            return Wish;
        };

        jest.spyOn(wishRoutes(), 'deleteProductFromWish').mockReturnValue(deleteProduct());
        const mockWish = wishRoutes().deleteProductFromWish();
        expect(mockWish).toEqual({
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
        });
    });

});
