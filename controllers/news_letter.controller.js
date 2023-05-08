const db = require("../models/db");

exports.subscribe = async (req, res) => {
	const { email } = req.body;

	console.log(email);
	try {
		// Check if email already exists
		const existingEmail = await db.news_letter.findOne({ where: { email } });
		if (existingEmail) {
			res.status(409).json({
				success: false,
				message: "Email already subscribed",
			});
		} else {
			// Sign up for the newsletter
			const subscriber = await news_letter.create({ email });
			res.status(201).json({
				success: true,
				message: "Email subscribed successfully - " + subscriber.email,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to subscribe to the newsletter",
		});
	}
};

exports.getAllSubscribedEmails = async (req, res) => {
	try {
		// Fetch all subscribed emails
		const emails = await news_letter.findAll();
		res.status(200).json({
			success: true,
			emails,
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			message: "Failed to fetch subscribed emails",
		});
	}
};

exports.deleteSubscription = async (req, res) => {
	const { email } = req.body;

	try {
		// Find the email to be deleted
		const subscriber = await news_letter.findOne({ where: { email } });

		if (!subscriber) {
			res.status(404).json({
				success: false,
				message: "Email not found",
			});
		} else {
			// Delete the email
			await subscriber.destroy();

			res.status(200).json({
				success: true,
				message: "Email deleted successfully",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to delete email",
		});
	}
};
