// TODO => include auth validations and body validations
const colors = require("colors");
const activitiesController = require("../controllers/activities.controller");

exports.validateQueries = (req, res, next) => {
	const validQueries = ["filter", "schoolId", "fields", "search"];

	const fieldsValid = ["activity", "theme", "activities", "themes", "reports"];
	const filterValid = ["finished", "unfinished", "recent"];

	const ObjectKeys = [];

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
			console.log(colors.red("Invalid parameter"));
			return res.status(400).json({
				success: false,
				error: invalidQueries[0],
			});
		}

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
		console.log(colors.red("Empty query"));
		return res.status(400).json({
			success: false,
			error: emptyQueries[0],
		});;
	}

	if (emptyQueries.length > 1) {
		console.log(colors.red("Empty queries"));
		return res.status(400).json({
			success: false,
			error: emptyQueries,
		});
	}

	// Check if fields parameter is valid
	const invalidFields = Object.keys(req.query)
		.filter((key) => key === "fields" && !fieldsValid.includes(req.query[key]))
		.map((key) => `${req.query.fields} is an invalid value for the fields parameter`);

	// Check if filter parameter is valid
	const invalidFilter = Object.keys(req.query)
		.filter((key) => key === "filter" && !filterValid.includes(req.query[key]))
		.map((key) => `${req.query.filter} is an invalid value for the filter parameter`);

	// Check if schoolId parameter is valid
	const invalidSchoolId = Object.keys(req.query)
		.filter((key) => key === "schoolId" && isNaN(req.query[key]))
		.map((key) => `${req.query.schoolId} is an invalid value for the schoolId parameter`);

	// Combine all invalid parameters
	const allInvalidParams = [...invalidFields, ...invalidFilter, ...invalidSchoolId];

	// Return all possible errors as an array
	if (allInvalidParams.length > 1) {
		console.log(colors.red("Invalid parameters"));
		return res.status(400).json({
			success: false,
			error: allInvalidParams,
		});
	}

	if (allInvalidParams.length == 1) {
		console.log(colors.red("Invalid parameter"));
		return res.status(400).json({
			success: false,
			error: allInvalidParams[0],
		});
	}

	// if fields is valid with activities but is missing schoolId or filter parameter
	if (
		req.method === "GET" &&
		req.query.fields === "activities" &&
		!req.query.schoolId &&
		!req.query.filter
	) {
		console.log(colors.red("Missing schoolId or filter parameter"));
		return res.status(400).json({
			success: false,
			error: "Missing parameters filter or schoolId",
		});
	}

	// accept only themes and activities for the fields parameter
	if (
		req.method === "GET" &&
		req.query.fields &&
		req.query.fields !== "activities" &&
		req.query.fields !== "themes"
	) {
		console.log(ObjectKeys);
		console.log(
			colors.red(
				"Invalid fields value : accept only themes and activities for the fields parameter"
			)
		);
		return res.status(400).json({
			success: false,
			error: `${req.query.fields} is a invalid value for the fields parameter`,
		});
	}


	// accept only theme and activity for the fields parameter in the POST PATCH DELETE
	if(
		(req.method === "POST" || req.method === "PATCH" || req.method === "DELETE") &&
		req.query.fields &&
		req.query.fields !== "activity" &&
		req.query.fields !== "theme"
	) {
		console.log(ObjectKeys);
		console.log(
			colors.red(
				"Invalid fields value : accept only theme and activity for the fields parameter"
	)
		);
		return res.status(400).json({
			success: false,
			error: `${req.query.fields} is a invalid value for the fields parameter`,
		});
	}

	if (
		req.method === "GET" &&
		req.query.fields &&
		req.query.schoolId &&
		req.query.filter &&
		Object.keys(req.query).indexOf("filter") > Object.keys(req.query).indexOf("schoolId")
	) {
		console.log(colors.red("Invalid query"));
		return res.status(400).json({
			success: false,
			error: "filter parameter is only allowed before schoolId parameter",
		});
	}

		// Call next() only if no response has been sent (if passed all validations)
		next();
	
};

exports.foundQuery = (req, res, next) => {
	if (req.method === "GET" && req.query.search) {
		return activitiesController.searchActivities(req, res);
	}

	if (req.method === "GET" && req.query.fields === "activities" && req.query.schoolId) {
		if (req.query.filter === "finished") {
			return activitiesController.getFinishedSchoolActivities(req, res);
		}
		if (req.query.filter === "unfinished") {
			return activitiesController.getUnfinishedSchoolActivities(req, res);
		}
		if (req.query.filter === "recent") {
			return activitiesController.getRecentSchoolActivities(req, res);
		}
		return activitiesController.getSchoolActivities(req, res);
	}

	if (
		req.method === "GET" &&
		req.query.fields === "activities" &&
		req.query.filter === "finished"
	) {
		return activitiesController.getFinishedActivities(req, res);
	}

	if (
		req.method === "GET" &&
		req.query.fields === "activities" &&
		req.query.filter === "unfinished"
	) {
		return activitiesController.getUnfinishedActivities(req, res);
	}

	if (req.method === "GET" && req.query.fields === "activities" && req.query.filter === "recent") {
		return activitiesController.getRecentActivities(req, res);
	}

	if (req.method === "GET" && req.query.fields === "reports") {
		return activitiesController.getReports(req, res);
	}
	if (req.method === "GET" && req.query.fields === "themes") {
		return activitiesController.getThemes(req, res);
	}
	if (req.method === "POST" && req.query.fields === "activity") {
		return activitiesController.addActivity(req, res);
	}
	if (req.method === "POST" && req.query.fields === "theme") {
		return activitiesController.addTheme(req, res);
	}

	if(req.method === "PATCH" && req.query.fields === "activity") {
		return activitiesController.finishActivity(req, res);
	}

	if (req.method === "PATCH" && req.query.fields === "theme") {
		return activitiesController.disabledTheme(req, res);
	}

	if (req.query.fields === "activity" && req.method === "DELETE") {
		return activitiesController.deleteActivity(req, res);
	}
	if (req.query.fields === "theme" && req.method === "DELETE") {
		return activitiesController.deleteTheme(req, res);
	}
	next();
};
