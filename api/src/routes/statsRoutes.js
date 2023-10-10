import User from "../models/mongodb-user.js";

export const getNewUsers = async (req, res) => {
	try {
		const dates = req.body.dates;
		if (
			!dates ||
			dates.length !== 2 ||
			isNaN(Date.parse(dates[0])) ||
			isNaN(Date.parse(dates[1]))
		)
			throw new Error("Invalid arguments");
        dates[1] = new Date(dates[1]).setHours(23, 59, 59, 999);
		const users = await User.find({
			createdAt: {
				$gte: new Date(dates[0]),
				$lte: new Date(dates[1]),
			},
		}).countDocuments();
		res.json(users);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while retrieving the new users : ${error}`,
		});
	}
};
