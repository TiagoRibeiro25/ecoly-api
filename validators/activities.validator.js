const colors = require("colors");
const moment = require("moment"); //library to handle dates validations

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

// validations for create activity
exports.validateBodyActivity = (req, res, next) => {
	// check with the activities model the null fields and if the body has the same fields
	const validFields = [
		"theme_id",
		"title",
		"complexity",
		"final_date",
		"objective",
		"diagnostic",
		"meta",
		"resources",
		"participants",
		"evaluation_indicator",
		"evaluation_method",
		"images",
	];

	const stringFields = [
		"title",
		"final_date",
		"objective",
		"diagnostic",
		"meta",
		"resources",
		"evaluation_indicator",
		"evaluation_method",
		"participants",
	];

	const { theme_id, complexity, final_date, images } = req.body;

	const invalidFields = Object.keys(req.body)
		.filter((key) => !validFields.includes(key))
		.map((key) => `${key} is a invalid field`);

	if (Object.keys(req.body).length === 0) {
		return res.status(400).json({
			success: false,
			error: "body is empty",
		});
	}

	if (invalidFields.length > 1) {
		return res.status(400).json({
			success: false,
			error: invalidFields,
		});
	}

	if (invalidFields.length == 1) {
		return res.status(400).json({
			success: false,
			error: invalidFields[0],
		});
	}

	const nullFields = validFields
		.filter((key) => req.body[key] === undefined)
		.map((key) => `${key} cannot be null`);

	const emptyFields = validFields
		.filter((key) => req.body[key] === "")
		.map((key) => `${key} cannot be empty`);

	if (nullFields.length > 1) {
		return res.status(400).json({
			success: false,
			error: nullFields,
		});
	}

	if (nullFields.length == 1) {
		return res.status(400).json({
			success: false,
			error: nullFields[0],
		});
	}

	if (emptyFields.length > 1) {
		return res.status(400).json({
			success: false,
			error: emptyFields,
		});
	}

	if (emptyFields.length == 1) {
		return res.status(400).json({
			success: false,
			error: emptyFields[0],
		});
	}

	if (isNaN(theme_id)) {
		return res.status(400).json({
			success: false,
			error: "theme_id must be a number",
		});
	}

	if (isNaN(complexity)) {
		return res.status(400).json({
			success: false,
			error: "complexity must be a number",
		});
	}

	if (!(complexity >= 1 && complexity <= 5)) {
		return res.status(400).json({
			success: false,
			error: "complexity must be between 1 and 5",
		});
	}

	// check if final_date is a valid date
	if (!moment(final_date, "YYYY-MM-DD", true).isValid()) {
		return res.status(400).json({
			success: false,
			error: "final_date must be a valid date",
		});
	}

	// check if the year of final_date is greater or equal than the current year
	if (moment(final_date).year() < moment().year()) {
		return res.status(400).json({
			success: false,
			error: "invalid year for final_date",
		});
	}


	if (!Array.isArray(images)) {
		return res.status(400).json({
			success: false,
			error: "images must be an array or list",
		});
	}

	// check if images is an array of strings
	if (!images.every((image) => typeof image === "string")) {
		return res.status(400).json({
			success: false,
			error: "images must be an array of strings",
		});
	}

	// empty string in images array
	if (images.some((image) => image === "")) {
		return res.status(400).json({
			success: false,
			error: "images cannot have empty strings",
		});
	}

	if (images.some((image) => !image.startsWith("data:image/png;base64,"))) {
		return res.status(400).json({
			success: false,
			error: "images must be a valid base64 string",
		});
	}

	const validStringFields = stringFields
		.filter((key) => key === typeof "string")
		.map((key) => `${key} must be a string`);

	if (validStringFields.length > 1) {
		return res.status(400).json({
			success: false,
			error: validStringFields,
		});
	}

	if (validStringFields.length == 1) {
		return res.status(400).json({
			success: false,
			error: validStringFields[0],
		});
	}

	next();
};

// validations for create theme
exports.validateBodyTheme = (req, res, next) => {
	const bodyValid = true;
	if (bodyValid) {
		console.log(colors.green("create theme body is valid"));
	}

	next();
};

// validations for finish activity - create report of activity
exports.validateBodyReport = (req, res, next) => {
	const bodyValid = true;
	if (bodyValid) {
		console.log(colors.green("create report body is valid to finish activity"));
	}

	next();
};
