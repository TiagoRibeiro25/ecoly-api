const validateEmail = require("../utils/validateEmail");

exports.validateBodySubscribe = (req, res, next) => {
	const { email } = req.body;

	// validate the email
	if (!email || !validateEmail(email)) {
		return res.status(400).json({ success: false, message: "Invalid email!" });
	}

	next();
};
