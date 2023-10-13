import User from "../models/mongodb-user.js";

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
		const months = [
			"Jan",
			"Fév",
			"Mars",
			"Avr",
			"Mai",
			"Juin",
			"Juil",
			"Août",
			"Sept",
			"Oct",
			"Nov",
			"Déc",
		];
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
		res.status(200).json({
			months: lastMonths.reverse(),
			newUsers: newUsers.reverse(),
		});
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the new users: ${error}`,
		});
	}
};
