// TODO => include auth validations and body validations
const colors = require("colors");
const activitiesController = require("../controllers/activities.controller");

exports.validateQueries = (req, res, next) => {
	const validQueries = ["filter", "schoolId", "fields", "search"];

	const fieldsValid = ["activity", "theme", "activities", "themes", "reports"];
	const filterValid = ["finished", "unfinished", "recent"];

	const ObjectKeys = [];

	let responseSent = false; // Flag variable to track whether a response has been sent (to fix the error of headers already sent)

	Object.keys(req.query).forEach((key) => {
		ObjectKeys.push(key);
	});

	// Check if all queries are valid
	const queriesAreValid = ObjectKeys.every((key) => validQueries.includes(key));

	// Check if all queries are valid
	if (!queriesAreValid) {
		const invalidQueries = ObjectKeys.filter((key) => !validQueries.includes(key)).map(
			(key) => `${key} is a invalid parameter`
		);

		if (invalidQueries.length == 1) {
			// returns only one error without array
			responseSent = true;
			console.log(colors.red("Invalid parameter"));
			return res.status(400).json({
				success: false,
				error: invalidQueries[0],
			});
		}

		responseSent = true;
		console.log(colors.red("Invalid parameters"));
		return res.status(400).json({
			success: false,
			// return error for each invalid query
			error: invalidQueries,
		});
	}

	const emptyQueries = ObjectKeys.filter((key) => req.query[key] == "").map(
		(key) => `${key} is empty`
	);

	if (emptyQueries.length == 1) {
		// returns only one error without array
		responseSent = true;
		console.log(colors.red("Empty query"));
		return res.status(400).json({
			success: false,
			error: emptyQueries[0],
		});
	}

	if (emptyQueries.length > 1) {
		responseSent = true;
		console.log(colors.red("Empty queries"));
		return res.status(400).json({
			success: false,
			error: emptyQueries,
		});
	}

	// Check if all queries are valid
	const invalidFields = ObjectKeys.filter((key) => !fieldsValid.includes(req.query[key])).map(
		(key) => `${req.query.fields} is a invalid value for fields parameter`
	);

	// Check if all queries are valid
	if (req.query.fields && invalidFields) {
		if (invalidFields.length == 1) {
			// returns only one error without array
			responseSent = true;
			console.log(colors.red("Invalid fields value"));
			return res.status(400).json({
				success: false,
				error: invalidFields[0],
			});
		}
	}


	if (!responseSent) {
		// Call next() only if no response has been sent (if passed all validations)
		next();
	}
};

exports.foundQuery = (req, res, next) => {
	if (req.query.search) {
		return activitiesController.searchActivities(req, res);
	}
	// finished activities
	if (req.query.fields === "activities" && req.query.filter === "finished") {
		return activitiesController.getFinishedActivities(req, res);
	}
	// unfinished activities
	if (req.query.fields === "activities" && req.query.filter === "unfinished") {
		return activitiesController.getUnfinishedActivities(req, res);
	}
	// recent activities
	if (req.query.fields === "activities" && req.query.filter === "recent") {
		return activitiesController.getRecentActivities(req, res);
	}

	if (req.query.fields === "activities" && req.query.schoolId) {
		return activitiesController.getSchoolActivities(req, res);
	}
	if (req.query.fields === "activities" && req.query.filter === "finished" && req.query.schoolId) {
		return activitiesController.getFinishedSchoolActivities(req, res);
	}
	if (
		req.query.fields === "activities" &&
		req.query.filter === "unfinished" &&
		req.query.schoolId
	) {
		return activitiesController.getUnfinishedSchoolActivities(req, res);
	}
	if (req.query.fields === "activities" && req.query.filter === "recent" && req.query.schoolId) {
		return activitiesController.getRecentSchoolActivities(req, res);
	}

	if (req.query.fields === "reports") {
		return activitiesController.getReports(req, res);
	}

	if (req.query.fields === "themes") {
		return activitiesController.getThemes(req, res);
	}

	if (req.query.fields === "activity") {
		return activitiesController.addActivity(req, res);
	}
	if (req.query.fields === "theme") {
		return activitiesController.addTheme(req, res);
	}

	if (req.query.fields === "activity") {
		return activitiesController.deleteActivity(req, res);
	}
	if (req.query.fields === "theme") {
		return activitiesController.deleteTheme(req, res);
	}

	next();
};
