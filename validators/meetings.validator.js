exports.validateQueries = (req, res, next) => {
	const validQuery = "fields";
	const fieldsValid = "ata";

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


	// check if the query is valid
	if (!queryValid) {
		return res.status(400).json({
			success: false,
			error: `${ObjectKeys[0]} is a invalid parameter`,
		});
	}

    // check if the query is empty
    if (emptyQuery.length == 1) {
        return res.status(400).json({
            success: false,
            error: emptyQuery[0],
        });
    }

    // check if the value for the key fields is valid
    if (isFieldsValid.length == 1) {
        return res.status(400).json({
            success: false,
            error: isFieldsValid[0],
        });
    }

    next();
};


exports.validMeetingBody = (req, res, next) => {};


exports.validAtaBody = (req, res, next) => {};
