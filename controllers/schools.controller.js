const db = require("../models/db");
const Schools = db.schools;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getSchools = async (req, res) => {
	try {
		const schools = await Schools.findAll();
		res.status(200).json({
			success: true,
			data: schools,
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
	const { name } = req.body;

	try {
		const existingSchool = await Schools.findOne({ where: { name } });

		if (existingSchool) {
			res.status(409).json({
				success: false,
				message: "The school already exists",
			});
		} else {
			const newSchool = await Schools.create({ name });

			res.status(201).json({
				success: true,
				message: "School successfully added",
				data: newSchool,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to add new school",
		});
	}
};

exports.updateSchoolName = async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	try {
		const schoolToUpdate = await Schools.findByPk(id);

		if (!schoolToUpdate) {
			res.status(404).json({
				success: false,
				message: "School was not found",
			});
		} else {
			schoolToUpdate.name = name;
			await schoolToUpdate.save();

			res.status(200).json({
				success: true,
				message: "The school name was updated",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to update school name",
		});
	}
};
