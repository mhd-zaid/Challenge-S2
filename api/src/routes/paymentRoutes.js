import Payment from "../models/postgres-payment.js";

export const createPayment = async (req, res) => {
	try {
		
		const { orderId, stripePaymentId } = req.body;
		const status = "unpaid";

	}
	catch (error) {
		res.status(500).json({
			error: `An error occurred while creating the payment : ${error}`,
		});
	}
}