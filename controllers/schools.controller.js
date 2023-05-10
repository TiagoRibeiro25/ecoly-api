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
	} catch (error) {
		res.status(500).send({
			success: false,
			message: "Failed to fetch schools",
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

		return res.status(200).json({
			success: true,
			school: result,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch school",
		});
	}
};

exports.addSchool = async (req, res) => {
	const { school } = req.body;

	try {
		const existingSchool = await Schools.findOne({ where: { school } });
		if (existingSchool) {
			res.status(409).json({
				success: false,
				message: "The school already exists",
			});
		} else {
			const newSchool = await Schools.create({ school });
			res.status(201).json({
				success: true,
				message: "School successfully added",
			});
		}
	} catch (error) {
		res.status(500).send({
			success: false,
			message: "Failed to add new school",
		});
	}
};

exports.deleteSchool = async (req, res) => {
	const { id } = req.params;

	try {
		const schoolToDelete = await Schools.findByPk(id);

		if (!schoolToDelete) {
			res.status(404).json({
				success: false,
				message: "School was not found",
			});
		} else {
			await schoolToDelete.destroy();

			res.status(200).json({
				success: true,
				message: "The school was deleted",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to delete school",
		});
	}
};
