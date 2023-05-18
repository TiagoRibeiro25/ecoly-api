const colors = require("colors");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const Roles = db.role;

exports.verifyToken = (req, res, next) => {
	// search token in the request header
	const header = req.headers["x-access-token"] || req.headers["authorization"];

	try {
		if (!header) {
			throw new Error("No token provided!");
		}

		const bearer = header.split(" ");
		const token = bearer[1];

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.tokenData = {};
		req.tokenData.userId = decoded.userId;
		req.tokenData.roleId = decoded.roleId;
		req.tokenData.schoolId = decoded.schoolId;

		next();
	} catch (err) {
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
