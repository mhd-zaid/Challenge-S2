import User from "../models/mongodb-user.js";
import ProductHistory from "../models/mongodb-productHistory.js";
import months from "../lib/monthsForStats.js";
import Order from "../models/mongodb-order.js";

export const getLastMonths = async (req, res) => {
	try {
		const currentDate = new Date();
		const lastMonths = [];
		for (let i = 0; i < 12; i++) {
			const month = currentDate.getMonth() - i;
			if (month < 0) {
				lastMonths.push(months[month + 12]);
			} else {
				lastMonths.push(months[month]);
			}
		}
		res.status(200).json(lastMonths.reverse());
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the last months: ${error.message}`,
		});
	}
};

// Users

export const getNewUsersLast30Days = async (req, res) => {
	try {
		const currentDate = new Date();
		const date30DaysAgo = new Date(
			currentDate.setDate(currentDate.getDate() - 30)
		);
		date30DaysAgo.setHours(0, 0, 0, 0);
		const query = {
			createdAt: {
				$gte: date30DaysAgo,
				$lte: new Date(),
			},
		};
		const usersCount = await User.count(query);
		res.status(200).json(usersCount);
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the new users: ${error.message}`,
		});
	}
};

export const getNewUsersBeforeLast30Days = async (req, res) => {
	try {
		const currentDate = new Date();
		const date30DaysAgo = new Date(currentDate);
		date30DaysAgo.setDate(currentDate.getDate() - 60);
		date30DaysAgo.setHours(0, 0, 0, 0);

		const date30DaysAgoEnd = new Date(currentDate);
		date30DaysAgoEnd.setDate(currentDate.getDate() - 30);
		date30DaysAgoEnd.setHours(23, 59, 59, 999);

		const query = {
			createdAt: {
				$gte: date30DaysAgo,
				$lte: date30DaysAgoEnd,
			},
		};

		const usersCount = await User.count(query);
		res.status(200).json(usersCount);
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the new users: ${error.message}`,
		});
	}
};

export const getNewUsersLastYear = async (req, res) => {
	try {
		const currentDate = new Date();
		const newUsers = [];
		for (let i = 0; i < 12; i++) {
			let month = currentDate.getMonth() - i;
			if (month < 0) {
				month = month + 12;
			}
			const startDate = new Date(currentDate.getFullYear(), month, 1);
			const endDate = new Date(currentDate.getFullYear(), month + 1, 0);
			endDate.setHours(23, 59, 59, 999);
			const query = {
				createdAt: {
					$gte: startDate,
					$lte: endDate,
				},
			};
			const users = await User.count(query);
			newUsers.push(users);
		}
		res.status(200).json(newUsers.reverse());
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the new users: ${error.message}`,
		});
	}
};

// Products

export const getNewProductsLast30Days = async (req, res) => {
	try {
		const currentDate = new Date();
		const date30DaysAgo = new Date(
			currentDate.setDate(currentDate.getDate() - 30)
		);
		date30DaysAgo.setHours(0, 0, 0, 0);

		const result = await ProductHistory.aggregate([
			{
				$match: {
					isAddition: true, // adds only
					createdAt: {
						$gte: date30DaysAgo,
						$lte: new Date(),
					},
				},
			},
			{
				$group: {
					_id: null,
					totalQuantityAdded: { $sum: "$quantityChange" }, // sums the quantity added
				},
			},
		]);

		if (result.length === 0) {
			return res.status(200).json(0);
		}

		res.status(200).json(result[0].totalQuantityAdded);
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the new products: ${error.message}`,
		});
	}
};

export const getNewProductsBeforeLast30Days = async (req, res) => {
	try {
		const currentDate = new Date();
		const date30DaysAgo = new Date(currentDate);
		date30DaysAgo.setDate(currentDate.getDate() - 60);
		date30DaysAgo.setHours(0, 0, 0, 0);

		const date30DaysAgoEnd = new Date(currentDate);
		date30DaysAgoEnd.setDate(currentDate.getDate() - 30);
		date30DaysAgoEnd.setHours(23, 59, 59, 999);

		const result = await ProductHistory.aggregate([
			{
				$match: {
					isAddition: true, // adds only
					createdAt: {
						$gte: date30DaysAgo,
						$lte: date30DaysAgoEnd,
					},
				},
			},
			{
				$group: {
					_id: null,
					totalQuantityAdded: { $sum: "$quantityChange" }, // sums the quantity added
				},
			},
		]);

		if (result.length === 0) {
			return res.status(200).json(0);
		}

		res.status(200).json(result[0].totalQuantityAdded);
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the new products: ${error.message}`,
		});
	}
};

export const getNewProductsLastYear = async (req, res) => {
	try {
		const currentDate = new Date();
		const newProducts = [];

		for (let i = 0; i < 12; i++) {
			let month = currentDate.getMonth() - i;
			if (month < 0) {
				month = month + 12;
			}
			const startDate = new Date(currentDate.getFullYear(), month, 1);
			const endDate = new Date(currentDate.getFullYear(), month + 1, 0);
			endDate.setHours(23, 59, 59, 999);

			const result = await ProductHistory.aggregate([
				{
					$match: {
						isAddition: true,
						createdAt: { $gte: startDate, $lte: endDate },
					},
				},
				{
					$group: {
						_id: null,
						totalQuantityAdded: { $sum: "$quantityChange" },
					},
				},
			]);

			newProducts.push(
				result.length > 0 ? result[0].totalQuantityAdded : 0
			);
		}

		res.status(200).json(newProducts.reverse());
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the total added quantities for the last year: ${error.message}`,
		});
	}
};

// Orders

export const getNewOrdersLast30Days = async (req, res) => {
	try {
		const currentDate = new Date();
		const date30DaysAgo = new Date(
			currentDate.setDate(currentDate.getDate() - 30)
		);
		date30DaysAgo.setHours(0, 0, 0, 0);
		const query = {
			status: "paid",
			date: {
				$gte: date30DaysAgo,
				$lte: new Date(),
			},
		};
		const ordersCount = await Order.count(query);
		res.status(200).json(ordersCount);
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the new orders: ${error.message}`,
		});
	}
};

export const getNewOrdersBeforeLast30Days = async (req, res) => {
	try {
		const currentDate = new Date();
		const date30DaysAgo = new Date(currentDate);
		date30DaysAgo.setDate(currentDate.getDate() - 60);
		date30DaysAgo.setHours(0, 0, 0, 0);

		const date30DaysAgoEnd = new Date(currentDate);
		date30DaysAgoEnd.setDate(currentDate.getDate() - 30);
		date30DaysAgoEnd.setHours(23, 59, 59, 999);

		const query = {
			status: "paid",
			date: {
				$gte: date30DaysAgo,
				$lte: date30DaysAgoEnd,
			},
		};

		const ordersCount = await Order.count(query);
		res.status(200).json(ordersCount);
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the new orders: ${error.message}`,
		});
	}
};

export const getNewOrdersLastYear = async (req, res) => {
	try {
		const currentDate = new Date();
		const newOrders = [];
		for (let i = 0; i < 12; i++) {
			let month = currentDate.getMonth() - i;
			if (month < 0) {
				month = month + 12;
			}
			const startDate = new Date(currentDate.getFullYear(), month, 1);
			const endDate = new Date(currentDate.getFullYear(), month + 1, 0);
			endDate.setHours(23, 59, 59, 999);
			const query = {
				status: "paid",
				date: {
					$gte: startDate,
					$lte: endDate,
				},
			};
			const orders = await Order.count(query);
			newOrders.push(orders);
		}
		res.status(200).json(newOrders.reverse());
	} catch (error) {
		res.status(500).json({
			message: `An error occurred while retrieving the new orders: ${error.message}`,
		});
	}
};
