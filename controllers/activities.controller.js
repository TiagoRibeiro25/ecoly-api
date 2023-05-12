const db = require("../models/db");
const colors = require("colors");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const { Op, ValidationError } = require("sequelize");
const Activities = db.activities;
const activity_images = db.activity_image;
const Users = db.users;
const Schools = db.schools;
const Roles = db.role;
const Themes = db.theme;
const badges = db.badges; //for the unlocked badges
const userBadges = db.user_badge; //for the unlocked badges

function fixDate(date) {
	const Date = date.toISOString().split("T")[0];

	const reverseDate = Date.split("-").reverse().join("-");

	return reverseDate;
}

exports.getOneActivity = async (req, res) => {
	console.log(colors.green("get one activity"));
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
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.searchActivities = async (req, res) => {
	console.log(colors.green("searching activities..."));
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
				error: `no activities found with title ${formatVal}`,
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
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getAllActivities = async (req, res) => {
	console.log(colors.green("GET ALL ACTIVITIES"));
	try {
		const activities = await Activities.findAll({
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

		let data = activities.map((activity) => {
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

		// check if there's a token in the request
		let token = req.headers["x-access-token"] || req.headers.authorization;
		token = token?.replace("Bearer ", "");

		// with no loggedUser
		if (!token) {
			console.log("Activities without loggedUser: ", data);
			return res.status(200).json({
				success: true,
				data: data,
			});
		}

		// with loggedUser
		if (token) {
			// verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// get the current time of the token
			const currentTime = Math.floor(Date.now() / 1000);

			// get the time remaining of the token
			const timeRemaining = decoded.exp - currentTime;

			// give the time remaining in hours and minutes
			const timeRemainingHours = Math.floor(timeRemaining / 3600);

			const timeRemainingMinutes = Math.floor((timeRemaining % 3600) / 60);

			const timeRemainingSeconds = Math.floor((timeRemaining % 3600) % 60);

			const username = await Users.findByPk(decoded.userId, {
				attributes: ["name"],
			});

			const role = await Roles.findByPk(decoded.roleId, {
				attributes: ["title"],
			});

			const school = await Schools.findByPk(decoded.schoolId, {
				attributes: ["name"],
			});

			const activities_ = data.map((activity) => {
				if (
					activity.is_finished === false &&
					activity.school === school.name &&
					role.title !== "unsigned"
				) {
					return {
						canUserEdit: true,
						...activity,
					};
				}
				return {
					canUserEdit: false,
					...activity,
				};
			});

			const objectResponse = {
				loggedUser: {
					sessionTime: `${timeRemainingHours}h ${timeRemainingMinutes}m ${timeRemainingSeconds}s`,
					name: username.name,
					role: role.title,
					school: school.name,
				},
				data: activities_,
			};

			console.log("activities with loggedUser: ", objectResponse);
			return res.status(200).json({
				success: true,
				...objectResponse,
			});
		}
	} catch (err) {
		console.log(colors.red(`${err.message}`));
		
		if(err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please log in again.",
			});
		}
		
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getFinishedActivities = async (req, res) => {
	console.log(colors.green("Finished Activities"));
	try {
		const activities = await Activities.findAll({
			where: {
				is_finished: true,
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
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getUnfinishedActivities = async (req, res) => {
	console.log(colors.green("Unfinished Activities"));
	try {
		const activities = await Activities.findAll({
			where: {
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
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getRecentActivities = async (req, res) => {
	console.log(colors.green("Recent Activities"));

	try {
		const activities = await Activities.findAll({
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

		const response = activities.slice(-3).map((activity) => {
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
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getSchoolActivities = async (req, res) => {
	console.log(colors.green("School Activities"));
	const { schoolId } = req.query;

	try {
		const activities = await Activities.findAll({
			where: {
				school_id: schoolId,
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

		// check if the school exists in the database
		const school = await Schools.findOne({
			where: {
				id: schoolId,
			},
		});

		if (!school) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
			});
		}

		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: "No activities found for this school.",
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
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getFinishedSchoolActivities = async (req, res) => {
	console.log(colors.green("Finished School Activities"));
	const { schoolId } = req.query;

	try {
		const activities = await Activities.findAll({
			where: {
				school_id: schoolId,
				is_finished: true,
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

		const school = await Schools.findOne({
			where: {
				id: schoolId,
			},
		});

		if (!school) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
			});
		}

		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: "No activities finished found for this school.",
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
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getUnfinishedSchoolActivities = async (req, res) => {
	console.log(colors.green("Unfinished School Activities"));
	const { schoolId } = req.query;

	try {
		const activities = await Activities.findAll({
			where: {
				school_id: schoolId,
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

		const school = await Schools.findOne({
			where: {
				id: schoolId,
			},
		});

		if (!school) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
			});
		}

		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: "All activities are finished for this school.",
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
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getRecentSchoolActivities = async (req, res) => {
	console.log(colors.green("Recent School Activities"));
	const { schoolId } = req.query;

	try {
		const activities = await Activities.findAll({
			where: {
				school_id: schoolId,
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

		const school = await Schools.findOne({
			where: {
				id: schoolId,
			},
		});

		if (!school) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
			});
		}

		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: "No activities found for this school.",
			});
		}

		const response = activities.slice(-3).map((activity) => {
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
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getReports = async (req, res) => {
	console.log(colors.green("Reports"));
};

exports.getThemes = async (req, res) => {
	console.log(colors.green("Themes"));
	try {
		const themes = await Themes.findAll({
			where: {
				is_active: true,
			},
			attributes: ["id", "name"],
		});
		if (themes)
			return res.status(200).json({
				success: true,
				data: themes,
			});
	} catch (err) {
		console.log(colors.red(`${err.message}`));
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.addActivity = async (req, res) => {
	console.log(colors.yellow("Adding activity..."));
	// try {
	// 	// Get the last inserted activity ID
	// 	const lastActivity = await Activities.findOne({
	// 		order: [["id", "DESC"]],
	// 	});

	// 	// Create the new activity
	// 	const activity = await Activities.create(req.body);

	// 	// add blocks of code for the authentication validations
	// 	//
	// 	//

	// 	// if the body includes images add to the activity_images
	// 	if (req.body.images) {
	// 		const images = req.body.images; // array of images
	// 		// for each image in the array add the activity_id and the image to the activity_images table
	// 		images.forEach((image) => {
	// 			activity_images.create({
	// 				activity_id: activity.id,
	// 				img: image,
	// 			});
	// 		});

	// 		return res.status(201).json({
	// 			success: true,
	// 			message: "Activity added",
	// 		});
	// 	}
	// } catch (err) {
	// 	if (err instanceof ValidationError) {
	// 		if (Object.keys(req.body).length === 0) {
	// 			return res.status(400).json({
	// 				success: false,
	// 				error: "body cannot be empty",
	// 			});
	// 		}
	// 		// else check if the body includes the required fields otherwise return null errors
	// 		else {
	// 			return res.status(400).json({
	// 				success: false,
	// 				// for each error in the errors array return the error message
	// 				error: err.errors.map((error) => error.message),
	// 			});
	// 		}
	// 	}

	// 	return res.status(500).json({
	// 		success: false,
	// 		error: err.message || "Something went wrong. Please try again later.",
	// 	});
	// }
};

exports.addTheme = async (req, res) => {
	console.log(colors.green("Add Theme"));
};

exports.finishActivity = async (req, res) => {
	console.log(colors.green("Finish Activity"));
};

exports.disabledTheme = async (req, res) => {
	console.log(colors.green("Theme inactive"));
};

// for testing purposes
exports.deleteActivity = async (req, res) => {
	console.log(colors.green("Delete Activity"));

	// const { id } = req.params;

	// try {
	// 	// delete the images from the activity_images table
	// 	await activity_images.destroy({
	// 		where: {
	// 			activity_id: id,
	// 		},
	// 	});

	// 	// delete the activity
	// 	await Activities.destroy({
	// 		where: {
	// 			id: id,
	// 		},
	// 	});

	// 	return res.status(200).json({
	// 		success: true,
	// 		message: "Activity deleted",
	// 	});
	// } catch (err) {
	// 	console.log(colors.red(`${err.message}`));
	// 	return res.status(500).json({
	// 		success: false,
	// 		error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
	// 	});
	// }
};
