// TODO => include auth validations and body validations
const colors = require("colors");
const activitiesController = require("../controllers/activities.controller");

exports.validateQueries = (req, res, next) => {
	const validQueries = ["filter", "schoolId", "fields", "search"];

	const fieldsValid = ["activity", "theme", "activities", "themes", "reports"];
	const filterValid = ["finished", "unfinished", "recent"];
	const schoolIdValid = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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

	// Check if fields parameter is valid
	const invalidFields = ObjectKeys.filter(
		(key) => key === "fields" && !fieldsValid.includes(req.query[key])
	).map((key) => `${req.query.fields} is a invalid value for the fields parameter`);

	// if (invalidFields.length > 0) {
	// 	// returns only one error without array
	// 	responseSent = true;
	// 	console.log(colors.red("Invalid fields value"));
	// 	return res.status(400).json({
	// 		success: false,
	// 		error: invalidFields[0],
	// 	});
	// }

	// Check if filter parameter is valid
	const invalidFilter = ObjectKeys.filter(
		(key) => key === "filter" && !filterValid.includes(req.query[key])
	).map((key) => `${req.query.filter} is a invalid value for the filter parameter`);

	if (invalidFilter.length > 0) {
		// returns only one error without array
		responseSent = true;
		console.log(colors.red("Invalid filter value"));
		return res.status(400).json({
			success: false,
			error: invalidFilter[0],
		});
	}

	const invalidSchoolId = ObjectKeys.filter(
		(key) => key === "schoolId" && !schoolIdValid.includes(parseInt(req.query[key]))
	).map((key) => `${req.query.schoolId} is a invalid value for the schoolId parameter`);

	if (invalidSchoolId.length > 0) {
		responseSent = true;
		console.log(colors.red("Invalid schoolId value"));
		return res.status(400).json({
			success: false,
			error: invalidSchoolId[0],
		});
	}

	// if fields is valid with activities but is missing schoolId or filter parameter
	if (
		req.method === "GET" &&
		req.query.fields === "activities" &&
		!req.query.schoolId &&
		!req.query.filter
	) {
		responseSent = true;
		console.log(colors.red("Missing schoolId or filter parameter"));
		return res.status(400).json({
			success: false,
			error: "Missing parameters filter or schoolId",
		});
	}

	if (
		req.method === "GET" &&
		req.query.fields === "activities" &&
		req.query.schoolId &&
		ObjectKeys.length > 2
	) {
		console.log(Object.keys(req.query));
		responseSent = true;
		console.log(
			colors.red("you can´t use more queries when fields is activities and schoolId is present")
		);
		return res.status(400).json({
			success: false,
			error: "you can´t use more queries when fields is activities and schoolId is present",
		});
	}

	// // accept only themes and activities for the fields parameter
	// if (req.query.fields && req.query.fields !== "activities" && req.query.fields !== "themes") {
	// 	console.log(ObjectKeys);
	// 	responseSent = true;
	// 	console.log(
	// 		colors.red(
	// 			"Invalid fields value : accept only themes and activities for the fields parameter"
	// 		)
	// 	);
	// 	return res.status(400).json({
	// 		success: false,
	// 		error: `${req.query.fields} is a invalid value for the fields parameter`,
	// 	});
	// }


	// check if are repeated queries in the request
	const repeatedQueries = ObjectKeys.filter((key) => ObjectKeys.includes(key)).map(
		(key) => `${key} is repeated`
	);

	if (repeatedQueries.length > 0) {
		// returns only one error without array
		responseSent = true;
		console.log(colors.red("Repeated queries"));
		return res.status(400).json({
			success: false,
			error: repeatedQueries[0],
		});
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

	if (req.query.fields === "activities" && req.query.schoolId) {
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

	if (req.query.fields === "activities" && req.query.filter === "finished") {
		return activitiesController.getFinishedActivities(req, res);
	}

	if (req.query.fields === "activities" && req.query.filter === "unfinished") {
		return activitiesController.getUnfinishedActivities(req, res);
	}

	if (req.query.fields === "activities" && req.query.filter === "recent") {
		return activitiesController.getRecentActivities(req, res);
	}

	if (req.query.fields === "reports") {
		return activitiesController.getReports(req, res);
	}
	if (req.query.fields === "themes") {
		return activitiesController.getThemes(req, res);
	}
	if (req.method === "POST" && req.query.fields === "activity") {
		return activitiesController.addActivity(req, res);
	}
	if (req.method === "POST" && req.query.fields === "theme") {
		return activitiesController.addTheme(req, res);
	}
	if (req.query.fields === "activity" && req.method === "DELETE") {
		return activitiesController.deleteActivity(req, res);
	}
	if (req.query.fields === "theme" && req.method === "DELETE") {
		return activitiesController.deleteTheme(req, res);
	}
	next();
};