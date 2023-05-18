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

exports.getDetailActivity = async (req, res) => {
	console.log(colors.green("get one activity"));
	const { id } = req.params;

	try {
		const activity = await Activities.findByPk(id, {
			// get the activity theme name, the school name and the creator name  and the images of the activity in array
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

		if (activity.is_finished === true) {
			return res.status(404).json({
				success: false,
				error: `activity with id ${id} is finished`,
			});
		}

		const data = {
			id: activity.id,
			creator: {
				id: activity.creator.id,
				name: activity.creator.name,
			},
			is_finished: activity.is_finished,
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

			const username = await Users.findByPk(decoded.userId, {
				attributes: ["name"],
			});

			const role = await Roles.findByPk(decoded.roleId, {
				attributes: ["title"],
			});

			const school = await Schools.findByPk(decoded.schoolId, {
				attributes: ["name"],
			});

			// check if the activity it's from the logged user's school
			const isFromLoggedUserSchool_ = await Activities.findOne({
				where: {
					id: id,
					school_id: decoded.schoolId,
				},
			});

			// check if the role of the logged user is unsigned
			const isUnsigned = await Roles.findOne({
				where: {
					id: decoded.roleId,
					title: "unsigned",
				},
			});

			const data = {
				id: activity.id,
				creator: {
					id: activity.creator.id,
					name: activity.creator.name,
				},
				is_finished: activity.is_finished,
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

			// testing the logged user
			console.log(`loggedUser: ${username.name} - ${role.title} - ${school.name}`);
			console.log("activities with loggedUser: ", data);

			return res.status(200).json({
				success: true,
				isFromLoggedUserSchool: isFromLoggedUserSchool_ && !isUnsigned ? true : false,
				data: data,
			});
		}
	} catch (err) {
		console.log(colors.red(`${err.message}`));

		if (err.message === "jwt expired") {
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

exports.searchActivities = async (req, res) => {
	console.log(colors.green("searching activities..."));
	const { search } = req.query;
	const formatVal = search.replace(/%20/g, " ");
	console.log(formatVal);
	try {
		const activities = await Activities.findAll({
			where: {
				title: {
					[Op.like]: `%${formatVal}%`,
				},
				is_finished: false,
			},
			attributes: ["id", "title"],
		});

		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: `no activities found with title ${formatVal}`,
			});
		}

		return res.status(200).json({
			success: true,
			data: activities,
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
		// meta objective participants = description
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
					model: activity_images,
					as: "activity_images",
					attributes: ["img"],
				},
			],
			attributes: {
				exclude: ["school_id", "theme_id", "creator_id", "report"],
			},
		});

		const data = activities.map((activity) => {
			return {
				id: activity.id,
				is_finished: activity.is_finished,
				theme: activity.theme.name,
				title: activity.title,
				description: `${activity.meta} ${activity.objective} ${activity.participants}`,
				initial_date: fixDate(activity.initial_date),
				final_date: fixDate(activity.final_date),
				image: activity.activity_images[0].img, //main image
			};
		});

		// check if there's a token in the request
		let token = req.headers["x-access-token"] || req.headers.authorization;
		token = token?.replace("Bearer ", "");

		// with no loggedUser
		if (!token) {
			return res.status(200).json({
				success: true,
				data: data,
			});
		}

		// with loggedUser - for verify user and no verify user
		if (token) {
			// verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			const username = await Users.findByPk(decoded.userId, {
				attributes: ["name"],
			});

			const role = await Roles.findByPk(decoded.roleId, {
				attributes: ["title"],
			});

			const school = await Schools.findByPk(decoded.schoolId, {
				attributes: ["name"],
			});

			// check each activity if it's from the logged user's school
			const isFromLoggedUserSchool_ = await Activities.findOne({
				where: {
					id: { [Op.in]: activities.map((activity) => activity.id) },
					school_id: decoded.schoolId,
				},
			});

			// check if the role of the logged user is unsigned
			const isUnsigned = await Roles.findOne({
				where: {
					id: decoded.roleId,
					title: "unsigned",
				},
			});

			const data = activities.map((activity) => {
				return {
					isFromLoggedUserSchool: isFromLoggedUserSchool_ && !isUnsigned ? true : false,
					id: activity.id,
					is_finished: activity.is_finished,
					theme: activity.theme.name,
					title: activity.title,
					description: `${activity.meta} ${activity.objective} ${activity.participants}`,
					initial_date: fixDate(activity.initial_date),
					final_date: fixDate(activity.final_date),
					image: activity.activity_images[0].img, //main image
				};
			});

			// testing the logged user
			console.log(`loggedUser: ${username.name} - ${role.title} - ${school.name}`);
			console.log("activities with loggedUser: ", data);
			res.status(200).json({
				success: true,
				data: data,
			});
		}
	} catch (err) {
		console.log(colors.red(`${err.message}`));

		if (err.message === "jwt expired") {
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
					model: activity_images,
					as: "activity_images",
					attributes: ["img"],
				},
			],
			attributes: {
				exclude: ["school_id", "theme_id", "creator_id", "report"],
			},
		});

		const data = activities.slice(-3).map((activity) => {
			return {
				id: activity.id,
				is_finished: activity.is_finished,
				theme: activity.theme.name,
				title: activity.title,
				description: `${activity.meta} ${activity.objective} ${activity.participants}`,
				initial_date: fixDate(activity.initial_date),
				final_date: fixDate(activity.final_date),
				images: activity.activity_images[0].img,
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

			const username = await Users.findByPk(decoded.userId, {
				attributes: ["name"],
			});

			const role = await Roles.findByPk(decoded.roleId, {
				attributes: ["title"],
			});

			const school = await Schools.findByPk(decoded.schoolId, {
				attributes: ["name"],
			});

			// check each activity if it's from the logged user's school
			const isFromLoggedUserSchool_ = await Activities.findOne({
				where: {
					id: { [Op.in]: activities.map((activity) => activity.id) },
					school_id: decoded.schoolId,
				},
			});

			// check if the role of the logged user is unsigned
			const isUnsigned = await Roles.findOne({
				where: {
					id: decoded.roleId,
					title: "unsigned",
				},
			});

			const data = activities.map((activity) => {
				return {
					isFromLoggedUserSchool: isFromLoggedUserSchool_ && !isUnsigned ? true : false,
					id: activity.id,
					is_finished: activity.is_finished,
					theme: activity.theme.name,
					title: activity.title,
					description: `${activity.meta} ${activity.objective} ${activity.participants}`,
					initial_date: fixDate(activity.initial_date),
					final_date: fixDate(activity.final_date),
					image: activity.activity_images[0].img, //main image
				};
			});

			// testing the logged user
			console.log(`loggedUser: ${username.name} - ${role.title} - ${school.name}`);
			console.log("activities with loggedUser: ", data);
			res.status(200).json({
				success: true,
				data: data,
			});
		}
	} catch (err) {
		console.log(colors.red(`${err.message}`));

		if (err.message === "jwt expired") {
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

exports.getFinishedSchoolActivities = async (req, res) => {
	console.log(colors.green("Finished School Activities"));

	const { school } = req.query;

	const format =
		school.charAt(0).toUpperCase() + school.slice(1).toLowerCase() || //to allow to lower case
		school.toUpperCase() ||
		school.toLowerCase();

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
					where: {
						name: school || format,
					},
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

		// Filtered activities based on school name
		const filteredActivities = activities.filter(
			(activity) => activity.school.name === school || format
		);

		const data = filteredActivities.map((activity) => {
			return {
				id: activity.id,
				is_finished: activity.is_finished,
				theme: activity.theme.name,
				title: activity.title,
				initial_date: fixDate(activity.initial_date),
				final_date: fixDate(activity.final_date),
				image: activity.activity_images.map((image) => image.img),
				participants: activity.participants,
				diagnostic: activity.diagnostic,
				objective: activity.objective,
				meta: activity.meta,
				resources: activity.resources,
				evaluation_indicator: activity.evaluation_indicator,
				evaluation_method: activity.evaluation_method,
			};
		});

		// check if the school exists
		const schoolExists = await Schools.findOne({
			where: {
				name: school || format,
			},
		});

		if (!schoolExists) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
			});
		}

		if (data.length === 0) {
			return res.status(404).json({
				success: false,
				error: "No activities finished found for this school.",
			});
		}

			return res.status(200).json({
				success: true,
				data: data,
			});
		
	} catch (err) {

		if (err.message === "jwt expired") {
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

exports.getUnfinishedSchoolActivities = async (req, res) => {
	console.log(colors.green("Unfinished School Activities"));

	// TODO => USE THE ID TO FIND THE SCHOOL AND THEN USE THE SCHOOL NAME TO FIND THE ACTIVITIES

	const { school } = req.query;

	const format =
		school.charAt(0).toUpperCase() + school.slice(1).toLowerCase() || //to allow to lower case
		school.toUpperCase() ||
		school.toLowerCase();

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
					where: {
						name: school || format,
					},
					attributes: ["name"],
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

		// Filtered activities based on school name
		const filteredActivities = activities.filter(
			(activity) => activity.school.name === school || format
		);

		const data = filteredActivities.map((activity) => {
			return {
				id: activity.id,
				is_finished: activity.is_finished,
				theme: activity.theme.name,
				title: activity.title,
				description: `${activity.meta} ${activity.objective} ${activity.participants}`,
				initial_date: fixDate(activity.initial_date),
				final_date: fixDate(activity.final_date),
				image: activity.activity_images[0].img, //main image
			};
		});

		// check if the school exists
		const schoolExists = await Schools.findOne({
			where: {
				name: school || format,
			},
		});

		if (!schoolExists) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
			});
		}

		if (data.length === 0) {
			return res.status(404).json({
				success: false,
				error: "No activities found for this school.",
			});
		}

		// check if there's a token in the request
		let token = req.headers["x-access-token"] || req.headers.authorization;
		token = token?.replace("Bearer ", "");

		// with no loggedUser
		if (!token) {
			console.log("activities with no loggedUser: ", data);
			return res.status(200).json({
				success: true,
				data: data,
			});
		}

		// with loggedUser - for verify user and no verify user
		if (token) {
			// verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			const username = await Users.findByPk(decoded.userId, {
				attributes: ["name"],
			});

			const role = await Roles.findByPk(decoded.roleId, {
				attributes: ["title"],
			});

			const school = await Schools.findByPk(decoded.schoolId, {
				attributes: ["name"],
			});

			// check each activity if it's from the logged user's school
			const isFromLoggedUserSchool_ = await Activities.findOne({
				where: {
					id: { [Op.in]: activities.map((activity) => activity.id) },
					school_id: decoded.schoolId,
				},
			});

			// check if the role of the logged user is unsigned
			const isUnsigned = await Roles.findOne({
				where: {
					id: decoded.roleId,
					title: "unsigned",
				},
			});

			// return the data above by setting the isFromLoggedUserSchool_ key
			const activities_ = data.map((activity) => {
				return {
					isFromLoggedUserSchool: isFromLoggedUserSchool_ && !isUnsigned ? true : false,
					id: activity.id,
					is_finished: activity.is_finished,
					theme: activity.theme,
					title: activity.title,
					description: activity.description,
					initial_date: activity.initial_date,
					final_date: activity.final_date,
					image: activity.image,
				};
			});

			console.log(`loggedUser: ${username.name} - ${role.title} - ${school.name}`);
			console.log("activities with loggedUser: ", activities_);
			res.status(200).json({
				success: true,
				data: activities_,
			});
		}
	} catch (err) {
		console.log(colors.red(`${err.message}`));

		if (err.message === "jwt expired") {
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
