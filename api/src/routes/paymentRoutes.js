import Payment from "../models/postgres-payment.js";
import Order from "../models/postgres-order.js";
import User from "../models/postgres-user.js"
import stripe from "../config/stripe-config.js";

export const createPayment = async (req, res) => {
	try {
		const { orderId } = req.body;
		const status = "unpaid";
		const order = await Order.findOne({ where: { id: orderId }, include: "products" });
		const products = order.products;
		const storeItems = new Map([]);
		const user = await User.findOne({where : {id : order.userId}});
		
		products.map(item => {
			storeItems.set(item.id, {
				name: item.name,
				price: item.price * 100,
				quantity: item.Orders_Products.quantity,
				size: item.size,
				color: item.color,
				vat: item.vat,
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
						metadata: {
							size: storeItem.size,
							color: storeItem.color,
						}
					},
					unit_amount: parseInt(storeItem.price * (1 + parseFloat(storeItem.vat) )),
				},
				quantity: storeItem.quantity,
			}
			}),
			success_url: 'http://localhost:3000/payments/success?session_id={CHECKOUT_SESSION_ID}',
			cancel_url: 'http://localhost:3000/payments/failed?session_id={CHECKOUT_SESSION_ID}',
			expires_at :  Math.floor((Date.now() / 1000) + (30 * 60)),
			metadata: {
				deliveryAdress: order.deliveryAddress,
				customer_address: user.address + ' - ' + user.city + ' ' +  user.postcode,
				customer_email: user.email,
				customer_firstName: user.firstname,
				customer_lastName: user.lastname,
				customer_phone: user.phone
			}
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
		const { id } = req.params;
		const payment = await Payment.findOne({ where: { id: id }, include: "order" });
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

		const payment = await Payment.findOne({ where: { id: req.params.session } });
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
		const {session_id} = req.query;
		const payment = await Payment.findOne({ where: { stripePaymentId: session_id } });

		const session = await stripe.checkout.sessions.retrieve(payment.stripePaymentId);
		if (session.payment_status === "paid") {
			payment.status = "paid";
			await payment.save();
			const order = await Order.findOne({ where: { id: payment.orderId } });
			order.status = "paid";
			await order.save();

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
		const {session_id} = req.query;
		const payment = await Payment.findOne({ where: { stripePaymentId: session_id } });
		payment.status = "failed";
		await payment.save();
		const order = await Order.findOne({ where: { id: payment.orderId } });
		order.status = "payment failed";
		await order.save();
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

