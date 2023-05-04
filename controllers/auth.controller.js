const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.verifyToken = (req, res, next) => {
	// search token in the request header
	const header = req.headers["x-access-token"] || req.headers["authorization"];

	if (!header) {
		return res.status(403).json({ success: false, message: "No token provided." });
	}

	const bearer = token.split(" ");
	const token = bearer[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.tokenData.userId = decoded.userId;
		req.tokenData.roleId = decoded.roleId;
		req.tokenData.schoolId = decoded.schoolId;

		next();
	} catch (err) {
		return res.status(401).json({ success: false, message: "Unauthorized!" });
	}
};
