import Payment from "../models/postgres-payment.js";
import Order from "../models/postgres-order.js";
import Product from "../models/postgres-product.js";

export const createPayment = async (req, res) => {
	try {
		const { orderId } = req.body;
		const status = "unpaid";
		const order = Order.findOne({ where: { id: orderId } });
		const products = order.products;
		const storeItems = new Map([]);
		
		products.map(item => {
			const product = Product.findOne({ where: { id: item.id } });
			storeItems.set(item.id, {
				name: product.name,
				price: product.price * 100,
				quantity: item.quantity,
				size: product.size,
				color: product.color,
				vat: product.vat,
			});
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: products.map(item => {
			  const storeItem = storeItems.get(item.id);
			  return {
				price_data: {
				  currency: "eur",
				  product_data: {
					name: storeItem.name,
				  },
				  unit_amount: storeItem.price + (storeItem.price * storeItem.vat),

				},
				quantity: storeItem.quantity,
				size: storeItem.size,
				color: storeItem.color,
			  }
			}),
			success_url: 'http://localhost:3000/payments/success?paymentId='+order.id,
			cancel_url: 'http://localhost:3000/payments/failed?paymentId='+order.id,
			client_reference_id: JSON.stringify({
			  orderId: order.id,
			  items: products,
			}),
		  });

		  const payment = await Payment.create({
			orderId: order.id,
			stripePaymentId: session.id,
			status: status,
		  });

		  return res.json(payment);

	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while creating the payment : ${error}`,
		});
	}
}

export const getPayment = async (req, res) => {
	try {
		const { id } = req.params.paymentId;
		const payment = await Payment.findOne({ where: { id: id } });
		return res.json(payment);
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while getting the payment : ${error}`,
		});
	}
}

export const getStripeSession = async (req, res) => {
	try {
		const { id } = req.params.paymentId
		const payment = await Payment.findOne({ where: { id: id } });
		const session = await stripe.checkout.sessions.retrieve(payment.stripePaymentId);
		return res.json(session);
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while getting the payment url : ${error}`,
		});
	}
}

export const stripeSuccess = async (req, res) => {
	try {
		const { orderId } = req.params
		const payment = await Payment.findOne({ where: { orderId: orderId } });
		const session = await stripe.checkout.sessions.retrieve(payment.stripePaymentId);
		if (session.payment_status === "paid") {
			payment.status = "paid";
			await payment.save();
			const Order = await Order.findOne({ where: { id: payment.orderId } });
			Order.status = "paid";
			await Order.save();

			return res.json({ message: "Payment succeed" });
		}
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while getting the payment url : ${error}`,
		});
	}
}

export const stripeFailed = async (req, res) => {
	try {
		const { orderId } = req.params
		const payment = await Payment.findOne({ where: { orderId: orderId } });
		payment.status = "failed";
		await payment.save();
		return res.json({ message: "Payment failed" });
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while getting the payment url : ${error}`,
		});
	}
}

export const getPayments = async (req, res) => {
	try {
		const payments = await Payment.findAll();
		return res.json(payments);
	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while getting the payments : ${error}`,
		});
	}
}

