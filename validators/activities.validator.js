// TODO => include auth validations and body validations

const activitiesController = require("../controllers/activities.controller");

exports.validateQueries = (req, res, next) => {
	const validQueries = ["filter", "schoolId", "fields", "search"];

	const fieldsValid = ["activity", "theme", "report", "activities", "themes", "reports"];
	const filterValid = ["finished", "unfinished", "recent"];

	let responseSent = false; // Flag variable to track whether a response has been sent (to fix the error of headers already sent)

	// if there is no valid query
	const invalidQuery = Object.keys(req.query).find((key) => !validQueries.includes(key));
	if (invalidQuery) {
		responseSent = true; 
		return res.status(400).json({
			success: false,
			error: `${invalidQuery} is a invalid parameter`,
		});
	}

	// if the queries are empty by iterate the array of valid queries
	validQueries.forEach((query) => {
		// if the query is empty
		if (req.query[query] === "") {
			responseSent = true;
			return res.status(400).json({
				success: false,
				error: `${query} is empty`,
			});
		}
	});

	// if the query filter is not valid
	if (req.query.filter && !filterValid.includes(req.query.filter)) {
		responseSent = true;
		return res.status(400).json({
			success: false,
			error: `invalid value for query filter`,
		});
	}

	// if the query fields is not valid
	if (req.query.fields && !fieldsValid.includes(req.query.fields)) {
		responseSent = true;
		return res.status(400).json({
			success: false,
			error: `invalid value for query fields`,
		});
	}

	// the string pattern for schoolId must be numbers only
	const schoolIdPattern = /^[0-9]*$/;
	if (req.query.schoolId && !schoolIdPattern.test(req.query.schoolId)) {
		responseSent = true;
		return res.status(400).json({
			success: false,
			error: `invalid value for query schoolId`,
		});
	}

	// Call next() only if no response has been sent (if passed all validations)
	if (!responseSent) {
		next();
	}
};

exports.foundQuery = (req, res, next) => {
	if (req.query.search) {
		return activitiesController.searchActivities(req, res);
	}
	if (req.query.schoolId) {
		console.log("school"); //for testing purposes
	}

	next();
};
