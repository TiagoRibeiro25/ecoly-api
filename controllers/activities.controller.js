const db = require("../models/db");
const { Op, ValidationError } = require("sequelize");
const Activities = db.activities;
const activity_images = db.activity_image;
const Users = db.users;
const Schools = db.schools;
const Themes = db.theme;

function fixDate(date) {
	const Date = date.toISOString().split("T")[0];

	const reverseDate = Date.split("-").reverse().join("-");

	return reverseDate;
}

// TODO => add Authentication (Token auth_key) when creating activities
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
				success: true,
				message: "Activity added",
			});
		}
	} catch (err) {
		if (err instanceof ValidationError) {
			if (Object.keys(req.body).length === 0) {
				return res.status(400).json({
					success: false,
					error: "body cannot be empty",
				});
			}
			// else check if the body includes the required fields otherwise return null errors
			else {
				return res.status(400).json({
					success: false,
					// for each error in the errors array return the error message
					error: err.errors.map((error) => error.message),
				});
			}
		}

		return res.status(500).json({
			success: false,
			error: err.message || "Something went wrong. Please try again later.",
		});
	}
};

exports.getOneActivity = async (req, res) => {
	const { id } = req.params;

	try {
		const activity = await Activities.findByPk(id, {
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
					attributes: ["id", "name"],
				},
				{
					model: activity_images,
					as: "activity_images",
					attributes: ["img"],
				},
			],

			// remove the school_id, theme_id and creator_id from the response
			attributes: {
				exclude: ["school_id", "theme_id", "creator_id", "report"],
			},
		});

		if (isNaN(id)) {
			return res.status(400).json({
				success: false,
				error: "invalid id",
			});
		}

		if (!activity) {
			return res.status(404).json({
				success: false,
				error: `activity with id ${id} not found`,
			});
		}

		const response = {
			id: activity.id,
			creator: {
				id: activity.creator.id,
				name: activity.creator.name,
			},
			is_finished: activity.is_finished,
			school: activity.school.name,
			theme: activity.theme.name,
			title: activity.title,
			complexity: activity.complexity,
			initial_date: fixDate(activity.initial_date),
			final_date: fixDate(activity.final_date),
			objective: activity.objective,
			diagnostic: activity.diagnostic,
			meta: activity.meta,
			resources: activity.resources,
			participants: activity.participants,
			evaluation_indicator: activity.evaluation_indicator,
			evaluation_method: activity.evaluation_method,
			images: activity.activity_images.map((image) => image.img),
		};
		return res.status(200).json({
			success: true,
			data: response,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message || "Something went wrong. Please try again later.",
		});
	}
};

exports.searchActivities = async (req, res) => {
	const { search } = req.query;
	const formatVal = search.replace(/%20/g, " ");

	try {
		const activities = await Activities.findAll({
			where: {
				title: {
					[Op.like]: `%${formatVal}%`,
				},
				is_finished: false,
			},
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
					attributes: ["id", "name"],
				},
				{
					model: activity_images,
					as: "activity_images",
					attributes: ["img"],
				},
			],
			attributes: {
				exclude: ["school_id", "theme_id", "creator_id", "report"],
			},
		});

		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: `There is no activities found with that title`,
			});
		}

		const response = activities.map((activity) => {
			return {
				id: activity.id,
				creator: {
					id: activity.creator.id,
					name: activity.creator.name,
				},
				is_finished: activity.is_finished,
				school: activity.school.name,
				theme: activity.theme.name,
				title: activity.title,
				complexity: activity.complexity,
				initial_date: fixDate(activity.initial_date),
				final_date: fixDate(activity.final_date),
				objective: activity.objective,
				diagnostic: activity.diagnostic,
				meta: activity.meta,
				resources: activity.resources,
				participants: activity.participants,
				evaluation_indicator: activity.evaluation_indicator,
				evaluation_method: activity.evaluation_method,
				images: activity.activity_images.map((image) => image.img),
			};
		});

		return res.status(200).json({
			success: true,
			data: response,
		});


	} catch (err) {
		return res.status(500).json({
			success: false,
			error: err.message || "Something went wrong. Please try again later.",
		});
	}
};