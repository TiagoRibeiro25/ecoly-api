const jwt = require("jsonwebtoken");
const validateEmail = require("../utils/validateEmail");
const db = require("../models/db");
const Users = db.users;

exports.validateBodySubscribe = async (req, res, next) => {
	try {
		// check if there's a token in the request and get the email from the token
		let token = req.headers["x-access-token"] || req.headers.authorization;
		token = token?.replace("Bearer ", "");
		token = token?.replace("Bearer", "");

		if (token) {
			// verify the token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// get the user from the token
			const user = await Users.findByPk(decoded.userId);

			if (user) {
				req.body.email = user.email;
				next();
				return;
			}
		}

		const { email } = req.body;

		if (!email || !validateEmail(email)) {
			return res.status(400).json({ success: false, message: "Invalid email!" });
		}

		next();
	} catch (error) {
		res.status(500).json({ success: false, message: "Failed to validate email" });
	}
};
