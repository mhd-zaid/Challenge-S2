import Order from "../models/postgres-order.js";

export const createOrder = async (req, res) => {
	try {
		const { userId, deliveryAddress, products } = req.body;

		if (!userId || !products || !deliveryAddress) {
			return res
				.status(400)
				.json({ message: "userId, products or deliveryAddress is missing" });
		}

		const order = await Order.create({
			userId,
			status: "payment pending",
			deliveryAddress,
		});

		for (const product of products) {
			await order.addProduct(product.id, {
				through: {
					ProductVersionId: product.ProductVersionId,
				},
			});
		}

		res.json(order);
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while creating the order : ${error}`,
		});
	}
}