const express = require("express");
const router = express.Router();
const activitiesController = require("../controllers/activities.controller");

router.post("/", (req, res) => {
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

	if (req.query.fields !== "activities") {
		return res.status(400).json({
			error: `invalid value for query fields`,
		});
	} else {
		return activitiesController.createActivity(req, res);
	}
});

router.all("*", (req, res) => {
	res.status(404).json({ message: "Invalid route" });
});

module.exports = router;
