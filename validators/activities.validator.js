const moment = require("moment"); //library to handle dates validations

exports.validateQueries = (req, res, next) => {
	const validQueries = ["filter", "school", "fields", "search", "year"];
	const fieldsValid = ["activity", "theme", "activities", "themes", "report"];
	const filterValid = ["finished", "unfinished", "recent"];
	const ObjectKeys = Object.keys(req.query);

	// Check if all queries are valid
	const queriesAreValid = ObjectKeys.every((key) => validQueries.includes(key));

	if (!queriesAreValid) {
		const invalidQueries = ObjectKeys.filter((key) => !validQueries.includes(key)).map(
			(key) => `${key} is an invalid parameter`
		);
		return res.status(400).json({
			success: false,
			error: invalidQueries.length > 1 ? invalidQueries : invalidQueries[0],
		});
	}

	const emptyQueries = ObjectKeys.filter((key) => req.query[key] === "").map(
		(key) => `${key} is empty`
	);

	if (emptyQueries.length > 0) {
		return res
			.status(400)
			.json({ success: false, error: emptyQueries.length > 1 ? emptyQueries : emptyQueries[0] });
	}

	const invalidFields = Object.keys(req.query)
		.filter((key) => key === "fields" && !fieldsValid.includes(req.query[key]))
		.map((key) => `${req.query.fields} is an invalid value for the fields parameter`);

	const invalidFilter = Object.keys(req.query)
		.filter((key) => key === "filter" && !filterValid.includes(req.query[key]))
		.map((key) => `${req.query.filter} is an invalid value for the filter parameter`);

	const allInvalidParams = [...invalidFields, ...invalidFilter];

	if (allInvalidParams.length > 0) {
		return res.status(400).json({
			success: false,
			error: allInvalidParams.length > 1 ? allInvalidParams : allInvalidParams[0],
		});
	}

	if (
		req.method === "GET" &&
		req.query.fields === "activities" &&
		!req.query.school &&
		!req.query.filter
	) {
		return res.status(400).json({ success: false, error: "Missing parameters filter or school" });
	}

	if (
		req.method === "GET" &&
		req.query.fields &&
		!["activities", "themes", "report"].includes(req.query.fields)
	) {
		return res.status(400).json({
			success: false,
			error: `${req.query.fields} is an invalid value for the fields parameter`,
		});
	}

	if (
		(req.method === "POST" || req.method === "PATCH") &&
		req.query.fields &&
		!["activity", "theme"].includes(req.query.fields)
	) {
		return res.status(400).json({
			success: false,
			error: `${req.query.fields} is an invalid value for the fields parameter`,
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
		"initial_date",
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
		"initial_date",
		"final_date",
		"objective",
		"diagnostic",
		"meta",
		"resources",
		"evaluation_indicator",
		"evaluation_method",
		"participants",
	];

	const formatImages = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg", "svg+xml", "tiff"];

	const { theme_id, complexity, initial_date, final_date, images } = req.body;

	const invalidFields = Object.keys(req.body)
		.filter((key) => !validFields.includes(key))
		.map((key) => `${key} is a invalid field`);

	if (Object.keys(req.body).length === 0) {
		return res.status(400).json({
			success: false,
			error: "body is empty",
		});
	}

	if (invalidFields.length > 0) {
		return res.status(400).json({
			success: false,
			error: invalidFields.length > 1 ? invalidFields : invalidFields[0],
		});
	}

	const nullFields = validFields
		.filter((key) => req.body[key] === undefined)
		.map((key) => `${key} cannot be null`);

	const emptyFields = validFields
		.filter((key) => req.body[key] === "")
		.map((key) => `${key} cannot be empty`);

	if (nullFields.length > 0) {
		return res.status(400).json({
			success: false,
			error: nullFields.length > 1 ? nullFields : nullFields[0],
		});
	}

	if (emptyFields.length > 0) {
		return res.status(400).json({
			success: false,
			error: emptyFields.length > 1 ? emptyFields : emptyFields[0],
		});
	}

	if (isNaN(theme_id) || typeof theme_id !== "number") {
		return res.status(400).json({
			success: false,
			error: "theme_id must be a number",
		});
	}

	if (isNaN(complexity) || typeof complexity !== "number") {
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
	if (!moment(initial_date, "YYYY-MM-DD", true).isValid()) {
		return res.status(400).json({
			success: false,
			error: "initial_date must be a valid date",
		});
	}

	// check if the year of final_date is greater or equal than the current year
	if (moment(initial_date).year() < moment().year()) {
		return res.status(400).json({
			success: false,
			error: "invalid year for initial_date",
		});
	}

	if (!moment(final_date, "YYYY-MM-DD", true).isValid()) {
		return res.status(400).json({
			success: false,
			error: "final_date must be a valid date",
		});
	}

	if (moment(final_date).year() < moment().year()) {
		return res.status(400).json({
			success: false,
			error: "invalid year for final_date",
		});
	}

	// check if the initial_date is before the final_date
	if (moment(initial_date).isAfter(moment(final_date))) {
		return res.status(400).json({
			success: false,
			error: "initial_date must be before final_date",
		});
	}

	// check if the final_date is after the initial_date
	if (moment(final_date).isBefore(moment(initial_date))) {
		return res.status(400).json({
			success: false,
			error: "final_date must be after initial_date",
		});
	}

	// check if the initial date is not equal to the final date
	if (moment(initial_date).isSame(moment(final_date))) {
		return res.status(400).json({
			success: false,
			error: "initial_date cannot be equal to final_date",
		});
	}

	// check if the initial date is before the current date
	if (moment(initial_date).isBefore(moment().format("YYYY-MM-DD"))) {
		return res.status(400).json({
			success: false,
			error: "initial_date must be after the current date",
		});
	}

	if (!Array.isArray(images)) {
		return res.status(400).json({
			success: false,
			error: "images must be an array or list",
		});
	}

	// check if images is empty
	if (images.length === 0) {
		return res.status(400).json({
			success: false,
			error: "images are required",
		});
	}

	if (images.length > 4) {
		return res.status(400).json({
			success: false,
			error: "you can only add 4 images",
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

	// check if the images include on of the formatImages array and starting with base64 string
	if (
		!images.every(
			(image) =>
				formatImages.some((format) => image.startsWith(`data:image/${format};base64`)) &&
				image.length > 22
		)
	) {
		return res.status(400).json({
			success: false,
			error: "images must be a valid base64 string",
		});
	}

	const validStringFields = stringFields
		.filter((key) => typeof req.body[key] !== "string")
		.map((key) => `${key} must be a string`);

	if (validStringFields.length > 0) {
		return res.status(400).json({
			success: false,
			error: validStringFields.length > 1 ? validStringFields : validStringFields[0],
		});
	}

	next();
};

// validations for create theme
exports.validateBodyTheme = (req, res, next) => {
	const validField = "name";
	const key = Object.keys(req.body)[0];

	if (!key) {
		return res.status(400).json({
			success: false,
			error: "body is empty",
		});
	}

	if (key !== validField) {
		return res.status(400).json({
			success: false,
			error: `${key} is not a valid field`,
		});
	}

	if (!req.body[key]) {
		return res.status(400).json({
			success: false,
			error: `${key} cannot be empty`,
		});
	}

	if (typeof req.body[key] !== "string") {
		return res.status(400).json({
			success: false,
			error: `${key} must be a string`,
		});
	}

	if (
		!images.every(
			(image) =>
				formatImages.some((format) => image.startsWith(`data:image/${format};base64`)) &&
				image.length > 22
		)
	) {
		return res.status(400).json({
			success: false,
			error: "images must be a valid base64 string",
		});
	}

	next();
};

// validations for finish activity - create report of activity
exports.validateBodyReport = (req, res, next) => {
	const validFields = ["images", "report"];

	const formatImages = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg", "svg+xml", "tiff"];

	const { images, report } = req.body;

	// check invalid fields and return for each key the error
	if (Object.keys(req.body).length === 0) {
		return res.status(400).json({
			success: false,
			error: "body is empty",
		});
	}

	const invalidFields = Object.keys(req.body)
		.filter((key) => !validFields.includes(key))
		.map((key) => `${key} is not a valid field`);

	if (invalidFields.length > 0) {
		return res.status(400).json({
			success: false,
			error: invalidFields.length > 1 ? invalidFields : invalidFields[0],
		});
	}

	const emptyFields = validFields
		.filter((key) => req.body[key] === "")
		.map((key) => `${key} cannot be empty`);

	if (emptyFields.length > 0) {
		return res.status(400).json({
			success: false,
			error: emptyFields.length > 1 ? emptyFields : emptyFields[0],
		});
	}

	const nullFields = validFields
		.filter((key) => req.body[key] === undefined)
		.map((key) => `${key} cannot be null`);

	if (nullFields.length > 0) {
		return res.status(400).json({
			success: false,
			error: nullFields.length > 1 ? nullFields : nullFields[0],
		});
	}

	if (typeof report !== "string") {
		return res.status(400).json({
			success: false,
			error: "report must be a string",
		});
	}

	if (!Array.isArray(images)) {
		return res.status(400).json({
			success: false,
			error: "images must be an array or list",
		});
	}

	// check if images is empty
	if (images.length === 0) {
		return res.status(400).json({
			success: false,
			error: "images are required",
		});
	}

	if (images.length > 4) {
		return res.status(400).json({
			success: false,
			error: "you can only add 4 images",
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

	next();
};
