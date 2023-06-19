const colors = require("colors");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const Roles = db.role;

exports.verifyToken = (req, res, next) => {
	// get auth token from the request headers
	let token = req.headers["x-access-token"] || req.headers["authorization"];

	try {
		//if token is not present
		if (!token) {
			throw new Error("No token provided!");
		}

		// if token is present, remove the Bearer from the token
		if (token.startsWith("Bearer ")) {
			token = token.slice(7, token.length);
		}

		// verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// if the token was generated 30seconds ago, generate a new token
		if (decoded.iat + 30 < Date.now() / 1000) {
			const newToken = jwt.sign(
				{
					userId: decoded.userId,
					roleId: decoded.roleId,
					schoolId: decoded.schoolId,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "7d" } // 1 week (if the token is not used for 1 week, it will expire)
			);

			// set the new token in the response header
			res.setHeader("authorization", `Bearer ${newToken}`);
		}

		// set the token data in the request object
		req.tokenData = {};
		req.tokenData.userId = decoded.userId;
		req.tokenData.roleId = decoded.roleId;
		req.tokenData.schoolId = decoded.schoolId;

		next();
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(401).json({ success: false, message: "Token expired!" });
		}

		return res.status(401).json({ success: false, message: "Unauthorized!" });
	}
};

exports.verifyIsAdmin = async (req, res, next) => {
	try {
		const role = await Roles.findOne({ where: { id: req.tokenData.roleId } });

		role.title === "admin"
			? next()
			: res.status(403).json({ success: false, message: "Require Admin Role!" });
	} catch (err) {
		console.log(colors.yellow(`Error in verifyIsAdmin middleware: ${err.message}`));
		res.status(500).json({ success: false, message: "Some error occurred on our side." });
	}
};

exports.verifyIsVerified = async (req, res, next) => {
	try {
		const role = await Roles.findOne({ where: { id: req.tokenData.roleId } });

		role.title !== "unsigned"
			? next()
			: res.status(403).json({ success: false, message: "Require Verified Role!" });
	} catch (err) {
		console.log(colors.yellow(`Error in verifyIsVerified middleware: ${err.message}`));
		res.status(500).json({ success: false, message: "Some error occurred on our side." });
	}
};
