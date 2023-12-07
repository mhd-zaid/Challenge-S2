export default (Payment, Order, User, stripe, OrderMongodb, ObjectId) => ({
	createPayment: async (req, res) => {
		try {
			const { orderId } = req.body;
			if (!orderId) {
				return res.status(400).json({ message: "orderId parameter is missing" });
			}

			const status = "unpaid";
			const order = await Order.findOne({
				where: { id: orderId },
				include: "products",
			});

			if (!order) {
				return res.status(404).json({ message: "Order not found" });
			}

			const products = order.products;
			const storeItems = new Map([]);
			const user = await User.findOne({ where: { id: order.userId } });
			
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			products.map((item) => {
				storeItems.set(item.id, {
					name: item.name,
					price: item.Orders_Products.price,
					quantity: item.Orders_Products.quantity,
					size: item.size,
					color: item.color,
					vat: item.vat,
				});
			});

			const session = await stripe.checkout.sessions.create({
				payment_method_types: ["card"],
				mode: "payment",
				line_items: products.map((item) => {
					const storeItem = storeItems.get(item.id);
					return {
						price_data: {
							currency: "eur",
							product_data: {
								name: storeItem.name,
								metadata: {
									size: storeItem.size,
									color: storeItem.color,
								},
							},
							unit_amount: parseInt(
								storeItem.price
							),
						},
						quantity: storeItem.quantity,
					};
				}),
				success_url:
					process.env.HOST_CLIENT+"/payment/success",
				cancel_url:
					process.env.HOST_CLIENT+"/payment/failed",
				expires_at: Math.floor(Date.now() / 1000 + 30 * 60),
				metadata: {
					deliveryAdress: order.deliveryAddress,
					customer_address:
						user.address + " - " + user.city + " " + user.postcode,
					customer_email: user.email,
					customer_firstName: user.firstname,
					customer_lastName: user.lastname,
					customer_phone: user.phone,
				},
			});

			const payment = await Payment.create({
				orderId: order.id,
				stripePaymentId: session.id,
				status: status,
			});

			return res.status(201).json(payment);
		} catch (error) {
			if (error.name == "SequelizeValidationError") {
				return res.status(422).json({ message: error.message });
			}else{
				return res.status(500).json({
					message: `An error occurred while creating the payment : ${error.message}`,
				});
			}
			
		}
	},

	getPayment: async (req, res) => {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ message: "id parameter is missing" });
			}

			const payment = await Payment.findOne({
				where: { id: id },
				include: "order",
			});
			if (!payment) {
				return res.status(404).json({ message: "Payment not found" });
			}

			return res.status(200).json(payment);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while getting the payment : ${error.message}`,
			});
		}
	},

	getStripeSession: async (req, res) => {
		try {
			if (!req.params.session) {
				return res.status(400).json({ message: "session parameter is missing" });
			}

			const payment = await Payment.findOne({
				where: { id: req.params.session },
			});
			if (!payment) {
				return res.status(404).json({ message: "Payment not found" });
			}

			const session = await stripe.checkout.sessions.retrieve(
				payment.stripePaymentId
			);
			
			if(!session)
				return res.status(404).json({ message: "Session not found" }
			);

			return res.status(200).json(session);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while getting the payment url : ${error.message}`,
			});
		}
	},

	stripeSuccess: async (req, res) => {
		try {
			const { data } = req.body;
			const sessionId = data.object.id;
			const status = data.object.payment_status;

			const payment = await Payment.findOne({
				where: { stripePaymentId: sessionId },
			});

			if (!payment) {
				return res.status(404).json({ message: "Payment not found" });
			}

			if (status === "paid") {
				payment.status = "paid";
				await payment.save();
				const order = await Order.findOne({ where: { id: payment.orderId } });
				order.status = "paid";
				await order.save();
				const mongoOrder = await OrderMongodb.findOne({
					_id: new ObjectId(order.id),
				});
				mongoOrder.status = "paid";
				await mongoOrder.save();

				return res.json({ message: "Payment succeed & order status updated" });
			}
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while getting the payment url : ${error.message}`,
			});
		}
	},

	stripeFailed: async (req, res) => {
		try {
			const { data } = req.body;
			const sessionId = data.object.id;
			const status = data.object.payment_status;

			const payment = await Payment.findOne({
				where: { stripePaymentId: sessionId },
			});

			if (!payment) {
				return res.status(404).json({ message: "Payment not found" });
			}

			if (status === "failed") {
				payment.status = "failed";
				await payment.save();
				const order = await Order.findOne({ where: { id: payment.orderId } });
				order.status = "payment failed";
				await order.save();
				const mongoOrder = await OrderMongodb.findOne({
					_id: new ObjectId(order.id),
				});
				mongoOrder.status = "payment failed";
				await mongoOrder.save();

				return res.json({ message: "Payment failed & order status updated" });
			}
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while getting the payment url : ${error.message}`,
			});
		}
	},

	getPayments: async (req, res) => {
		try {
			const payments = await Payment.findAll();

			return res.status(200).json(payments);
		} catch (error) {
			res.status(500).json({
				message: `An error occurred while getting the payments : ${error.message}`,
			});
		}
	},
});
