import User from "../models/mongodb-user.js";
import ProductHistory from "../models/mongodb-productHistory.js";
import months from "../lib/monthsForStats.js";

export const getLastMonths = async (req, res) => {
	try {
		const currentDate = new Date();
		const lastMonths = [];
		for (let i = 0; i < 12; i++) {
			const date = new Date(currentDate);
			date.setMonth(date.getMonth() - i);
			lastMonths.push(months[date.getMonth()]);
		}
		res.status(200).json(lastMonths.reverse());
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the last months: ${error}`,
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
		const usersCount = await User.find(query).countDocuments();
		res.status(200).json(usersCount);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the new users: ${error}`,
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

		const usersCount = await User.find(query).countDocuments();
		res.status(200).json(usersCount);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the new users: ${error}`,
		});
	}
};

export const getNewUsersLastYear = async (req, res) => {
	try {
		const currentDate = new Date();
		const lastMonths = [];
		const newUsers = [];
		for (let i = 0; i < 12; i++) {
			const date = new Date(
				currentDate.setMonth(currentDate.getMonth() - i)
			);
			const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
			const endDate = new Date(
				date.getFullYear(),
				date.getMonth() + 1,
				0
			);
			endDate.setHours(23, 59, 59, 999);
			const query = {
				createdAt: {
					$gte: startDate,
					$lte: endDate,
				},
			};
			const users = await User.find(query).countDocuments();
			lastMonths.push(months[date.getMonth()]);
			newUsers.push(users);
		}
		res.status(200).json(newUsers.reverse());
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the new users: ${error}`,
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
			error: `An error occurred while retrieving the new products: ${error}`,
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
			error: `An error occurred while retrieving the new products: ${error}`,
		});
	}
};

export const getNewProductsLastYear = async (req, res) => {
	try {
		const currentDate = new Date();
		const lastYear = new Date();
		lastYear.setFullYear(currentDate.getFullYear() - 1);
		const lastMonths = [];
		const totalAddedQuantities = [];

		for (let i = 1; i <= 12; i++) {
			const startDate = new Date(lastYear);
			startDate.setMonth(lastYear.getMonth() + i);
			startDate.setDate(1);
			startDate.setHours(0, 0, 0, 0);

			const endDate = new Date(startDate);
			endDate.setMonth(startDate.getMonth() + 1);
			endDate.setDate(0);
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

			lastMonths.push(months[startDate.getMonth()]);
			totalAddedQuantities.push(
				result.length > 0 ? result[0].totalQuantityAdded : 0
			);
		}

		res.status(200).json(totalAddedQuantities);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the total added quantities for the last year: ${error}`,
		});
	}
};
