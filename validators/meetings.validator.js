const colors = require("colors");
const moment = require("moment"); //for dates validation

exports.validateQueries = (req, res, next) => {
	const validQuery = ["fields", "filter"];
	const fieldsValid = "ata";
	const filterValid = ["past", "future"];

	const ObjectKeys = [];

	Object.keys(req.query).forEach((key) => {
		ObjectKeys.push(key);
	});

	// Check if all queries are valid
	const queryValid = ObjectKeys.every((key) => validQuery.includes(key));

	const emptyQuery = ObjectKeys.filter((key) => req.query[key] == "").map(
		(key) => `${key} is empty`
	);

	const isFieldsValid = Object.keys(req.query)
		.filter((key) => key === "fields" && !fieldsValid.includes(req.query[key]))
		.map((key) => `${req.query.fields} is an invalid value for the fields parameter`);

	const isFilterValid = Object.keys(req.query)
		.filter((key) => key === "filter" && !filterValid.includes(req.query[key]))
		.map((key) => `${req.query.filter} is an invalid value for the filter parameter`);

	if (!queryValid) {
		const invalidParams = ObjectKeys.filter((key) => !validQuery.includes(key)).map(
			(key) => `${key} is an invalid  parameter`
		);

		return res.status(400).json({
			success: false,
			error: invalidParams.length > 1 ? invalidParams : invalidParams[0],
		});
	}

	if (emptyQuery.length > 0) {
		return res.status(400).json({
			success: false,
			error: emptyQuery.length > 1 ? emptyQuery : emptyQuery[0],
		});
	}

	if (isFieldsValid.length > 0) {
		return res.status(400).json({
			success: false,
			error: isFieldsValid.length > 1 ? isFieldsValid : isFieldsValid[0],
		});
	}

	if (isFilterValid.length > 0) {
		return res.status(400).json({
			success: false,
			error: isFilterValid.length > 1 ? isFilterValid : isFilterValid[0],
		});
	}

	next();
};

exports.validMeetingBody = (req, res, next) => {
	const validFields = ["date", "description", "room"];

	const stringFields = ["date", "description", "room"];

	const { date } = req.body;

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

	const validStringFields = stringFields
		.filter((key) => typeof req.body[key] !== "string")
		.map((key) => `${key} must be a string`);

	if (validStringFields.length > 0) {
		return res.status(400).json({
			success: false,
			error: validStringFields.length > 1 ? validStringFields : validStringFields[0],
		});
	}

	// check if date is valid
	if (!moment(date, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
		return res.status(400).json({
			success: false,
			error: "date is invalid",
		});
	}

	// check if date is in the past
	if (moment(date).isBefore(moment())) {
		return res.status(400).json({
			success: false,
			error: "date cannot be in the past",
		});
	}

	next();
};

exports.validAtaBody = (req, res, next) => {
	const validFields = ["ata", "images"];

	const stringFields = ["ata"];
	
	const formatImages = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg", "svg+xml", "tiff"];

	const { images } = req.body;

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

	const validStringFields = stringFields
		.filter((key) => typeof req.body[key] !== "string")
		.map((key) => `${key} must be a string`);

	if (validStringFields.length > 0) {
		return res.status(400).json({
			success: false,
			error: validStringFields.length > 1 ? validStringFields : validStringFields[0],
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
