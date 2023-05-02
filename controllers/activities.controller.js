const db = require("../models/db");
const { Op, ValidationError } = require("sequelize");
const Activities = db.activities;
const activity_images = db.activity_image;
const Users = db.users;
const Schools = db.schools;
const Themes = db.theme;


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
			// for each image in the array add the activity_id and the image to the activity_images table
			images.forEach((image) => {
				activity_images.create({
					activity_id: activity.id,
					img: image,
				});
			});

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

 async function getOneActivity(req, res) {
		const id = 1;

		const activity = await Activities.findByPk(id, {
			where: { id: id },
			// get the activity theme name, the school name and the creator name  and the images of the activity in array
			include: [
				{
					model: Themes,
					as: "theme",
					attributes: ["name"],
				},
				{
					model: Schools,
					as: "school",
					attributes: ["name"],
				},
				{
					model: Users,
					as: "creator",
					attributes: ["name"],
				},
				// {
				// 	model: activity_images,
				// 	as: "activity_images",
				// 	attributes: ["img"],
				// },
			],

			// remove the school_id, theme_id and creator_id from the response
			attributes: {
				exclude: ["school_id", "theme_id", "creator_id", "report"],
			},
		});

		console.log(JSON.stringify(activity, null, 4));
	}


getOneActivity()
