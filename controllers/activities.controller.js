const db = require("../models/db");
const { Op, ValidationError } = require("sequelize");
const Activities = db.activities;
const activity_images = db.activity_image;

// TODO => add Auhtentication (Token auth_key) when creating activities
// TODO => add 401 Unauthorized error when creating activities with invalid auth_key
// TODO => add 403 Forbidden error without auth_key
exports.createActivity = async (req, res) => {
	try {
		const { fields } = req.query;
		const activity = await Activities.create(req.body);

        
		// add blocks of code for the authenticaion validations
		//
		//
		 if (fields === "activities") {
			return res.status(201).json({
				message: "Activity added",
				activity,
			});
		}
	} catch (err) {
		if (err instanceof ValidationError) {
			return res.status(400).json({
				error: err.errors.map((e) => e.message),
			});
		}

		return res.status(500).json({
			error: err.message || "Something went wrong. Please try again later.",
		});
	}
};

