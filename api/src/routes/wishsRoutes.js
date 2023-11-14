export default (Wish, Product) => ({
	getUserWish: async (req, res) => {
		try {
			const { id } = req.params;
			const wish = await Wish.findOne({
				where: { userId: id },
				include: "products",
			});
			res.json(wish);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while retrieving the wish : ${error.message}`,
			});
		}
	},

	addProductToWish: async (req, res) => {
		try {
			const { userId } = req.params;
			const { productId } = req.body;

			if (!id || !productId) {
				return res
					.status(400)
					.json({ message: "Id parameter or productId is missing" });
			}

			const wish = await Wish.findOne({ where: { userId: userId } });
			if (!wish)
				return res.status(404).json({ message: "Wish not found" });

			const product = await Product.findOne({ where: { id: productId } });
			if (!product)
				return res.status(404).json({ message: "Product not found" });

			await wish.addProduct(product);
			res.json({ message: "Product added to wish successfully" });
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while adding the product to the wish : ${error.message}`,
			});
		}
	},

	deleteProductFromWish: async (req, res) => {
		try {
			const { userId } = req.params;
			const { productId } = req.body;

			if (!id || !productId) {
				return res
					.status(400)
					.json({ message: "Id parameter or productId is missing" });
			}

			const wish = await Wish.findOne({ where: { userId: userId } });
			if (!wish)
				return res.status(404).json({ message: "Wish not found" });

			const product = await Product.findOne({ where: { id: productId } });
			if (!product)
				return res.status(404).json({ message: "Product not found" });

			await wish.removeProduct(product);
			res.json({ message: "Product deleted from wish successfully" });
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while deleting the product from the wish : ${error.message}`,
			});
		}
	},
});
