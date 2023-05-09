const db = require("../models/db");
const Schools = db.schools;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getSchools = async (req, res) => {
	try {
		const schools = await Schools.findAll();
		res.status(200).json({
			success: true,
			schools,
		});
	} catch (err) {
		res.status(500).send({
			success: false,
			mesage: "Failed to fetch schools",
		});
	}
};

exports.getSchool = async (req, res) => {
	const { id } = req.params;

	try {
		const school = await Schools.findByPk(id);
		if (!school) {
			return res.status(404).json({
				success: false,
				message: "School does not exist",
			});
		}

		const result = school.toJSON();

		let token = req.headers["x-access-token"] || req.headers.authorization;
		token = token?.replace("Bearer ", "");

		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
			} catch (error) {
				return res.status(401).json({
					success: false,
					message: "Invalid token",
				});
			}
		}
		return res.status(200).json({
			success: true,
			school: result,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch school",
		});
	}
};
