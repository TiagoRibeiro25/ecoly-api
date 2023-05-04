exports.validateQueries = (req, res, next) => {
	const validQueries = ['filter', 'schoolId', ];
	// valid values for the queries
	const validValues = [];
	
	// if there is no query
	if (Object.keys(req.query).length === 0) {
		return res.status(400).json({
			error: `you must provide a query`,
		});
	}

	

	
    next();
};