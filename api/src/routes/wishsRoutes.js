export default (Wish, Product, Product_Images) => ({
	getUserWish: async (req, res) => {
		try {
			const { id } = req.params;
			if (!id) {
				return res
					.status(400)
					.json({ message: "id parameter is missing" });
			}
			const wish = await Wish.findOne({
				where: { UserId: id },
				include: [
					{
						model: Product,
						as: "products",
						include: {
							model: Product_Images,
							as: "productImages",
						},
					},
				],
			});

			if (!wish) {
				return res.status(404).json({ message: "Wish not found" });
			}
			
			for (const product of wish.products) {
				product.price = (product.price / 100).toFixed(2);;
			}


			res.status(200).json(wish);
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

			if (!userId) {
				return res
					.status(400)
					.json({ message: "userId parameter is missing" });
			}

			if (!productId) {
				return res
					.status(400)
					.json({ message: "productId parameter is missing" });
			}
			
			const wish = await Wish.findOne({ where: { UserId: userId } });
			if (!wish)
				return res.status(404).json({ message: "Wish not found" });

			const product = await Product.findOne({ where: { id: productId } });
			if (!product)
				return res.status(404).json({ message: "Product not found" });

			await wish.addProduct(product);
			res.status(201).json({
				message: "Product added to wish successfully",
			});
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				return res.status(422).json({ message: error.message });
			} else {
				return res.status(500).json({
					message: `An error occurred while adding the product to the wish : ${error.message}`,
				});
			}
		}
	},

	deleteProductFromWish: async (req, res) => {
		try {
			const { userId, productId } = req.params;

			if (!userId) {
				return res
					.status(400)
					.json({ message: "userId parameter is missing" });
			}

			if (!productId) {
				return res
					.status(400)
					.json({ message: "productId parameter is missing" });
			}

			const wish = await Wish.findOne({ where: { UserId: userId } });
			if (!wish)
				return res.status(404).json({ message: "Wish not found" });

			const product = await Product.findOne({ where: { id: productId } });
			if (!product)
				return res.status(404).json({ message: "Product not found" });

			await wish.removeProduct(product);
			res.status(204).json({
				message: "Product deleted from wish successfully",
			});
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while deleting the product from the wish : ${error.message}`,
			});
		}
	},
});
