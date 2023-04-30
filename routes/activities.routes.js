const express = require("express");
const router = express.Router();
const activitiesController = require("../controllers/activities.controller");

// POST /api/activities => add an activity / report / theme
router.post("/", (req, res) => {
	// if there is no query
	if (Object.keys(req.query).length === 0) {
		console.log(Object.keys(req.query).length);
		return res.status(400).json({
			error: `you must provide a query fields`,
		});
	}

	// to catch invalid query
	const invalidQuery = Object.keys(req.query).find((key) => key !== "fields");
	if (invalidQuery) {
		return res.status(400).json({
			error: `${invalidQuery} is invalid query`,
		});
	}

	// if the query is empty
	if (req.query.fields === "") {
		return res.status(400).json({
			error: `query fields is empty`,
		});
	}

	// all possible values for the query fields
	const possibleValues = ["activities", "report", "theme"];

	// if the query is not in the possible values
	if (!possibleValues.includes(req.query.fields)) {
		return res.status(400).json({
			error: `invalid value for query fields`,
		});
	} else if (req.query.fields === "activities") {
		return activitiesController.addActivity(req, res);
	} else if (req.query.fields === "report") {
		// return activitiesController.addReport(req, res);
	} else if (req.query.fields === "theme") {
		// return activitiesController.addTheme(req, res);
	}
});

router.all("*", (req, res) => {
	res.status(404).json({ message: "Invalid route" });
});

module.exports = router;
