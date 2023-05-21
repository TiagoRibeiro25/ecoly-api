const db = require("../models/db");
const NewsLetter = db.news_letter;
const Users = db.users;

exports.subscribe = async (req, res) => {
	const { email } = req.body;
	try {
		// Check if email already exists
		const existingEmail = await NewsLetter.findOne({ where: { email } });
		if (existingEmail) throw new Error("Email already subscribed");
		else {
			// Sign up for the newsletter
			const subscriber = await NewsLetter.create({ email });
			res.status(201).json({
				success: true,
				message: "Email subscribed successfully - " + subscriber.email,
			});
		}
	} catch (error) {
		if (error.message === "Email already subscribed") {
			return res.status(409).json({ success: false, message: error.message });
		}

		res.status(500).json({
			success: false,
			message: "Failed to subscribe to the newsletter",
		});
	}
};

exports.isEmailSubscribed = async (req, res) => {
	try {
		const user = await Users.findByPk(req.tokenData.userId);
		if (user) {
			const email = user.email;
			const subscriber = await NewsLetter.findOne({ where: { email } });

			if (!subscriber) {
				return res.status(404).json({ success: false, message: "Email not found" });
			}
			return res
				.status(200)
				.json({ success: true, message: "Email found", deleteKey: subscriber.delete_key });
		}
		res.status(404).json({ success: false, message: "Email not found" });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to check if email is subscribed",
		});
	}
};

exports.deleteSubscription = async (req, res) => {
	const { id } = req.params;

	try {
		// Find the email to be deleted
		const subscriber = await NewsLetter.findByPk(id);

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
