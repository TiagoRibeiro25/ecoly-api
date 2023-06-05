const db = require("../models/db");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary.config");
const colors = require("colors");
const { Op } = require("sequelize");
const Activities = db.activities;
const activity_images = db.activity_image;
const activity_report_images = db.activity_report_image;
const Users = db.users;
const Schools = db.schools;
const Roles = db.role;
const Themes = db.theme;
const unlockBadge = require("../utils/unlockBadge");
const addSeeds = require("../utils/addSeeds");

function fixDate(date) {
	const Date = date.toISOString().split("T")[0];

	const reverseDate = Date.split("-").reverse().join("-");

	return reverseDate;
}

exports.getDetailActivity = async (req, res) => {
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
			return res.status(200).json({
				success: true,
				canUserEdit: false,
				data: data,
			});
		}

		// with loggedUser
		if (token) {
			// verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// check if the activity it's from the logged user's school
			const isFromUserSchool_ = await Activities.findOne({
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

			// if the user logged is not unsigned set to true the isUserVerified variable
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

			return res.status(200).json({
				success: true,
				isUserVerified: !isUnsigned ? true : false,
				canUserEdit: isFromUserSchool_ && !isUnsigned ? true : false,
				data: data,
			});
		}
	} catch (err) {
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
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
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getUnfinishedActivities = async (req, res) => {
	try {
		const activities = await Activities.findAll({
			where: {
				is_finished: false,
			},
			order: [["initial_date", "ASC"]],
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

		// check if there's a token in the request
		let token = req.headers["x-access-token"] || req.headers.authorization;
		token = token?.replace("Bearer ", "");

		// with no loggedUser
		if (!token) {
			const data = activities.map((activity) => {
				return {
					canUserEdit: false,
					id: activity.id,
					is_finished: activity.is_finished,
					theme: activity.theme.name,
					title: activity.title,
					description: `${activity.meta}\n${activity.objective}\n${activity.participants}`,
					initial_date: fixDate(activity.initial_date),
					final_date: fixDate(activity.final_date),
					image: activity.activity_images[0].img, //main image
				};
			});

			return res.status(200).json({
				success: true,
				data: data,
			});
		}

		// with loggedUser - for verify user and no verify user
		if (token) {
			// verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// check each activity if it's from the logged user's school
			const isFromUserSchool = await Activities.findAll({
				where: {
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
				const canUserEdit = isFromUserSchool.some((a) => a.id === activity.id);

				return {
					canUserEdit: canUserEdit && !isUnsigned ? true : false,
					id: activity.id,
					is_finished: activity.is_finished,
					theme: activity.theme.name,
					title: activity.title,
					description: `${activity.meta}\n${activity.objective}\n${activity.participants}`,
					initial_date: fixDate(activity.initial_date),
					final_date: fixDate(activity.final_date),
					image: activity.activity_images[0].img, //main image
				};
			});

			res.status(200).json({
				success: true,
				isUserVerified: !isUnsigned ? true : false,
				data: data,
			});
		}
	} catch (err) {
		console.log(colors.red(err.message));
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getRecentActivities = async (req, res) => {
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
				initial_date: fixDate(activity.initial_date),
				final_date: fixDate(activity.final_date),
				images: activity.activity_images[0].img,
			};
		});

		return res.status(200).json({
			success: true,
			data: data,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getFinishedSchoolActivities = async (req, res) => {
	try {
		const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

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

		const filteredActivities = activities.filter((activity) => {
			return activity.school.name === schoolUser.name;
		});

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

		// if there are no activities finished for the logged user school
		if (data.length === 0) {
			throw new Error("No activities finished yet.");
		}

		return res.status(200).json({
			success: true,
			data: data,
		});
	} catch (err) {
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}
		if (err.message === "No activities finished yet.") {
			return res.status(404).json({
				success: false,
				error: "No activities finished yet.",
			});
		}

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getFinishedSchoolActivitiesByYear = async (req, res) => {
	const { year } = req.query;

	try {
		const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

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

		const filteredActivities = activities.filter((activity) => {
			return activity.school.name === schoolUser.name;
		});

		const filteredActivitiesByYear = filteredActivities.filter((activity) => {
			return activity.final_date.getFullYear() === parseInt(year);
		});

		const data = filteredActivitiesByYear.map((activity) => {
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

		if (isNaN(year)) {
			throw new Error("Year must be a number.");
		}

		//

		// if there are no activities finished for the logged user school
		if (data.length === 0) {
			throw new Error("No activities found.");
		}

		return res.status(200).json({
			success: true,
			data: data,
		});
	} catch (err) {
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		if (err.message === "Year must be a number.") {
			return res.status(400).json({
				success: false,
				error: "Year must be a number.",
			});
		}

		if (err.message === "invalid year.") {
			return res.status(400).json({
				success: false,
				error: "Invalid year.",
			});
		}

		if (err.message === "No activities found.") {
			return res.status(404).json({
				success: false,
				error: "No activities found.",
			});
		}

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getUnfinishedSchoolActivities = async (req, res) => {
	let { school } = req.query;

	school = school.toUpperCase();

	try {
		const activities = await Activities.findAll({
			where: {
				is_finished: false,
			},
			order: [["initial_date", "ASC"]],
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
						name: school,
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
		const filteredActivities = activities.filter((activity) => activity.school.name === school);

		const data = filteredActivities.map((activity) => {
			return {
				canUserEdit: false,
				id: activity.id,
				is_finished: activity.is_finished,
				theme: activity.theme.name,
				title: activity.title,
				description: `${activity.meta}\n${activity.objective}\n${activity.participants}`,
				initial_date: fixDate(activity.initial_date),
				final_date: fixDate(activity.final_date),
				image: activity.activity_images[0].img, //main image
			};
		});

		// check if the school exists
		const schoolExists = await Schools.findOne({
			where: {
				name: school,
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
			return res.status(200).json({
				success: true,
				data: data,
			});
		}

		if (token) {
			// verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// check each activity if it's from the logged user's school
			const isFromUserSchool_ = await Activities.findOne({
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
					canUserEdit: isFromUserSchool_ && !isUnsigned ? true : false,
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

			res.status(200).json({
				success: true,
				isUserVerified: !isUnsigned ? true : false,
				data: activities_,
			});
		}
	} catch (err) {
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getReport = async (req, res) => {
	const { id } = req.params;

	const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

	try {
		const activity = await Activities.findByPk(id, {
			where: {
				is_finished: true,
			},
			include: [
				{
					model: activity_report_images,
					as: "activity_report_images",
					attributes: ["img"],
				},
				{
					model: Schools,
					as: "school",
					where: {
						name: schoolUser.name,
					},
					attributes: ["name"],
				},
			],
			attributes: ["id", "report"],
		});

		if (isNaN(id)) {
			return res.status(400).json({
				success: false,
				error: "Invalid id",
			});
		}

		if (!activity) {
			return res.status(404).json({
				success: false,
				error: "Activity not found.",
			});
		}

		if (activity.report === null) {
			return res.status(404).json({
				success: false,
				error: "Activity is not finished yet.",
			});
		}

		const data = {
			id: activity.id,
			report: activity.report,
			images: activity.activity_report_images.map((image) => image.img),
		};

		return res.status(200).json({
			success: true,
			data: data,
		});
	} catch (err) {
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.getThemes = async (req, res) => {
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
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		return res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.addActivity = async (req, res) => {
	const {
		title,
		diagnostic,
		objective,
		participants,
		meta,
		evaluation_indicator,
		resources,
		evaluation_method,
		complexity,
		initial_date,
		final_date,
		theme_id,
		images,
	} = req.body;

	try {
		const existingActivity = await Activities.findOne({
			where: {
				title: title,
			},
		});

		const existingTheme = await Themes.findByPk(theme_id);

		const validTheme = await Themes.findOne({
			where: {
				id: theme_id,
				is_active: true,
			},
		});

		const creator = await Users.findByPk(req.tokenData.userId);
		const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

		if (title && existingActivity) {
			throw new Error("Activity already exists");
		}

		if (theme_id && !existingTheme) {
			throw new Error("Theme not found");
		}

		if (theme_id && !validTheme) {
			throw new Error("Theme is not active");
		}

		const activity = await Activities.create({
			creator_id: creator.id, // user
			school_id: schoolUser.id, // user school
			title: title,
			diagnostic: diagnostic,
			objective: objective,
			participants: participants,
			meta: meta,
			evaluation_indicator: evaluation_indicator,
			resources: resources,
			evaluation_method: evaluation_method,
			complexity: complexity,
			initial_date: initial_date,
			final_date: final_date,
			theme_id: theme_id,
		});

		// if the body includes images add to the activity_images model
		if (req.body.images && images.length > 0) {
			const images = req.body.images;

			for (let i = 0; i < images.length; i++) {
				const response = await cloudinary.uploader.upload(images[i], {
					folder: "activities",
					crop: "scale",
				});

				await activity_images.create({
					activity_id: activity.id,
					img: response.secure_url,
				});
			}
		}

		// count the number of activities created by the user
		const activitiesCount = await Activities.count({
			where: {
				creator_id: creator.id,
			},
		});

		if (activitiesCount === 1) {
			await unlockBadge({ badgeId: 1, userId: creator.id });
		}

		if (activitiesCount === 10) {
			await unlockBadge({ badgeId: 2, userId: creator.id });
		}

		if (activity) {
			addSeeds({ userId: creator.id, amount: 40 });
		}

		return res.status(201).json({
			success: true,
			message: `activity created ${activity.id}`,
		});
	} catch (err) {
		if (err.message === "Activity already exists") {
			return res.status(409).json({
				success: false,
				error: "Activity already exists",
			});
		}

		if (err.message === "Theme is not active") {
			return res.status(409).json({
				success: false,
				error: "Theme is not active",
			});
		}

		if (err.message === "Theme not found") {
			return res.status(404).json({
				success: false,
				error: "theme not found",
			});
		}

		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.addTheme = async (req, res) => {
	const { name } = req.body;

	try {
		const Theme = await Themes.findOne({
			where: {
				name: name,
			},
		});

		const activeThemes = await Themes.findOne({
			where: {
				name: name,
				is_active: true,
			},
		});

		if (name && activeThemes) {
			throw new Error("Theme already exists");
		}

		const creator = await Users.findByPk(req.tokenData.userId);

		if (!Theme) {
			await Themes.create({
				name: name,
			});

			addSeeds({ userId: creator.id, amount: 40 });

			return res.status(201).json({
				success: true,
				data: `theme created successfully`,
			});
		}

		if (Theme.is_active === false) {
			await Themes.update(
				{ is_active: true },
				{
					where: {
						name: name,
					},
				}
			);

			addSeeds({ userId: creator.id, amount: 40 });

			return res.status(200).json({
				success: true,
				data: `theme added successfully`,
			});
		}
	} catch (err) {
		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		if (err.message === "Theme already exists") {
			return res.status(409).json({
				success: false,
				error: "Theme already exists",
			});
		}
		res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.finishActivity = async (req, res) => {
	const { id } = req.params;
	const { images, report } = req.body;
	try {
		const activity = await Activities.findByPk(id);
		const creator = await Users.findByPk(req.tokenData.userId);
		const schoolUser = await Schools.findByPk(req.tokenData.schoolId);

		if (isNaN(id)) {
			throw new Error("invalid id");
		}

		// check if the activity exists
		if (!activity) {
			throw new Error("Activity not found");
		}
		// check if the activity is already finished
		if (activity.is_finished === true) {
			throw new Error("Activity is already finished");
		}

		// check if the activity is from the user school
		if (activity.school_id !== schoolUser.id) {
			throw new Error("Activity is not from your school");

			// if the activity is from the user school finish the activity
		} else if (activity.school_id === schoolUser.id) {
			// update the activity to finished and add the report from the body
			await Activities.update(
				{
					is_finished: true,
					report: report,
				},
				{
					where: {
						id: id,
					},
				}
			);

			// if the body includes images add to the activity report_images model
			if (req.body.images && images.length > 0) {
				const images = req.body.images; // array of images

				for (let i = 0; i < images.length; i++) {
					const response = await cloudinary.uploader.upload(images[i], {
						folder: "reports",
						crop: "scale",
					});

					await activity_report_images.create({
						activity_id: activity.id,
						img: response.secure_url,
					});
				}
			}

			// Unlock the badge if the activity is finished on the last day
			const currentDate = new Date().toISOString().slice(0, 10);

			// Convert the activity's final date to the same format as currentDate
			const activityFinalDate = new Date(activity.final_date).toISOString().slice(0, 10);

			// Check if the current date is the same as the final date of the activity
			if (currentDate === activityFinalDate) {
				unlockBadge({ badgeId: 3, userId: creator.id });
			}

			await addSeeds({ userId: creator.id, amount: 40 });

			return res.status(200).json({
				success: true,
				message: `activity finished with success ${activity.id}`,
			});
		}
	} catch (err) {
		if (err.message === "invalid id") {
			return res.status(400).json({
				success: false,
				error: "invalid id",
			});
		}

		if (err.message === "Activity not found") {
			return res.status(404).json({
				success: false,
				error: "Activity not found",
			});
		}
		if (err.message === "Activity is already finished") {
			return res.status(409).json({
				success: false,
				error: "Activity is already finished",
			});
		}
		if (err.message === "Activity is not from your school") {
			return res.status(409).json({
				success: false,
				error: "Activity is not from your school",
			});
		}

		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.disabledTheme = async (req, res) => {
	const { id } = req.params;
	try {
		const theme = await Themes.findByPk(id);

		if (!theme) {
			throw new Error("Theme not found");
		}

		if (isNaN(id)) {
			throw new Error("invalid id");
		}

		if (theme.is_active === false) {
			throw new Error("Theme is already disabled");
		}

		// if there is token
		await Themes.update(
			{
				is_active: false,
			},
			{
				where: {
					id: id,
				},
			}
		);

		return res.status(200).json({
			success: true,
			message: `the theme ${theme.name} is now disabled`,
		});
	} catch (err) {
		if (err.message === "invalid id") {
			return res.status(400).json({
				success: false,
				error: "invalid id",
			});
		}

		if (err.message === "Theme not found") {
			return res.status(404).json({
				success: false,
				error: "Theme not found",
			});
		}
		if (err.message === "Theme is already disabled") {
			return res.status(409).json({
				success: false,
				error: "Theme is already disabled",
			});
		}

		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		res.status(500).json({
			success: false,
			error: "We apologize, but our system is currently experiencing some issues. Please try again later.",
		});
	}
};

exports.deleteActivity = async (req, res) => {
	const { id } = req.params;

	try {
		const activity = await Activities.findByPk(id);

		if (isNaN(id)) {
			throw new Error("invalid id");
		}

		if (!activity) {
			throw new Error("Activity not found");
		}

		if (activity.is_finished === true) {
			throw new Error("you can´t delete a finished activity");
		}

		// delete the activity images
		await activity_images.destroy({
			where: {
				activity_id: id,
			},
		});

		await Activities.destroy({
			where: {
				id: id,
			},
		});

		return res.status(200).json({
			success: true,
			message: `activity deleted successfully`,
		});
	} catch (err) {
		if (err.message === "invalid id") {
			return res.status(400).json({
				success: false,
				error: "invalid id",
			});
		}

		if (err.message === "jwt expired") {
			return res.status(401).json({
				success: false,
				error: "Your session has expired. Please generate other token.",
			});
		}

		if (err.message === "Activity not found") {
			return res.status(404).json({
				success: false,
				error: "Activity not found",
			});
		}
		if (err.message === "you can´t delete a finished activity") {
			return res.status(409).json({
				success: false,
				error: "you can´t delete a finished activity",
			});
		}
	}
};
