const colors = require("colors");

exports.validateQueries = (req, res, next) => {
	const validQueries = ["filter", "school", "fields", "search"];

	const fieldsValid = ["activity", "theme", "activities", "themes", "report"];
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
		});
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

	// Combine all invalid parameters
	const allInvalidParams = [...invalidFields, ...invalidFilter];

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
		!req.query.school &&
		!req.query.filter
	) {
		console.log(colors.red("Missing school or filter parameter"));
		return res.status(400).json({
			success: false,
			error: "Missing parameters filter or school",
		});
	}

	// accept only themes and activities for the fields parameter
	if (
		req.method === "GET" &&
		req.query.fields &&
		req.query.fields !== "activities" &&
		req.query.fields !== "themes" &&
		req.query.fields !== "report"
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
	if (
		(req.method === "POST" || req.method === "PATCH") &&
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
		req.query.school &&
		req.query.filter &&
		Object.keys(req.query).indexOf("filter") > Object.keys(req.query).indexOf("school")
	) {
		console.log(colors.red("Invalid query"));
		return res.status(400).json({
			success: false,
			error: "filter parameter is only allowed before school parameter",
		});
	}
	next();
};

// create activity
exports.validateBodyActivity = (req, res, next) => {
	// check with the activities model the null fields and if the body has the same fields
	const validFields = [
		"theme",
		"title",
		"complexity",
		"initial_date",
		"final_date",
		"objective",
		"diagnostic",
		"meta",
		"resources",
		"participants",
		"evaluation_indicator",
		"evaluation_method",
	];

	const invalidFields = Object.keys(req.body)
		.filter((key) => !validFields.includes(key))
		.map((key) => `${key} is a invalid field`);

	const emptyFields = Object.keys(req.body).filter((key) => req.body[key] == "").map((key) => `${key} is empty`);

		if (Object.keys(req.body).length === 0) {
			res.status(400).json({
				success: false,
				error: "body is empty",
			});
		}
	
		if (invalidFields.length > 0) {
			res.status(400).json({
				success: false,
				error: invalidFields,
			});
		}

		if (emptyFields.length > 0) {
			res.status(400).json({
				success: false,
				error: emptyFields,
			});
		}

	next();
};

// create theme
exports.validateBodyTheme = (req, res, next) => {
	const bodyValid = true;
	if (bodyValid) {
		console.log(colors.green("create theme body is valid"));
	}

	next();
};

// finish activity - create report of activity
exports.validateBodyReport = (req, res, next) => {
	const bodyValid = true;
	if (bodyValid) {
		console.log(colors.green("create report body is valid to finish activity"));
	}

	next();
};
