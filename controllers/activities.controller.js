const db = require("../models/db");
const { Op, ValidationError } = require("sequelize");
const Activities = db.activities;
const activity_images = db.activity_image;
// const activity_reports = db.;

// TODO => add Auhtentication (Token auth_key) when creating activities
// TODO => add 401 Unauthorized error when creating activities with invalid auth_key
// TODO => add 403 Forbidden error without auth_key
// TODO => read auth_key for authentication => checking each user is creating the activity (creator_id, school_id)
exports.addActivity = async (req, res) => {
	try {
		const activity = await Activities.create(req.body);

		// add blocks of code for the authentication validations
		//
		//

		// if the body includes images add to the activity_images
		if (req.body.images) {
			const images = req.body.images; // array of images
			// convert the images to base64
			const base64Images = images.map((image) => Buffer.from(image, "base64"));
			// add the images to the activity_images table
			await activity_images.bulkCreate(
				base64Images.map((image) => ({
					activity_id: activity.id,
					img: image,
				}))
			);

			return res.status(201).json({
				message: "Activity added",
			});
		}
	} catch (err) {
		if (err instanceof ValidationError) {
			if (Object.keys(req.body).length === 0) {
				return res.status(400).json({
					error: "body cannot be empty",
				});
			}
			// else check if the body includes the required fields otherwise return null errors
			else {
				return res.status(400).json({
					// for each error in the errors array return the error message
					error: err.errors.map((error) => error.message),
				});
			}
		}

		return res.status(500).json({
			error: err.message || "Something went wrong. Please try again later.",
		});
	}
};
