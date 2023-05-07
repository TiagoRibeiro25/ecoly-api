const db = require("../models/db");
const colors = require("colors");
const { Op, ValidationError } = require("sequelize");
const Activities = db.activities;
const activity_images = db.activity_image;
const Users = db.users;
const Schools = db.schools;
const Themes = db.theme;
const badges = db.badges; //for the unlocked badges
const userBadges = db.user_badge; //for the unlocked badges

function fixDate(date) {
	const Date = date.toISOString().split("T")[0];

	const reverseDate = Date.split("-").reverse().join("-");

	return reverseDate;
}


// TODO => add Authentication (Token auth_key) when creating activities
// TODO => add 401 Unauthorized error when creating activities with invalid auth_key
// TODO => add 403 Forbidden error without auth_key
// TODO => read auth_key for authentication => checking each user is creating the activity (creator_id, school_id)

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
		console.log(colors.red(`${err.message}`));
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
				// is_finished: activity.is_finished,
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

		console.log(response);


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
				// is_finished: activity.is_finished,
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

		console.log(response);

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

		console.log(response);

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

		// not found school
		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
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

		console.log(response);

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

		// not found school
		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
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

		console.log(response);

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

		// not found school
		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
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

		console.log(response);

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

		// not found school
		if (activities.length === 0) {
			return res.status(404).json({
				success: false,
				error: "School not found.",
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

		console.log(response.slice(0, 3));

		return res.status(200).json({
			success: true,
			data: response.slice(0, 3),
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
};

exports.addActivity = async (req, res) => {
	console.log(colors.yellow("Adding activity..."));
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

exports.addTheme = async (req, res) => {
	console.log(colors.green("Add Theme"));
};

exports.finishActivity = async (req, res) => {
	console.log(colors.green("Finish Activity"));
};

exports.deleteActivity = async (req, res) => {
	console.log(colors.green("Delete Activity"));
};

exports.deleteTheme = async (req, res) => {
	console.log(colors.green("Delete Theme"));
};
