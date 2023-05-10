const express = require("express");
const router = express.Router();
const activitiesController = require("../controllers/activities.controller");
const activitiesValidator = require("../validators/activities.validator");

// GET /api/activities
router.route("/").get(
	// add auth middleware to see the report
	activitiesValidator.validateQueries,
	activitiesValidator.foundQuery
	// activitiesController.getAllActivities,
	// activitiesController.searchActivities,
	// activitiesController.getFinishedActivities,
	// activitiesController.getUnfinishedActivities,
	// activitiesController.getRecentActivities,
	// activitiesController.getSchoolActivities,
	// activitiesController.getFinishedSchoolActivities,
	// activitiesController.getUnfinishedSchoolActivities,
	// activitiesController.getRecentSchoolActivities,
	// activitiesController.getReports,
	// activitiesController.getThemes
);

// GET /api/activities/:id => find a specific activity (activity detail)
router.get("/:id", activitiesController.getOneActivity);

// TODO => add validation Queries middleware
// POST /api/activities => add an activity / report / theme

// TODO=> add body validation middleware
//TODO => add auth validation middleware
router.route("/").post(
	activitiesValidator.validateQueries,
	activitiesValidator.foundQuery
	// activitiesController.addActivity,
	// activitiesController.addTheme
);

//TODO => add body validation middleware
//TODO => add auth validation middleware
router.route("/:id").patch(
	activitiesValidator.validateQueries,
	activitiesValidator.foundQuery
	// activitiesController.finishActivity,
	// activitiesController.disabledTheme
);

//TODO => add auth validation middleware
router.route("/:id").delete(
	activitiesValidator.validateQueries,
	activitiesValidator.foundQuery
	// activitiesController.deleteActivity
);

module.exports = router;
