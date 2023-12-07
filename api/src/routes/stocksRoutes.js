export default (Product, ProductHistory) => {
	const getProductHistory = async (req, res) => {
		const { id } = req.params;
		try {
			const productHistory = await ProductHistory.find({ productId: id })
				.select("quantityChange isAddition createdAt")
				.sort({ createdAt: -1 });
			return res.status(200).json(productHistory);
		} catch (e) {
			console.error(e);
			return res
				.status(500)
				.json({ message: `Error while getting product history: ${e}` });
		}
	};

	const updateProductStocks = async (req, res) => {
		const { id } = req.params;
		const { quantity, isAddition } = req.body;

		try {
			const product = await Product.findOne({ where: { id } });

			if (!product) {
				return res.status(404).json({ message: "Product not found" });
			}

			product.quantity = isAddition
				? product.quantity + quantity
				: product.quantity - quantity;
            
            if (product.quantity < 0) {
                return res.status(400).json({ message: "Quantity can't be negative" });
            }

			await product.save();

			const productHistory = new ProductHistory({
				productId: id,
				quantityChange: quantity,
				isAddition,
			});

			await productHistory.save();

			return res.sendStatus(200);
		} catch (e) {
			console.error(e);
			return res
				.status(500)
				.json({ message: `Error while updating product stocks: ${e}` });
		}
	};

	return {
		getProductHistory,
		updateProductStocks,
	};
};
