import Cart from "../models/postgres-cart.js";

export const getUserCart = async (req, res) => {
	try {
		const { id } = req.params;
		const cart = await Cart.findOne({
			where: { userId: id },
			include: "products",
		});
		res.json(cart);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the cart : ${error}`,
		});
	}
};

export const addProductToCart = async (req, res) => {
	try {
		const { userId } = req.params;
		const { productId } = req.body;

		if (!id || !productId) {
			return res
				.status(400)
				.json({ message: "Id parameter or productId is missing" });
		}

		const cart = await Cart.findOne({ where: { userId: userId } });
		if (!cart) return res.status(404).json({ message: "Cart not found" });

		const product = await Product.findOne({ where: { id: productId } });
		if (!product)
			return res.status(404).json({ message: "Product not found" });

		await cart.addProduct(product);
		res.json({ message: "Product added to cart successfully" });
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while adding the product to the cart : ${error}`,
		});
	}
};

export const deleteProductFromCart = async (req, res) => {
	try {
		const { userId } = req.params;
		const { productId } = req.body;

		if (!id || !productId) {
			return res
				.status(400)
				.json({ message: "Id parameter or productId is missing" });
		}

		const cart = await Cart.findOne({ where: { userId: userId } });
		if (!cart) return res.status(404).json({ message: "Cart not found" });

		const product = await Product.findOne({ where: { id: productId } });
		if (!product)
			return res.status(404).json({ message: "Product not found" });

		await cart.removeProduct(product);
		res.json({ message: "Product deleted from cart successfully" });
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while deleting the product from the cart : ${error}`,
		});
	}
};