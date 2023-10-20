const cartRoutes = jest.fn().mockReturnValue({
    getUserCart: jest.fn(),
    addProductToCart: jest.fn(),
    deleteProductFromCart: jest.fn(),
});

describe('Cart Tests', () => {
    test('getUserCart should return a user\'s cart', async () => {
        const Cart = {
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
        jest.spyOn(cartRoutes(), 'getUserCart').mockReturnValue(Cart);
        const mockCart = cartRoutes().getUserCart();
        expect(mockCart).toEqual(Cart);
    });

    test('addProductToCart should add a product to the cart', async () => {
        const Cart = {
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
            Cart.products.push(Product);

            return Cart;
        };

        jest.spyOn(cartRoutes(), 'addProductToCart').mockReturnValue(addProduct());
        const mockCart = cartRoutes().addProductToCart();
        expect(mockCart).toEqual({
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

    test('deleteProductFromCart should delete a product from the cart', async () => {
        const Cart = {
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
            Cart.products.pop();

            return Cart;
        };

        jest.spyOn(cartRoutes(), 'deleteProductFromCart').mockReturnValue(deleteProduct());
        const mockCart = cartRoutes().deleteProductFromCart();
        expect(mockCart).toEqual({
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
