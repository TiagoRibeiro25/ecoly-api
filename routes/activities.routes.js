const express = require("express");
const router = express.Router();
const activitiesController = require("../controllers/activities.controller");
const activitiesValidator = require("../validators/activities.validator");
const authController = require("../controllers/auth.controller");

// GET /api/activities
router.get("/", activitiesValidator.validateQueries, (req, res) => {
	// first validate queries and then execute the next parameter
	if (req.query.search) {
		return activitiesController.searchActivities(req, res);
	}

	if (req.query.fields === "activities" && req.query.school) {
		if (req.query.filter === "finished") {
				return authController.verifyToken(req, res, () => {
					//next
					authController.verifyIsVerified(req, res, () => {
						//next
						activitiesController.getFinishedSchoolActivities(req, res);
					});
				}
			);
		}
		if (req.query.filter === "unfinished") {
				return authController.verifyToken(req, res, () => {
					//next
						activitiesController.getUnfinishedSchoolActivities(req, res);
					
				}
			);
		}
	}

	if (req.query.fields === "activities" && req.query.filter === "unfinished") {
		return activitiesController.getUnfinishedActivities(req, res);
	}
	if (req.query.fields === "activities" && req.query.filter === "recent") {
		return activitiesController.getRecentActivities(req, res);
	}

	if (req.query.fields === "themes") {
		// need to pass the two auth middleware´s first to return the themes controller
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				//next
				activitiesController.getThemes(req, res); // return themes controller
			});
		});
	} else {
		return res.status(400).json({
			success: false,
			error: "provide parameters",
		});
	}
});

// GET /api/activities/:id => find a specific activity (activity detail)
router.get("/:id", activitiesValidator.validateQueries, (req, res) => {
	if(req.query.fields === "report"){
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				//next
				activitiesController.getReport(req, res);
			});
		}
	);
	}
	else{
		return activitiesController.getDetailActivity(req, res);
	}
});


// POST /api/activities => add an activity/ theme
router.post("/", activitiesValidator.validateQueries, (req, res) => {
	if (req.query.fields === "activity") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				// next
				activitiesValidator.validateBodyActivity(req, res, () => {
					// next
					activitiesController.addActivity(req, res);
				});
			});
		});
	}
	if (req.query.fields === "theme") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				// next
				activitiesValidator.validateBodyTheme(req, res, () => {
					// next
					activitiesController.addTheme(req, res);
				});
			});
		});
	}
});

// PATCH /api/activities/:id => finish an activity/ disable a theme
router.patch("/:id", activitiesValidator.validateQueries, (req, res) => {
	if (req.query.fields === "activity") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				// next
				activitiesValidator.validateBodyReport(req, res, () => {
					// next
					activitiesController.finishActivity(req, res);
				});
			});
		});
	}
	if (req.query.fields === "theme") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				// next
				activitiesController.disabledTheme(req, res);
			});
		});
	}
});

// DELETE /api/activities/:id => delete an activity
router.delete(
	"/:id",
	authController.verifyToken,
	authController.verifyIsVerified,
	activitiesController.deleteActivity
);

module.exports = router;
