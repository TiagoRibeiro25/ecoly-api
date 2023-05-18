const express = require("express");
const router = express.Router();
const meetingsController = require("../controllers/meetings.controller");
const meetingsValidator = require("../validators/meetings.validator");
const authController = require("../controllers/auth.controller");

router.get("/:id", meetingsValidator.validateQueries, (req, res) => {
	if (req.query.fields === "ata") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				//next
				meetingsController.getAtaMeeting(req, res);
			});
		});
	}
});

router.post(
	"/",
	meetingsValidator.validateQueries,
	authController.verifyToken,
	authController.verifyIsVerified,
	meetingsController.createMeeting
);

router.patch("/:id", meetingsValidator.validateQueries, (req, res) => {
	if (req.query.fields === "ata") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				//next
				meetingsController.addAta(req, res);
			});
		});
	}
});

router.delete(
	"/:id",
	authController.verifyToken,
	authController.verifyIsAdmin,
	meetingsController.deleteMeeting
);

module.exports = router;
