const colors = require("colors");
const moment = require("moment"); //for dates validation

exports.validateQueries = (req, res, next) => {
	const validQuery = ["fields", "filter","school"];
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
    let body = true;

    if(body){
        console.log(colors.green("Body meeting is valid"));
    }

    next();
};

exports.validAtaBody = (req, res, next) => {
    let body = true;

    if(body){
        console.log(colors.green("Body ata is valid"));
    }

    next();
};
