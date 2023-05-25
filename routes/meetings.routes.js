const express = require("express");
const router = express.Router();
const meetingsController = require("../controllers/meetings.controller");
const meetingsValidator = require("../validators/meetings.validator");
const authController = require("../controllers/auth.controller");

router.get("/", meetingsValidator.validateQueries, (req, res) => {
	if (req.query.filter === "past") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				//next
				meetingsController.getPastMeetings(req, res);
			});
		});
	}
	if (req.query.filter === "future") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				//next
				meetingsController.getFutureMeetings(req, res);
			});
		});
	}
});

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
	if (req.query.filter === "future") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				//next
				meetingsController.getOneFutureMeeting(req, res);
			});
		});
	}

	if (req.query.filter === "past") {
		return authController.verifyToken(req, res, () => {
			//next
			authController.verifyIsVerified(req, res, () => {
				//next
				meetingsController.getOnePastMeeting(req, res);
			});
		});
	}
});

router.post(
	"/",
	meetingsValidator.validateQueries,
	authController.verifyToken,
	authController.verifyIsVerified,
	meetingsValidator.validMeetingBody,
	meetingsController.createMeeting
);

router.patch("/:id", meetingsValidator.validateQueries, (req, res) => {
	if (req.query.fields === "ata") {
		return authController.verifyToken(req, res, () => {
			authController.verifyIsVerified(req, res, () => {
				meetingsValidator.validAtaBody(req, res, () => {
					meetingsController.addAta(req, res);
				});
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
